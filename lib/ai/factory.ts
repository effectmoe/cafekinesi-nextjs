import { AIProvider } from './base';
import { DeepSeekProvider } from './providers/deepseek';
import { OpenAIProvider } from './providers/openai';

export class AIProviderFactory {
  static create(providerName?: string): AIProvider {
    const provider = providerName || process.env.AI_PROVIDER || 'deepseek';

    switch (provider.toLowerCase()) {
      case 'deepseek':
        return new DeepSeekProvider();
      // 他のプロバイダーは将来追加可能
      case 'openai':
        return new OpenAIProvider();
      case 'claude':
        // return new ClaudeProvider();
        console.warn('Claude provider not implemented yet, falling back to DeepSeek');
        return new DeepSeekProvider();
      case 'gemini':
        // return new GeminiProvider();
        console.warn('Gemini provider not implemented yet, falling back to DeepSeek');
        return new DeepSeekProvider();
      default:
        console.warn(`Unknown AI provider: ${provider}, falling back to DeepSeek`);
        return new DeepSeekProvider();
    }
  }

  static getSupportedProviders(): string[] {
    return ['deepseek', 'openai', 'claude', 'gemini'];
  }
}
