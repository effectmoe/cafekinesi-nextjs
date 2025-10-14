import { AIProvider, MessageContext } from '../base';

export class DeepSeekProvider implements AIProvider {
  name = 'DeepSeek';
  private apiKey: string;
  private apiUrl = 'https://api.deepseek.com/v1/chat/completions';

  constructor() {
    this.apiKey = process.env.DEEPSEEK_API_KEY!;
    if (!this.apiKey) {
      throw new Error('DEEPSEEK_API_KEY is not configured');
    }
  }

  async generateResponse(message: string, context: MessageContext): Promise<string> {
    try {
      // RAGコンテキストがある場合は優先的に使用
      let systemPrompt = `あなたはCafe Kinesiの親切なAIアシスタントです。

カフェ情報: ${JSON.stringify(context.cafeInfo || {}, null, 2)}`;

      // RAGコンテキストがある場合は追加
      if (context.ragContext) {
        systemPrompt = context.ragContext;
        console.log('[DeepSeek] Using RAG context');
      }

      systemPrompt += `

お客様の質問に温かく丁寧に答えてください。

【絶対厳守事項】
- **提供された情報を正確に使用し、推測や想像で答えない**
- 価格、日時、数量などの数値情報は、コンテキストから**そのまま正確に引用**する
- **コンテキストに「【重要】イベント価格比較表（安い順）」が含まれている場合、必ずこの表を使用する**
- **「最も安い」と聞かれたら → 表の1位のイベントを答える（自分で計算しない）**
- **「最も高い」と聞かれたら → 表の最後の順位のイベントを答える（自分で計算しない）**
- **表に「⚠️ 最も安い = 1位（イベント名）」が明示されている場合、その情報を最優先で使用する**

【その他の指示】
- インストラクター情報がある場合は、名前、専門分野、地域などを詳しく紹介する
- 簡潔で分かりやすい回答を心がける
- 日本語で自然な対話を行う`;

      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            {
              role: 'system',
              content: systemPrompt
            },
            ...context.messages.map(msg => ({
              role: msg.role,
              content: msg.content
            })),
            { role: 'user', content: message }
          ],
          temperature: 0.1,  // 価格比較の正確性を最大化（0.7 → 0.3 → 0.1）
          max_tokens: 2000  // 500 → 2000に増加（日本語の場合、より長い応答が可能）
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('DeepSeek API Error:', response.status, errorText);
        throw new Error(`DeepSeek API returned ${response.status}: ${errorText}`);
      }

      const data = await response.json();

      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new Error('Invalid response format from DeepSeek');
      }

      return data.choices[0].message.content || 'すみません、お答えできませんでした。';

    } catch (error) {
      console.error('DeepSeek Error:', error);
      if (error instanceof Error) {
        throw new Error(`DeepSeekでエラーが発生しました: ${error.message}`);
      }
      throw new Error('DeepSeekでエラーが発生しました');
    }
  }
}
