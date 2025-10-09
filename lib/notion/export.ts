import { kv } from '@/lib/kv';

export interface ChatLog {
  id: string;
  sessionId: string;
  date: string;
  time: string;
  query: string;
  response: string;
  processingTime: number;
  clientIp: string | null;
  userEmail: string | null;
  location?: string | null;
}

export interface ExportResult {
  success: number;
  skipped: number;
  errors: number;
  errorDetails: string[];
}

export interface ConversationLog {
  sessionId: string;
  email: string;
  messages: Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp?: string;
  }>;
  clientIp: string | null;
}

/**
 * Vercel KVからログを取得してNotionにエクスポート
 */
export async function exportLogsToNotion(date: string): Promise<ExportResult> {
  const notionToken = process.env.NOTION_API_TOKEN;
  const databaseId = process.env.NOTION_DATABASE_ID;

  if (!notionToken) {
    throw new Error('NOTION_API_TOKEN is not set');
  }

  if (!databaseId) {
    throw new Error('NOTION_DATABASE_ID is not set');
  }

  const results: ExportResult = {
    success: 0,
    skipped: 0,
    errors: 0,
    errorDetails: []
  };

  try {
    // Vercel KVから対象日のログID一覧を取得
    const logIds = await kv.lrange(`logs:${date}`, 0, -1) as string[];

    console.log(`Found ${logIds.length} logs for ${date}`);

    for (const logId of logIds) {
      try {
        // エクスポート済みフラグをチェック
        const exportedFlag = await kv.get(`exported_to_notion:${logId}`) as string | null;

        if (exportedFlag === 'true') {
          console.log(`Skipping already exported log: ${logId}`);
          results.skipped++;
          continue;
        }

        // ログデータを取得
        const logDataStr = await kv.get(`log:${logId}`) as string | null;

        if (!logDataStr) {
          results.skipped++;
          continue;
        }

        const logData: ChatLog = JSON.parse(logDataStr);

        // 日付と時刻を組み合わせてISO 8601形式に
        const dateTime = `${logData.date}T${logData.time}`;

        // 重複チェック（日付+時刻で判定）- Notion REST APIを直接使用
        const queryResponse = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${notionToken}`,
            'Notion-Version': '2022-06-28',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            filter: {
              and: [
                { property: '時刻', date: { equals: dateTime } },
                { property: 'クエリ', title: { equals: logData.query } }
              ]
            }
          })
        });

        const queryData = await queryResponse.json();

        if (queryData.results && queryData.results.length > 0) {
          // 既存レコードがある場合はスキップ（エクスポート済みフラグを設定）
          await kv.setex(`exported_to_notion:${logId}`, 604800, 'true');
          console.log(`Skipping duplicate log (already exists in Notion): ${logId}`);
          results.skipped++;
          continue;
        }

        // 新規作成 - Notion REST APIを直接使用
        const createResponse = await fetch('https://api.notion.com/v1/pages', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${notionToken}`,
            'Notion-Version': '2022-06-28',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            parent: { database_id: databaseId },
            properties: {
              '対象日付': { date: { start: logData.date } },
              '時刻': { date: { start: dateTime } },
              'クエリ': { title: [{ text: { content: logData.query.substring(0, 100) } }] },
              '返答': { rich_text: [{ text: { content: logData.response.substring(0, 2000) } }] },
              '処理時間': { number: logData.processingTime || 0 },
              'IPアドレス': { rich_text: logData.clientIp ? [{ text: { content: logData.clientIp } }] : [] },
              '場所': { rich_text: logData.location ? [{ text: { content: logData.location } }] : [] },
              'メール': { email: logData.userEmail || null },
              'ステータス': { select: { name: '完了' } }
            }
          })
        });

        if (!createResponse.ok) {
          const errorData = await createResponse.json();
          throw new Error(`Notion API error: ${JSON.stringify(errorData)}`);
        }

        // エクスポート済みフラグを設定（7日間保持）
        await kv.setex(`exported_to_notion:${logId}`, 604800, 'true');

        results.success++;
        console.log(`Exported log: ${logId}`);

        // API制限対策（3req/sec → 2req/secに抑える）
        if ((results.success % 2) === 0) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }

      } catch (error) {
        results.errors++;
        const errorMsg = error instanceof Error ? error.message : 'Unknown error';
        results.errorDetails.push(`Log ${logId}: ${errorMsg}`);
        console.error(`Failed to export log ${logId}:`, error);
      }
    }

    console.log('Export completed:', results);
    return results;

  } catch (error) {
    console.error('Export failed:', error);
    throw error;
  }
}

/**
 * セッションからチャットログを作成
 */
