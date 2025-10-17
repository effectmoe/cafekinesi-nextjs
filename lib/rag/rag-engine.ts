import { vectorSearch, hybridSearch } from '@/lib/db/document-vector-operations';
import { kv } from '@/lib/kv';
import { publicClient } from '@/lib/sanity.client';
import { groq } from 'next-sanity';

export class RAGEngine {
  async initialize() {
    // document_embeddingsテーブルは常に利用可能
    console.log('✅ RAG Engine initialized (using document_embeddings)');
  }

  // RAG応答生成
  async generateAugmentedResponse(query: string, config: any) {
    console.log('🤖 RAG応答生成中... (document_embeddings)');
    console.log('📝 クエリ:', query);

    // 集計質問を検出（「何個」「何人」「全部で」など）
    const isAggregationQuery = this.isAggregationQuery(query);
    console.log('🔢 集計質問?', isAggregationQuery);

    // インストラクター関連の質問を検出
    const isInstructorQuery = this.isInstructorRelatedQuery(query);
    console.log('👩‍🏫 インストラクター質問?', isInstructorQuery);

    // イベント関連の質問を検出
    const isEventQuery = this.isEventRelatedQuery(query);
    console.log('📅 イベント質問?', isEventQuery);

    // 1. データ取得
    let searchResults;

    if (isAggregationQuery) {
      // 集計質問の場合はAI Knowledge APIから全件取得
      console.log('🔢 集計質問を検出: AI Knowledge APIから全件取得...');
      searchResults = await this.fetchFromKnowledgeAPI(query);
    } else if (isEventQuery) {
      // イベント質問の場合は専用設定でハイブリッド検索（document_embeddingsテーブルから）
      // ベクトル検索 + 全文検索を組み合わせることで、キーワードマッチングも活用
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('📅 [EVENT SEARCH] イベント検索がトリガーされました');
      console.log('🔍 [EVENT SEARCH] クエリ:', query);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      searchResults = await hybridSearch(query, {
        topK: 30,
        threshold: 0.03, // より低い閾値で幅広く取得
        type: 'event'
      });
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('📊 [EVENT SEARCH] 検索結果:', searchResults.length, '件');
      if (searchResults.length > 0) {
        searchResults.slice(0, 5).forEach((result: any, idx: number) => {
          console.log(`  ${idx + 1}. スコア: ${result.combined_score?.toFixed(3)} (vector: ${result.vector_score?.toFixed(3)}, text: ${result.text_score?.toFixed(3)}) - ${result.title}`);
        });
      } else {
        console.warn('⚠️  [EVENT SEARCH] PostgreSQL検索結果が0件！Sanity APIへフォールバック...');
        // フォールバック: Sanity APIから直接取得
        searchResults = await this.fetchFromKnowledgeAPI(query);
        console.log('📊 [EVENT SEARCH FALLBACK] Sanityから取得:', searchResults.length, '件');
      }
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    } else if (isInstructorQuery) {
      // インストラクター質問の場合は専用設定
      console.log('👩‍🏫 インストラクター専用検索を実行...');
      searchResults = await vectorSearch(query, {
        topK: 50,
        threshold: 0.05,
        type: 'instructor'
      });
    } else {
      // 通常質問はハイブリッド検索を使用
      searchResults = await hybridSearch(query, {
        topK: config.vectorSearch?.topK || 20,
        threshold: config.vectorSearch?.threshold || 0.15
      });
    }

    // 結果を旧形式に変換（互換性のため）
    const formattedResults = searchResults.map((result: any) => ({
      content: result.content,
      metadata: {
        ...result.metadata,
        type: result.type,
        name: result.title,
        location: result.metadata?.prefecture || result.url,
      },
      similarity: result.similarity || result.vector_score || result.combined_score
    }))

    // 2. Web検索（有効な場合）
    let webResults: any[] = [];
    if (config.webSearch?.enabled) {
      webResults = await this.searchWeb(query, config.webSearch);
    }

    // 3. 複数条件のイベントフィルタリング（プログラムで厳密に処理）
    const { filtered: filteredResults, filterInfo } = this.filterEventsByConditions(query, formattedResults);

    // 4. コンテキスト構築
    const context = this.buildContext(filteredResults, webResults, config) + filterInfo;

    // 5. プロンプト構築
    // 比較質問の検出と事前計算された答え
    const isComparisonQuery = /最も|一番|どれ|どちら|比較|安い|高い|早い|遅い|新しい|古い/.test(query);
    const isCheapestQuery = /最も.*安|一番.*安|お金.*かからない|お求めやすい|低価格/.test(query);
    const isMostExpensiveQuery = /最も.*高|一番.*高|最高.*価格/.test(query);

    // イベント価格を事前計算
    let precomputedAnswer = '';
    if (isComparisonQuery && (isCheapestQuery || isMostExpensiveQuery)) {
      const events = formattedResults.filter((r: any) =>
        r.metadata?.type === 'event' || r.type === 'event'
      );

      if (events.length > 0) {
        const eventPrices = events
          .map((e: any) => {
            const priceMatch = e.content.match(/参加費[：:]\s*¥?([\d,]+)/);
            const price = priceMatch ? parseInt(priceMatch[1].replace(/,/g, '')) : null;
            const titleMatch = e.content.match(/イベント[：:]\s*([^\n]+)/);
            const title = titleMatch ? titleMatch[1].trim() : e.metadata?.title || e.title || '不明';
            const statusMatch = e.content.match(/ステータス[：:]\s*([^\n]+)/);
            const status = statusMatch ? statusMatch[1].trim() : '';
            return { title, price, status };
          })
          .filter((e: any) => e.price !== null)
          .sort((a: any, b: any) => a.price - b.price);

        if (eventPrices.length > 0) {
          if (isCheapestQuery) {
            const cheapest = eventPrices[0];
            precomputedAnswer = `【正解】最もお求めやすいイベントは「${cheapest.title}」で、参加費は¥${cheapest.price.toLocaleString()}です。`;
            console.log('💡 最安値イベント検出:', cheapest.title, cheapest.price);
          } else if (isMostExpensiveQuery) {
            const mostExpensive = eventPrices[eventPrices.length - 1];
            precomputedAnswer = `【正解】最も高いイベントは「${mostExpensive.title}」で、参加費は¥${mostExpensive.price.toLocaleString()}です。`;
            console.log('💡 最高値イベント検出:', mostExpensive.title, mostExpensive.price);
          }
        }
      }
    }

    if (precomputedAnswer) {
      console.log('✅ 事前計算された答えをプロンプトに追加:', precomputedAnswer);
    }

    const augmentedPrompt = `
以下のコンテキスト情報を基に質問に答えてください。

${precomputedAnswer ? `${precomputedAnswer}\n\n**この正解を必ずそのまま使用して回答してください。**\n\n` : ''}【コンテキスト】
${context}

【質問】
${query}

【回答指針】
- **必ずコンテキストに記載されている情報を正確に使用してください**
- 価格、日時、数量などの数値情報は、コンテキストから**正確に引用**してください
${isComparisonQuery ? '- 【重要】価格比較の質問の場合：' : ''}
${isComparisonQuery ? '  1. まず「【重要】イベント価格比較表（安い順）」を確認してください' : ''}
${isComparisonQuery ? '  2. 「最も安い」と聞かれたら → 表の1位のイベントを答えてください' : ''}
${isComparisonQuery ? '  3. 「最も高い」と聞かれたら → 表の最後の順位のイベントを答えてください' : ''}
${isComparisonQuery ? '  4. 表に明示されている「⚠️ 最も安い = 1位（イベント名）」を必ず参照してください' : ''}
${isComparisonQuery ? '  5. 自分で計算や比較をせず、表の順位をそのまま使用してください' : ''}
- インストラクター情報がある場合は、名前、専門分野、地域、経歴などを詳しく紹介してください
- 部分的な情報でも積極的に提供し、ユーザーに価値のある回答を心がけてください
- 親切で温かい口調で、Cafe Kinesiのアシスタントとしてお答えください
- **推測や想像で答えず、コンテキストに基づいた正確な情報のみを提供してください**
    `;

    return {
      prompt: augmentedPrompt,
      sources: this.extractSources(formattedResults, webResults),
      confidence: this.calculateConfidence(formattedResults),
      searchResults: formattedResults,
      webResults: webResults
    };
  }

