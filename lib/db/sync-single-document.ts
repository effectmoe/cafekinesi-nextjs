import { publicClient } from '@/lib/sanity.client';
import { sql } from '@vercel/postgres';
import { deepseekEmbedder } from '@/lib/embeddings/deepseek-embedder';

// PortableTextからテキストを抽出
function extractTextFromPortableText(content: any[]): string {
  if (!Array.isArray(content)) return '';

  return content
    .filter((block: any) => block._type === 'block')
    .map((block: any) => {
      return block.children
        ?.map((child: any) => child.text)
        .join('') || '';
    })
    .join('\n');
}

// コンテンツタイプごとのクエリとフォーマッター
function getDocumentQuery(documentType: string): string {
  switch (documentType) {
    case 'knowledgeBase':
      return `*[_id == $documentId][0] {
        _id, _type, title, extractedText, category, tags, isActive, priority
      }`;

    case 'blogPost':
      return `*[_id == $documentId][0] {
        _id, _type, title, excerpt, content, category, publishedAt, isActive
      }`;

    case 'course':
      return `*[_id == $documentId][0] {
        _id, _type, title, description, duration, price, level, isActive
      }`;

    case 'instructor':
      return `*[_id == $documentId][0] {
        _id, _type, name, specialties, bio, region, profileDetails, website, email, isActive
      }`;

    case 'faq':
      return `*[_id == $documentId][0] {
        _id, _type, question, answer, category, isActive
      }`;

    default:
      return `*[_id == $documentId][0]`;
  }
}

// ドキュメントからテキストを抽出
function extractContent(document: any, documentType: string): string {
  switch (documentType) {
    case 'knowledgeBase':
      return document.extractedText || '';

    case 'blogPost':
      const blogContent = document.content ? extractTextFromPortableText(document.content) : '';
      return `${document.title}\n${document.excerpt || ''}\n${blogContent}`;

    case 'course':
      return `${document.title}\n${document.description || ''}\n期間: ${document.duration || ''}\n料金: ${document.price || ''}\nレベル: ${document.level || ''}`;

    case 'instructor':
      return `${document.name}\n専門分野: ${document.specialties?.join(', ') || ''}\n経歴: ${document.bio || ''}\n地域: ${document.region || ''}\n詳細: ${document.profileDetails || ''}\nウェブサイト: ${document.website || ''}\nメール: ${document.email || ''}`;

    case 'faq':
      return `Q: ${document.question}\nA: ${document.answer}`;

    default:
      return JSON.stringify(document);
  }
}

// ドキュメントのタイトルを取得
function getDocumentTitle(document: any, documentType: string): string {
  if (documentType === 'instructor') {
    return document.name || 'Untitled';
  } else if (documentType === 'faq') {
    return document.question || 'Untitled';
  }
  return document.title || 'Untitled';
}

export async function syncSingleDocument(documentId: string, documentType: string, providedDocument?: any) {
  console.log(`📄 Syncing document: ${documentId} (${documentType})`);

  try {
    let document = providedDocument;

    // providedDocumentの検証
    if (providedDocument) {
      console.log('📦 Provided document received from webhook');
      console.log('🔍 Provided document keys:', Object.keys(providedDocument));

      // 必須フィールドの確認（documentTypeに応じて）
      const hasRequiredFields = documentType === 'knowledgeBase'
        ? !!providedDocument.extractedText
        : true;

      if (!hasRequiredFields) {
        console.warn('⚠️  Provided document missing required fields, fetching from Sanity...');
        console.warn('   Missing extractedText:', !providedDocument.extractedText);
        document = null;  // Sanityから再取得
      } else {
        console.log('✅ Using provided document from webhook');
        console.log('   extractedText length:', providedDocument.extractedText?.length || 0);
      }
    }

    // 提供されていない、または不完全な場合はSanityから取得
    if (!document) {
      console.log('📡 Fetching document from Sanity (published version)...');
      const query = getDocumentQuery(documentType);
      document = await publicClient.fetch(query, { documentId });
      console.log('📥 Fetched document from Sanity');
      console.log('   Has extractedText:', !!document?.extractedText);
      console.log('   extractedText length:', document?.extractedText?.length || 0);
    }

    if (!document) {
      console.error(`❌ Document not found: ${documentId}`);
      return;
    }

    // コンテンツを抽出
    const content = extractContent(document, documentType);

    if (!content || content.trim().length < 10) {
      console.warn(`⚠️  No valid content for document: ${documentId}`);
      return;
    }

    if (document.isActive === false) {
      console.log(`⏭️  Document is not active, deleting from vector DB if exists`);
      await sql`DELETE FROM document_embeddings WHERE id = ${documentId};`;
      return;
    }

    const documentTitle = getDocumentTitle(document, documentType);
    console.log(`🔢 Generating embedding for: ${documentTitle}`);

    // エンベディング生成
    const { embedding } = await deepseekEmbedder.embed(content);

    // 古いチャンクデータを削除（旧システムの名残）
    const deleteResult = await sql`
      DELETE FROM document_embeddings
      WHERE id LIKE ${documentId + '-chunk-%'};
    `;

    if (deleteResult.rowCount && deleteResult.rowCount > 0) {
      console.log(`🗑️  Deleted ${deleteResult.rowCount} old chunk(s) for document: ${documentId}`);
    }

    // データベースに保存（UPSERT）
    await sql`
      INSERT INTO document_embeddings (id, type, title, content, url, embedding, metadata)
      VALUES (
        ${documentId},
        ${documentType},
        ${documentTitle},
        ${content},
        '',
        ${JSON.stringify(embedding)}::vector,
        ${JSON.stringify({
          category: document.category,
          tags: document.tags || [],
          priority: document.priority || 5,
          ...document
        })}::jsonb
      )
      ON CONFLICT (id)
      DO UPDATE SET
        type = EXCLUDED.type,
        title = EXCLUDED.title,
        content = EXCLUDED.content,
        embedding = EXCLUDED.embedding,
        metadata = EXCLUDED.metadata,
        updated_at = CURRENT_TIMESTAMP;
    `;

    console.log(`✅ Document synced successfully: ${documentTitle}`);

  } catch (error) {
    console.error(`❌ Error syncing document ${documentId}:`, error);
    throw error;
  }
}
