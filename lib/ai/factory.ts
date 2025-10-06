import { AIProvider } from './base';
import { DeepSeekProvider } from './providers/deepseek';

export class AIProviderFactory {
  static create(): AIProvider {
    const provider = process.env.AI_PROVIDER || 'deepseek';

    switch (provider.toLowerCase()) {
      case 'deepseek':
        return new DeepSeekProvider();
      default:
        console.warn(`Unknown AI provider: ${provider}, falling back to DeepSeek`);
        return new DeepSeekProvider();
    }
  }
}