  // Web検索（簡易版）
  private async searchWeb(query: string, config: any): Promise<any[]> {
    // DuckDuckGo APIを使用（無料）
    console.log('🌐 Web検索実行中...');

    try {
      // 簡易的なWeb検索の実装
      // 実際のプロダクションでは適切なWeb検索APIを使用
      const searchQuery = encodeURIComponent(query);

      // ここでは空の配列を返す（実装は後で拡張可能）
      console.log(`Web検索クエリ: ${searchQuery}`);
      return [];
    } catch (error) {
      console.error('Web検索エラー:', error);
      return [];
    }
  }

  // コンテキスト構築
  private buildContext(vectorResults: any[], webResults: any[], config: any): string {
    const internalWeight = config.integration?.internalWeight || 0.7;
    const externalWeight = config.integration?.externalWeight || 0.3;

    let context = '';

    // 内部情報
    if (vectorResults.length > 0) {
      context += '【サイト内情報】\n';
      vectorResults.forEach((r, index) => {
        context += `${index + 1}. ${r.content}\n`;
      });

      // イベントデータがある場合は、価格の一覧表も追加
      const events = vectorResults.filter((r: any) =>
        r.metadata?.type === 'event' || r.type === 'event'
      );

      if (events.length > 0) {
        context += '\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n';
        context += '【重要】イベント価格比較表（安い順）\n';
        context += '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n';
        // 価格を抽出してソート
        const eventPrices = events
          .map((e: any) => {
            // コンテンツから価格を抽出（¥の後の数字、カンマを含む）
            const priceMatch = e.content.match(/参加費[：:]\s*¥?([\d,]+)/);
            const price = priceMatch ? parseInt(priceMatch[1].replace(/,/g, '')) : null;
            const titleMatch = e.content.match(/イベント[：:]\s*([^\n]+)/);
            const title = titleMatch ? titleMatch[1].trim() : e.metadata?.title || e.title || '不明';
            // ステータスも抽出
            const statusMatch = e.content.match(/ステータス[：:]\s*([^\n]+)/);
            const status = statusMatch ? statusMatch[1].trim() : '';
            return { title, price, status };
          })
          .filter((e: any) => e.price !== null)
          .sort((a: any, b: any) => a.price - b.price);

        eventPrices.forEach((e: any, idx: number) => {
          const statusText = e.status ? ` [${e.status}]` : '';
          context += `${idx + 1}位. ${e.title}: ¥${e.price.toLocaleString()}${statusText}\n`;
        });

        context += '\n⚠️ 価格比較の際は、必ずこの表の順位を参照してください\n';
        context += `⚠️ 最も安い = 1位（${eventPrices[0].title}）\n`;
        context += `⚠️ 最も高い = ${eventPrices.length}位（${eventPrices[eventPrices.length - 1].title}）\n`;
        context += '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n';
      }
    }

    // 外部情報
    if (webResults.length > 0) {
      context += '\n【Web情報】\n';
      webResults.forEach((r, index) => {
        context += `${index + 1}. ${r.content}\n`;
      });
    }

    if (!context) {
      context = '利用可能な関連情報が見つかりませんでした。';
    }

    return context;
  }

