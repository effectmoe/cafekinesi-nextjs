/**
 * Multilingual Embeddings ラッパー
 * ローカルのXenova/paraphrase-multilingual-MiniLM-L12-v2モデルを使用（384次元、日本語対応）
 */

import { pipeline } from '@xenova/transformers'

export interface EmbeddingResult {
  embedding: number[]
  model: string
}

export class MultilingualEmbedder {
  private embedder: any
  private model: string
  private initialized: boolean = false

  constructor(model: string = 'Xenova/paraphrase-multilingual-MiniLM-L12-v2') {
    this.model = model
  }

  /**
   * モデル初期化（遅延ロード）
   */
  private async initialize() {
    if (this.initialized) return

    console.log(`🔄 Loading embedding model: ${this.model}...`)
    this.embedder = await pipeline('feature-extraction', this.model)
    this.initialized = true
    console.log(`✅ Embedding model loaded: ${this.model}`)
  }

  /**
   * テキストをベクトル化
   */
  async embed(text: string): Promise<EmbeddingResult> {
    try {
      await this.initialize()

      const output = await this.embedder(text, {
        pooling: 'mean',
        normalize: true,
      })

      const embedding = Array.from(output.data) as number[]

      return {
        embedding,
        model: this.model,
      }
    } catch (error) {
      console.error('❌ Embedding failed:', error)
      throw error
    }
  }

  /**
   * 複数のテキストをバッチでベクトル化
   */
  async embedBatch(texts: string[]): Promise<EmbeddingResult[]> {
    try {
      await this.initialize()

      const results: EmbeddingResult[] = []

      for (const text of texts) {
        const result = await this.embed(text)
        results.push(result)
      }

      return results
    } catch (error) {
      console.error('❌ Batch embedding failed:', error)
      throw error
    }
  }
}

// シングルトンインスタンス
export const deepseekEmbedder = new MultilingualEmbedder('Xenova/paraphrase-multilingual-MiniLM-L12-v2')
