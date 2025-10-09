import { Client } from '@notionhq/client';
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

/**
 * Vercel KVからログを取得してNotionにエクスポート
 */
export async function exportLogsToNotion(date: string): Promise<ExportResult> {
  const notion = new Client({
    auth: process.env.NOTION_API_TOKEN
  });

  const databaseId = process.env.NOTION_DATABASE_ID;

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
        // ログデータを取得
        const logDataStr = await kv.get(`log:${logId}`) as string | null;

        if (!logDataStr) {
          results.skipped++;
          continue;
        }

        const logData: ChatLog = JSON.parse(logDataStr);

        // 重複チェック（日付+時刻で判定）
        const existing = await notion.databases.query({
          database_id: databaseId,
          filter: {
            and: [
              {
                property: '対象日付',
                date: { equals: logData.date }
              },
              {
                property: '時刻',
                title: { equals: logData.time }
              },
              {
                property: 'クエリ',
                rich_text: { equals: logData.query }
              }
            ]
          }
        });

        if (existing.results.length > 0) {
          // 既存レコードをアーカイブ
          for (const page of existing.results) {
            await notion.pages.update({
              page_id: page.id,
              properties: {
                'ステータス': {
                  select: { name: 'アーカイブ' }
                }
              }
            });
          }
          console.log(`Archived duplicate log: ${logId}`);
        }

        // 新規作成
        await notion.pages.create({
          parent: { database_id: databaseId },
          properties: {
            '対象日付': {
              date: { start: logData.date }
            },
            '時刻': {
              title: [{ text: { content: logData.time } }]
            },
            'クエリ': {
              rich_text: [{ text: { content: logData.query.substring(0, 2000) } }]
            },
            '返答': {
              rich_text: [{ text: { content: logData.response.substring(0, 2000) } }]
            },
            '処理時間': {
              number: logData.processingTime || 0
            },
            'IPアドレス': {
              rich_text: logData.clientIp ? [{ text: { content: logData.clientIp } }] : []
            },
            '場所': {
              rich_text: logData.location ? [{ text: { content: logData.location } }] : []
            },
            'メール': {
              email: logData.userEmail || null
            },
            'ステータス': {
              select: { name: '完了' }
            }
          }
        });

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
