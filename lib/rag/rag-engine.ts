import { vectorSearch, hybridSearch } from '@/lib/db/document-vector-operations';

export class RAGEngine {
  async initialize() {
    // document_embeddingsテーブルは常に利用可能
    console.log('✅ RAG Engine initialized (using document_embeddings)');
  }

  // RAG応答生成
  async generateAugmentedResponse(query: string, config: any) {
    console.log('🤖 RAG応答生成中... (document_embeddings)');

    // インストラクター関連の質問を検出
    const isInstructorQuery = this.isInstructorRelatedQuery(query);

    // 1. ベクトル検索（新しいdocument_embeddingsテーブルを使用）
    let searchResults;
    if (isInstructorQuery) {
      console.log('👩‍🏫 インストラクター専用検索を実行...');
      searchResults = await vectorSearch(query, {
        topK: 50,
        threshold: 0.05,
        type: 'instructor'
      });
    } else {
      // ハイブリッド検索を使用
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

    // 3. コンテキスト構築
    const context = this.buildContext(formattedResults, webResults, config);

    // 4. プロンプト構築
    const augmentedPrompt = `
以下のコンテキスト情報を基に質問に答えてください。

【コンテキスト】
${context}

【質問】
${query}

【回答指針】
- コンテキストに含まれる情報を最大限活用して、具体的で有益な回答をしてください
- インストラクター情報がある場合は、名前、専門分野、地域、経歴などを詳しく紹介してください
- 部分的な情報でも積極的に提供し、ユーザーに価値のある回答を心がけてください
- 親切で温かい口調で、Cafe Kinesiのアシスタントとしてお答えください
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

  // 信頼度計算
  private calculateConfidence(results: any[]): number {
    if (results.length === 0) return 0;

    const avgScore = results.reduce((acc, r) =>
      acc + (r.combined_score || r.vector_score || 0), 0) / results.length;

    return Math.min(avgScore, 1);
  }

  // 統計情報取得
  async getStats() {
    return await this.vectorStore.getStats();
  }

  // 検索テスト用メソッド
  async testSearch(query: string) {
    console.log(`🔍 検索テスト: "${query}"`);

    const results = await this.vectorStore.hybridSearch(query, {
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