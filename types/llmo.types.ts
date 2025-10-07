/**
 * LLMO (Large Language Model Optimization) 型定義
 * AIチャットボット、RAG、ベクトル検索用の型
 */

// RAGコンテキスト
export interface RAGContext {
  content: string;
  source: string;
  relevanceScore: number;
  metadata?: Record<string, any>;
}

// チャットメッセージ
export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  sources?: string[];
}

// AIチャット応答
export interface AIResponse {
  message: string;
  sources: RAGContext[];
  conversationId: string;
  timestamp: Date;
}

// Schema.org生成設定
export interface SchemaGeneratorConfig {
  siteName: string;
  siteUrl: string;
  logo: string;
  defaultImage: string;
  organization?: {
    name: string;
    address?: string;
    phone?: string;
  };
}

// Embedding操作結果
export interface EmbeddingResult {
  success: boolean;
  id: string;
  message?: string;
  error?: string;
}

// ベクトル検索オプション
export interface VectorSearchOptions {
  topK?: number;
  threshold?: number;
  includeMetadata?: boolean;
}

// ハイブリッド検索オプション
export interface HybridSearchOptions extends VectorSearchOptions {
  vectorWeight?: number;  // デフォルト: 0.7
  textWeight?: number;    // デフォルト: 0.3
}

// ドキュメント埋め込みデータ
export interface DocumentEmbedding {
  id: string;
  type: string;
  title: string;
  content: string;
  url: string;
  embedding?: number[];
  metadata: Record<string, any>;
  created_at?: Date;
  updated_at?: Date;
}

// 検索結果
export interface SearchResult {
  id: string;
  title: string;
  content: string;
  url: string;
  type: string;
  score: number;
  metadata?: Record<string, any>;
}

// エンベッダー設定
export interface EmbedderConfig {
  provider: 'openai' | 'local';  // OpenAI or ローカルモデル
  model: string;                 // 'text-embedding-ada-002' or 'all-MiniLM-L6-v2'
  dimensions: number;            // 1536 or 384
  apiKey?: string;               // OpenAI APIキー（必要な場合）
}