export async function createChatLog(
  sessionId: string,
  query: string,
  response: string,
  processingTime: number,
  clientIp?: string
): Promise<void> {
  const now = new Date();
  const date = now.toISOString().split('T')[0];
  const time = now.toISOString().split('T')[1].split('.')[0];

  const logId = `${date}_${time}_${sessionId}`;

  const logData: ChatLog = {
    id: logId,
    sessionId,
    date,
    time,
    query,
    response,
    processingTime,
    clientIp: clientIp || null,
    userEmail: null, // 後から紐付け
    location: null
  };

  try {
    // Vercel KVに保存（7日間保持）
    await kv.setex(`log:${logId}`, 604800, JSON.stringify(logData));

    // 日付ごとのログリストに追加
    await kv.lpush(`logs:${date}`, logId);

    console.log(`Chat log created: ${logId}`);
  } catch (error) {
    console.error('Failed to create chat log:', error);
  }
}

/**
 * 既存ログにメールアドレスを追記
 */
export async function updateLogsWithEmail(
  sessionId: string,
  clientIp: string,
  email: string
): Promise<number> {
  const today = new Date().toISOString().split('T')[0];
  let updatedCount = 0;

  try {
    const logIds = await kv.lrange(`logs:${today}`, 0, -1) as string[];

    for (const logId of logIds) {
      const logDataStr = await kv.get(`log:${logId}`) as string | null;

      if (logDataStr) {
        const logData: ChatLog = JSON.parse(logDataStr);

        // セッションIDまたはIPアドレスが一致する場合
        if (logData.sessionId === sessionId || logData.clientIp === clientIp) {
          logData.userEmail = email;
          await kv.setex(`log:${logId}`, 604800, JSON.stringify(logData));
          updatedCount++;
        }
      }
    }

    console.log(`Updated ${updatedCount} logs with email: ${email}`);
    return updatedCount;

  } catch (error) {
    console.error('Failed to update logs with email:', error);
    return 0;
  }
}

/**
 * 会話全体を1レコードとしてNotionにエクスポート（メール送信時）
 */
export async function exportConversationToNotion(
  conversation: ConversationLog
): Promise<{ success: boolean; error?: string }> {
  const notionToken = process.env.NOTION_API_TOKEN;
  const databaseId = process.env.NOTION_DATABASE_ID;

  if (!notionToken || !databaseId) {
    throw new Error('NOTION_API_TOKEN or NOTION_DATABASE_ID is not set');
  }

  try {
    const now = new Date();
    const date = now.toISOString().split('T')[0];
    const dateTime = now.toISOString();

    // 📝 会話全体を結合（クエリと返答）
    // フロントエンドから送られたメッセージをそのまま使用
    // （チャットモーダルに表示されている内容のみ）
    let combinedQuery = '';
    let combinedResponse = '';

    let questionCount = 0;
    let answerCount = 0;

    conversation.messages.forEach((msg) => {
      if (msg.role === 'user') {
        questionCount++;
        combinedQuery += `【質問${questionCount}】\n${msg.content}\n\n`;
      } else if (msg.role === 'assistant') {
        answerCount++;
        combinedResponse += `【回答${answerCount}】\n${msg.content}\n\n`;
      }
    });

    // セッションIDベースの重複チェック
    const queryResponse = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${notionToken}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        filter: {
          and: [
            { property: 'メール', email: { equals: conversation.email } },
            { property: '対象日付', date: { equals: date } }
          ]
        }
      })
    });

    const queryData = await queryResponse.json();

    // 既存レコードがある場合は更新
    if (queryData.results && queryData.results.length > 0) {
      const existingPage = queryData.results[0];

      await fetch(`https://api.notion.com/v1/pages/${existingPage.id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${notionToken}`,
          'Notion-Version': '2022-06-28',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          properties: {
            '時刻': { date: { start: dateTime } },
            'クエリ': { title: [{ text: { content: combinedQuery.substring(0, 100) } }] },
            '返答': { rich_text: [{ text: { content: combinedResponse.substring(0, 2000) } }] },
            'IPアドレス': { rich_text: conversation.clientIp ? [{ text: { content: conversation.clientIp } }] : [] },
            'ステータス': { select: { name: '完了' } }
          }
        })
      });

      console.log(`Updated existing conversation in Notion for session: ${conversation.sessionId}`);
      return { success: true };
    }

    // 新規作成
    const createResponse = await fetch('https://api.notion.com/v1/pages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${notionToken}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        parent: { database_id: databaseId },
        properties: {
          '対象日付': { date: { start: date } },
          '時刻': { date: { start: dateTime } },
          'クエリ': { title: [{ text: { content: combinedQuery.substring(0, 100) } }] },
          '返答': { rich_text: [{ text: { content: combinedResponse.substring(0, 2000) } }] },
          '処理時間': { number: 0 },
          'IPアドレス': { rich_text: conversation.clientIp ? [{ text: { content: conversation.clientIp } }] : [] },
          '場所': { rich_text: [] },
          'メール': { email: conversation.email },
          'ステータス': { select: { name: '完了' } }
        }
      })
    });

    if (!createResponse.ok) {
      const errorData = await createResponse.json();
      throw new Error(`Notion API error: ${JSON.stringify(errorData)}`);
    }

    console.log(`Exported conversation to Notion for session: ${conversation.sessionId}`);
    return { success: true };

  } catch (error) {
    console.error('Failed to export conversation to Notion:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}
