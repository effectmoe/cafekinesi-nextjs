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
              content: `あなたはCafe Kinesiの親切なAIアシスタントです。

カフェ情報: ${JSON.stringify(context.cafeInfo || {}, null, 2)}

お客様の質問に温かく丁寧に答えてください。
- 簡潔で分かりやすい回答を心がける
- 日本語で自然な対話を行う
- カフェの情報に基づいて正確に答える`
            },
            ...context.messages.map(msg => ({
              role: msg.role,
              content: msg.content
            })),
            { role: 'user', content: message }
          ],
          temperature: 0.7,
          max_tokens: 500
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
