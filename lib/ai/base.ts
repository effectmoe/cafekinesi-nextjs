export interface AIProvider {
  name: string;
  generateResponse(message: string, context: MessageContext): Promise<string>;
}

export interface MessageContext {
  messages: Message[];
  cafeInfo?: any;
  sessionId: string;
  ragContext?: string;
  searchResults?: any[];
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}
