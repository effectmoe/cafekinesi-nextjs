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
- **提供された情報を正確に使用し、推測や想像で答えない**
- 価格、日時、数量などの数値情報は、コンテキストから**そのまま正確に引用**する
- 「最も」「一番」などの比較を求められた場合は、全ての選択肢を慎重に比較してから答える
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
          temperature: 0.3,  // 正確性を重視して0.7から0.3に下げる
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
