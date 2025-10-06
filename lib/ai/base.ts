export interface AIProvider {
  name: string;
  generateResponse(message: string, context: MessageContext): Promise<string>;
}

export interface MessageContext {
  messages: Message[];
  cafeInfo?: any;
  sessionId: string;
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}