  // ソース抽出
  private extractSources(vectorResults: any[], webResults: any[]) {
    const sources = [
      ...vectorResults.map(r => ({
        type: 'internal',
        content: r.content.substring(0, 100) + '...',
        metadata: r.metadata,
        score: r.combined_score || r.vector_score
      })),
      ...webResults.map(r => ({
        type: 'external',
        content: r.content?.substring(0, 100) + '...',
        url: r.url,
        title: r.title
      }))
    ];

    return sources;
  }

  // イベントの複数条件フィルタリング（プログラムで厳密に処理）
  private filterEventsByConditions(query: string, results: any[]): { filtered: any[], filterInfo: string } {
    const events = results.filter((r: any) => r.metadata?.type === 'event' || r.type === 'event');

    if (events.length === 0) {
      return { filtered: results, filterInfo: '' };
    }

    // 条件を抽出
    const locationMatch = query.match(/(東京|大阪|名古屋|福岡|札幌|仙台|広島|神戸|京都|横浜|千葉|埼玉|渋谷|新宿|池袋)/);
    const isOnlineQuery = /オンライン|online/i.test(query);
    const priceMatch = query.match(/(\d+)円以下|(\d+)円以内|予算\s*(\d+)|(\d+)円/);
    const isOpenQuery = /受付中|参加できる|空き|申し込める|予約.*でき|予約.*可能|予約.*したい/.test(query);

    // 時間軸の条件を抽出
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1; // 0-indexed
    const nextMonth = currentMonth === 12 ? 1 : currentMonth + 1;
    const nextMonthYear = currentMonth === 12 ? currentYear + 1 : currentYear;

    const isThisMonthQuery = /今月|this month/i.test(query);
    const isNextMonthQuery = /来月|next month/i.test(query);
    const isThisWeekQuery = /今週|this week/i.test(query);
    const isNextWeekQuery = /来週|next week/i.test(query);

    let filteredEvents = [...events];
    const conditions: string[] = [];

    // 場所フィルタ
    if (locationMatch) {
      const location = locationMatch[1];
      conditions.push(`場所: ${location}`);
      filteredEvents = filteredEvents.filter((e: any) => {
        const eventLocation = e.content.match(/場所[：:]\s*([^\n]+)/)?.[1] || '';
        return eventLocation.includes(location);
      });
    } else if (isOnlineQuery) {
      conditions.push('場所: オンライン');
      filteredEvents = filteredEvents.filter((e: any) => {
        const eventLocation = e.content.match(/場所[：:]\s*([^\n]+)/)?.[1] || '';
        return eventLocation.includes('オンライン');
      });
    }

    // 価格フィルタ
    if (priceMatch) {
      const maxPrice = parseInt(priceMatch[1] || priceMatch[2] || priceMatch[3] || priceMatch[4]);
      conditions.push(`価格: ¥${maxPrice.toLocaleString()}以下`);
      filteredEvents = filteredEvents.filter((e: any) => {
        const priceMatch = e.content.match(/参加費[：:]\s*¥?([\d,]+)/);
        if (!priceMatch) return false;
        const price = parseInt(priceMatch[1].replace(/,/g, ''));
        return price <= maxPrice;
      });
    }

    // ステータスフィルタ
    if (isOpenQuery) {
      conditions.push('ステータス: 受付中');
      filteredEvents = filteredEvents.filter((e: any) => {
        const statusMatch = e.content.match(/ステータス[：:]\s*([^\n]+)/);
        const status = statusMatch ? statusMatch[1].trim() : '';
        return status === '受付中';
      });
    }

    // 時間軸フィルタ
    if (isThisMonthQuery || isNextMonthQuery) {
      const targetMonth = isThisMonthQuery ? currentMonth : nextMonth;
      const targetYear = isThisMonthQuery ? currentYear : nextMonthYear;
      conditions.push(`時期: ${targetYear}年${targetMonth}月${isThisMonthQuery ? '（今月）' : '（来月）'}`);

      filteredEvents = filteredEvents.filter((e: any) => {
        const dateMatch = e.content.match(/日時[：:]\s*(\d{4})\/(\d{1,2})\/(\d{1,2})/);
        if (!dateMatch) return false;
        const eventYear = parseInt(dateMatch[1]);
        const eventMonth = parseInt(dateMatch[2]);
        return eventYear === targetYear && eventMonth === targetMonth;
      });
    }

    // フィルタリング情報を生成
    let filterInfo = '';
    if (conditions.length > 0) {
      const originalCount = events.length;
      const filteredCount = filteredEvents.length;

      filterInfo = `\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
      filterInfo += `【条件フィルタリング結果】\n`;
      filterInfo += `条件: ${conditions.join(' AND ')}\n`;
      filterInfo += `元のイベント数: ${originalCount}件\n`;
      filterInfo += `条件に合致: ${filteredCount}件\n`;

      if (filteredCount === 0) {
        filterInfo += `\n⚠️ 該当するイベントがありません\n`;
        filterInfo += `\n【代替提案用の情報】\n`;

        // 条件ごとに該当するイベントを表示
        if (locationMatch || isOnlineQuery) {
          const locationEvents = events.filter((e: any) => {
            const eventLocation = e.content.match(/場所[：:]\s*([^\n]+)/)?.[1] || '';
            if (locationMatch) return eventLocation.includes(locationMatch[1]);
            return eventLocation.includes('オンライン');
          });
          filterInfo += `- ${locationMatch ? locationMatch[1] : 'オンライン'}のイベント: ${locationEvents.map((e: any) => {
            const title = e.content.match(/イベント[：:]\s*([^\n]+)/)?.[1] || '';
            const fee = e.content.match(/参加費[：:]\s*([^\n]+)/)?.[1] || '';
            return `${title}（${fee}）`;
          }).join(', ') || 'なし'}\n`;
        }

        if (priceMatch) {
          const maxPrice = parseInt(priceMatch[1] || priceMatch[2] || priceMatch[3] || priceMatch[4]);
          const priceEvents = events.filter((e: any) => {
            const pm = e.content.match(/参加費[：:]\s*¥?([\d,]+)/);
            if (!pm) return false;
            const price = parseInt(pm[1].replace(/,/g, ''));
            // 「受付中」が条件の場合は、受付中のイベントのみ表示
            if (isOpenQuery) {
              const statusMatch = e.content.match(/ステータス[：:]\s*([^\n]+)/);
              const status = statusMatch ? statusMatch[1].trim() : '';
              return price <= maxPrice && status === '受付中';
            }
            return price <= maxPrice;
          });
          filterInfo += `- ¥${maxPrice.toLocaleString()}以下${isOpenQuery ? 'で受付中' : ''}のイベント: ${priceEvents.map((e: any) => {
            const title = e.content.match(/イベント[：:]\s*([^\n]+)/)?.[1] || '';
            const location = e.content.match(/場所[：:]\s*([^\n]+)/)?.[1] || '';
            const statusMatch = e.content.match(/ステータス[：:]\s*([^\n]+)/);
            const status = statusMatch ? statusMatch[1].trim() : '';
            return `${title}（${location}${status ? '、' + status : ''}）`;
          }).join(', ') || 'なし'}\n`;
        }
      } else {
        filterInfo += `\n【該当イベント】\n`;
        filteredEvents.forEach((e: any, idx: number) => {
          const title = e.content.match(/イベント[：:]\s*([^\n]+)/)?.[1] || '';
          const fee = e.content.match(/参加費[：:]\s*([^\n]+)/)?.[1] || '';
          const location = e.content.match(/場所[：:]\s*([^\n]+)/)?.[1] || '';
          const status = e.content.match(/ステータス[：:]\s*([^\n]+)/)?.[1] || '';
          filterInfo += `${idx + 1}. ${title} - ${fee}, ${location}, ${status}\n`;
        });
      }

      filterInfo += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;

      console.log('🔍 条件フィルタリング実行:', conditions.join(' AND'));
      console.log('📊 フィルタ結果:', `${filteredCount}/${originalCount}件`);
    }

    // フィルタリングされたイベントと非イベントを結合
    const nonEvents = results.filter((r: any) => !(r.metadata?.type === 'event' || r.type === 'event'));
    return {
      filtered: [...filteredEvents, ...nonEvents],
      filterInfo
    };
  }

  // イベント関連の質問かどうか判定
  private isEventRelatedQuery(query: string): boolean {
    const eventKeywords = [
      'イベント', 'event', 'カレンダー', 'スケジュール',
      '開催', '予定', '今月', '来月', '今週', '来週',
      '講座', 'セッション', 'ワークショップ', '説明会',
      '空き', '受付', '申し込み', '参加', '定員', '予約',
      'いつ', 'どこで', 'どこ', '場所', '日程',
      'ピーチタッチ', 'キネシ', 'チャクラ', 'ハッピーオーラ'
    ];

    const lowerQuery = query.toLowerCase();
    return eventKeywords.some(keyword =>
      lowerQuery.includes(keyword.toLowerCase())
    );
  }

  // インストラクター関連の質問かどうか判定
  private isInstructorRelatedQuery(query: string): boolean {
    const instructorKeywords = [
      'インストラクター', '講師', '先生', 'インストラクタ',
      '教える', '指導', 'どんな人', '誰', 'だれ',
      '他に', 'ほか', '別の', 'その他',
      'AKO', 'LuLu', 'Harmonia', 'Wisteria', 'HSK', '煌めき'
    ];

    const lowerQuery = query.toLowerCase();
    return instructorKeywords.some(keyword =>
      lowerQuery.includes(keyword.toLowerCase())
    );
  }

  // 集計質問かどうか判定
  private isAggregationQuery(query: string): boolean {
    const aggregationKeywords = [
      '全部で', 'すべて', '全て', '合計', 'トータル',
      '何個', '何件', '何人', '何名', 'いくつ', 'どのくらい',
      '数', 'カウント', 'count', '一覧', 'リスト', 'list'
    ];

    const lowerQuery = query.toLowerCase();
    return aggregationKeywords.some(keyword =>
      lowerQuery.includes(keyword.toLowerCase())
    );
  }

  // Sanityから直接データ取得（キャッシュ付き）
  private async fetchFromKnowledgeAPI(query: string): Promise<any[]> {
    try {
      // 質問内容から取得するタイプを判定
      let type = 'all';
      if (this.isEventRelatedQuery(query)) {
        type = 'event';
      } else if (query.includes('講座') || query.includes('コース') || query.includes('course')) {
        type = 'course';
      } else if (this.isInstructorRelatedQuery(query)) {
        type = 'instructor';
      } else if (query.includes('ブログ') || query.includes('記事') || query.includes('blog')) {
        type = 'blog';
      }

      // キャッシュキー（type + limit）
      const cacheKey = `sanity_direct_cache:${type}:100`;

      // キャッシュから取得を試みる
      try {
        const cached = await kv.get(cacheKey);
        if (cached) {
          console.log(`✅ Sanity Cache HIT: type=${type}`);
          return JSON.parse(cached as string);
        }
      } catch (cacheError) {
        console.error('Cache read error:', cacheError);
        // キャッシュエラーは無視して続行
      }

      console.log(`📡 Sanityから直接取得: type=${type} (Cache MISS)`);

      let items: any[] = [];

      // タイプに応じてSanityから直接取得
      if (type === 'event') {
        items = await publicClient.fetch(groq`
          *[_type == "event" && useForAI == true]
          | order(startDate asc) [0...100] {
            _id,
            _type,
            title,
            "slug": slug.current,
            description,
            startDate,
            endDate,
            location,
            fee,
            capacity,
            currentParticipants,
            status,
            category,
            tags,
            registrationUrl,
            _updatedAt
          }
        `);
      } else if (type === 'course') {
        items = await publicClient.fetch(groq`
          *[_type == "course"] [0...100] {
            _id,
            _type,
            title,
            subtitle,
            "slug": slug.current,
            description,
            _updatedAt
          }
        `);
      } else if (type === 'instructor') {
        items = await publicClient.fetch(groq`
          *[_type == "instructor"] [0...100] {
            _id,
            _type,
            name,
            "slug": slug.current,
            bio,
            region,
            specialties,
            _updatedAt
          }
        `);
      } else {
        // allの場合は全タイプを取得
        const [events, courses, instructors] = await Promise.all([
          publicClient.fetch(groq`
            *[_type == "event" && useForAI == true]
            | order(startDate asc) [0...30] {
              _id, _type, title, "slug": slug.current, description,
              startDate, location, fee, status, _updatedAt
            }
          `),
          publicClient.fetch(groq`
            *[_type == "course"] [0...30] {
              _id, _type, title, subtitle, "slug": slug.current,
              description, _updatedAt
            }
          `),
          publicClient.fetch(groq`
            *[_type == "instructor"] [0...30] {
              _id, _type, name, "slug": slug.current, bio,
              region, specialties, _updatedAt
            }
          `),
        ]);
        items = [...events, ...courses, ...instructors];
      }

      console.log(`✅ Sanityから${items.length}件取得`);

      // RAGエンジンの形式に変換
      const formattedData = items.map((item: any) => ({
        content: this.formatItemContent(item),
        type: item._type,
        title: item.title || item.name,
        url: this.generateUrl(item),
        metadata: item,
        similarity: 1.0,
        vector_score: 1.0,
        combined_score: 1.0
      }));

      // キャッシュに保存（5分間 = 300秒）
      try {
        await kv.setex(cacheKey, 300, JSON.stringify(formattedData));
        console.log(`💾 Sanity Cache SAVED: type=${type}, expires in 5min`);
      } catch (cacheError) {
        console.error('Cache write error:', cacheError);
        // キャッシュエラーは無視して続行
      }

      return formattedData;
    } catch (error) {
      console.error('Sanity fetch error:', error);
      return [];
    }
  }

  // URLを生成
  private generateUrl(item: any): string {
    const slug = item.slug;
    switch (item._type) {
      case 'event':
        return slug ? `/event/${slug}` : '';
      case 'course':
        return slug ? `/school/${slug}` : '';
      case 'instructor':
        return slug && item.region ? `/instructor/${item.region.toLowerCase()}/${slug}` : '';
      case 'blogPost':
        return slug ? `/blog/${slug}` : '';
      default:
        return '';
    }
  }

  // アイテムの内容をフォーマット
  private formatItemContent(item: any): string {
    switch (item._type) {
      case 'event':
        const startDate = item.startDate ? new Date(item.startDate).toLocaleDateString('ja-JP') : '';
        const status = item.status === 'open' ? '受付中' : item.status === 'full' ? '満席' : item.status === 'closed' ? '終了' : item.status;
        const fee = item.fee ? `¥${item.fee.toLocaleString()}` : '無料';
        return `イベント: ${item.title}\nステータス: ${status}\n参加費: ${fee}\n日時: ${startDate}\n場所: ${item.location || '未定'}\n${item.description || ''}\nURL: ${item.url}`;
      case 'course':
        return `【講座】${item.title}\n${item.subtitle || ''}\n${item.description || ''}\nURL: ${item.url}`;
      case 'instructor':
        return `【インストラクター】${item.name}\n地域: ${item.region || '不明'}\n専門: ${item.specialties?.join(', ') || ''}\n${item.bio || ''}\nURL: ${item.url}`;
      case 'blogPost':
        return `【ブログ】${item.title}\n${item.excerpt || ''}\nカテゴリ: ${item.category || ''}\nURL: ${item.url}`;
      default:
        return `${item.title || item.name}\n${item.description || item.excerpt || item.bio || ''}`;
    }
  }

  // 信頼度計算
  private calculateConfidence(results: any[]): number {
    if (results.length === 0) return 0;

    const avgScore = results.reduce((acc, r) =>
      acc + (r.combined_score || r.vector_score || 0), 0) / results.length;

    return Math.min(avgScore, 1);
  }

  // 統計情報取得
  async getStats() {
    console.log('📊 統計情報取得は現在サポートされていません');
    return { message: 'document_embeddings table is in use' };
  }

  // 検索テスト用メソッド
  async testSearch(query: string) {
    console.log(`🔍 検索テスト: "${query}"`);

    const results = await hybridSearch(query, {
      topK: 3,
      threshold: 0.5
    });

    console.log(`📊 結果数: ${results.length}`);
    results.forEach((result, index) => {
      console.log(`${index + 1}. スコア: ${result.combined_score?.toFixed(3)} - ${result.content.substring(0, 100)}...`);
    });

    return results;
  }
}