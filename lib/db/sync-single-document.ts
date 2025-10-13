import { publicClient } from '@/lib/sanity.client';
import { pool } from '@/lib/db';
import { DeepSeekEmbedder } from '@/lib/embeddings/deepseek-embedder';

export async function syncSingleDocument(documentId: string, documentType: string) {
  console.log(`📄 Syncing document: ${documentId} (${documentType})`);

  try {
    // Sanityからドキュメントを取得
    const document = await publicClient.fetch(
      `*[_id == $documentId][0] {
        _id,
        _type,
        title,
        extractedText,
        category,
        tags,
        isActive,
        priority
      }`,
      { documentId }
    );

    if (!document) {
      console.error(`❌ Document not found: ${documentId}`);
      return;
    }

    if (!document.extractedText) {
      console.warn(`⚠️  No extracted text for document: ${documentId}`);
      return;
    }

    if (document.isActive === false) {
      console.log(`⏭️  Document is not active, deleting from vector DB if exists`);
      await pool.query(
        'DELETE FROM document_embeddings WHERE id = $1',
        [documentId]
      );
      return;
    }

    console.log(`🔢 Generating embedding for: ${document.title}`);

    // エンベディング生成
    const embedder = new DeepSeekEmbedder();
    const embedding = await embedder.embed(document.extractedText);

    // データベースに保存（UPSERT）
    await pool.query(
      `INSERT INTO document_embeddings (id, type, title, content, embedding, metadata, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())
       ON CONFLICT (id)
       DO UPDATE SET
         type = EXCLUDED.type,
         title = EXCLUDED.title,
         content = EXCLUDED.content,
         embedding = EXCLUDED.embedding,
         metadata = EXCLUDED.metadata,
         updated_at = NOW()`,
      [
        documentId,
        documentType,
        document.title,
        document.extractedText,
        JSON.stringify(embedding),
        JSON.stringify({
          category: document.category,
          tags: document.tags || [],
          priority: document.priority || 5
        })
      ]
    );

    console.log(`✅ Document synced successfully: ${document.title}`);

  } catch (error) {
    console.error(`❌ Error syncing document ${documentId}:`, error);
    throw error;
  }
}
