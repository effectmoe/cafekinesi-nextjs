#!/usr/bin/env tsx
/**
 * Document Embeddings Population Script
 *
 * Purpose: Fetch content from Sanity CMS and populate Vercel Postgres
 * with vector embeddings for RAG (Retrieval Augmented Generation)
 *
 * Usage:
 *   npm run populate-embeddings
 *   npx tsx scripts/populate-document-embeddings.ts
 *   npx tsx scripts/populate-document-embeddings.ts --incremental
 *   npx tsx scripts/populate-document-embeddings.ts --force
 *
 * Requirements:
 *   - Vercel Postgres database with document_embeddings table
 *   - DEEPSEEK_API_KEY environment variable
 *   - Sanity CMS API access
 */

import { sql } from '@vercel/postgres';
import { publicClient } from '../lib/sanity.client';
import { deepseekEmbedder } from '../lib/embeddings/deepseek-embedder';
import { groq } from 'next-sanity';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });
dotenv.config();

// Configuration
const BATCH_SIZE = 10; // Process 10 documents at a time
const RATE_LIMIT_DELAY = 1000; // 1 second delay between API calls
const INCREMENTAL_MODE = process.argv.includes('--incremental');
const FORCE_MODE = process.argv.includes('--force');

interface DocumentToEmbed {
  id: string;
  type: string;
  title: string;
  content: string;
  url: string;
  metadata: Record<string, any>;
}

/**
 * Fetch blog posts from Sanity CMS
 */
async function fetchBlogPosts(): Promise<DocumentToEmbed[]> {
  console.log('📚 Fetching blog posts from Sanity...');

  const posts = await publicClient.fetch(groq`
    *[_type == "blogPost" && !(_id in path("drafts.*")) && defined(slug.current)] {
      _id,
      title,
      slug,
      excerpt,
      content,
      category,
      tags,
      publishedAt,
      _updatedAt
    }
  `);

  console.log(`✅ Found ${posts.length} blog posts`);

  return posts.map((post: any) => ({
    id: `blog-${post.slug.current}`,
    type: 'blog',
    title: post.title,
    content: extractTextFromPortableText(post.content) || post.excerpt || '',
    url: `/blog/${post.slug.current}`,
    metadata: {
      category: post.category,
      tags: post.tags || [],
      publishedAt: post.publishedAt,
      updatedAt: post._updatedAt
    }
  }));
}

/**
 * Fetch FAQs from Sanity CMS
 */
async function fetchFAQs(): Promise<DocumentToEmbed[]> {
  console.log('❓ Fetching FAQs from Sanity...');

  const faqs = await publicClient.fetch(groq`
    *[_type == "faq"] {
      _id,
      question,
      answer,
      category,
      tags,
      _updatedAt
    }
  `);

  console.log(`✅ Found ${faqs.length} FAQs`);

  return faqs.map((faq: any) => ({
    id: `faq-${faq._id}`,
    type: 'faq',
    title: faq.question,
    // FAQ answers can be plain text or Portable Text
    content: typeof faq.answer === 'string'
      ? faq.answer
      : extractTextFromPortableText(faq.answer) || '',
    url: `/faq#${faq._id}`,
    metadata: {
      category: faq.category,
      tags: faq.tags || [],
      updatedAt: faq._updatedAt
    }
  }));
}

/**
 * Fetch courses from Sanity CMS
 */
async function fetchCourses(): Promise<DocumentToEmbed[]> {
  console.log('🎓 Fetching courses from Sanity...');

  const courses = await publicClient.fetch(groq`
    *[_type == "course" && defined(slug.current)] {
      _id,
      title,
      slug,
      description,
      content,
      category,
      tags,
      _updatedAt
    }
  `);

  console.log(`✅ Found ${courses.length} courses`);

  return courses.map((course: any) => ({
    id: `course-${course.slug.current}`,
    type: 'course',
    title: course.title,
    content: extractTextFromPortableText(course.content) || course.description || '',
    url: `/school/${course.slug.current}`,
    metadata: {
      category: course.category,
      tags: course.tags || [],
      updatedAt: course._updatedAt
    }
  }));
}

/**
 * Fetch events from Sanity CMS
 */
async function fetchEvents(): Promise<DocumentToEmbed[]> {
  console.log('📅 Fetching events from Sanity...');

  const events = await publicClient.fetch(groq`
    *[_type == "event" && defined(slug.current)] {
      _id,
      title,
      slug,
      description,
      content,
      category,
      tags,
      _updatedAt
    }
  `);

  console.log(`✅ Found ${events.length} events`);

  return events.map((event: any) => ({
    id: `event-${event.slug.current}`,
    type: 'event',
    title: event.title,
    // Event content and description can be plain text or Portable Text
    content: (() => {
      // Try content first
      if (event.content) {
        return typeof event.content === 'string'
          ? event.content
          : extractTextFromPortableText(event.content);
      }
      // Fall back to description
      if (event.description) {
        return typeof event.description === 'string'
          ? event.description
          : extractTextFromPortableText(event.description);
      }
      return '';
    })(),
    url: `/calendar/${event.slug.current}`,
    metadata: {
      category: event.category,
      tags: event.tags || [],
      updatedAt: event._updatedAt
    }
  }));
}

/**
 * Fetch instructors from Sanity CMS
 */
async function fetchInstructors(): Promise<DocumentToEmbed[]> {
  console.log('👩‍🏫 Fetching instructors from Sanity...');

  const instructors = await publicClient.fetch(groq`
    *[_type == "instructor" && defined(slug.current)] {
      _id,
      name,
      slug,
      bio,
      region,
      specialties,
      profileDetails,
      website,
      email,
      _updatedAt
    }
  `);

  console.log(`✅ Found ${instructors.length} instructors`);

  return instructors.map((instructor: any) => ({
    id: `instructor-${instructor.slug.current}`,
    type: 'instructor',
    title: instructor.name,
    content: `インストラクター: ${instructor.name}\n地域: ${instructor.region || ''}\n専門分野: ${instructor.specialties?.join(', ') || ''}\n経歴: ${extractTextFromPortableText(instructor.bio) || ''}\n詳細: ${extractTextFromPortableText(instructor.profileDetails) || ''}\nウェブサイト: ${instructor.website || ''}\nメール: ${instructor.email || ''}`,
    url: instructor.region ? `/instructor/${instructor.region.toLowerCase()}/${instructor.slug.current}` : `/instructor/${instructor.slug.current}`,
    metadata: {
      region: instructor.region,
      specialties: instructor.specialties || [],
      updatedAt: instructor._updatedAt
    }
  }));
}

/**
 * Fetch knowledge base from Sanity CMS
 */
async function fetchKnowledgeBase(): Promise<DocumentToEmbed[]> {
  console.log('📚 Fetching knowledge base from Sanity...');

  const knowledgeBase = await publicClient.fetch(groq`
    *[_type == "knowledgeBase" && isActive == true] {
      _id,
      title,
      description,
      extractedText,
      category,
      tags,
      priority,
      _updatedAt
    }
  `);

  console.log(`✅ Found ${knowledgeBase.length} knowledge base documents`);

  return knowledgeBase.map((kb: any) => ({
    id: `kb-${kb._id}`,
    type: 'knowledgeBase',
    title: kb.title,
    content: kb.extractedText || kb.description || '',
    url: `/knowledge/${kb._id}`,
    metadata: {
      category: kb.category,
      tags: kb.tags || [],
      priority: kb.priority || 5,
      updatedAt: kb._updatedAt
    }
  }));
}

/**
 * Extract plain text from Portable Text (Sanity rich text format)
 */
function extractTextFromPortableText(portableText: any): string {
  if (!portableText || !Array.isArray(portableText)) return '';

  return portableText
    .map((block: any) => {
      if (block._type === 'block' && block.children) {
        return block.children
          .map((child: any) => child.text || '')
          .join('');
      }
      return '';
    })
    .filter(Boolean)
    .join('\n');
}

/**
 * Check if document needs update
 */
async function needsUpdate(doc: DocumentToEmbed): Promise<boolean> {
  if (FORCE_MODE) return true;
  if (!INCREMENTAL_MODE) return true;

  try {
    const result = await sql`
      SELECT updated_at
      FROM document_embeddings
      WHERE id = ${doc.id}
    `;

    if (result.rows.length === 0) return true;

    const dbUpdatedAt = new Date(result.rows[0].updated_at);
    const docUpdatedAt = new Date(doc.metadata.updatedAt || 0);

    return docUpdatedAt > dbUpdatedAt;
  } catch (error) {
    // If table doesn't exist or error, assume needs update
    return true;
  }
}

/**
 * Upsert document with embedding
 */
async function upsertDocument(doc: DocumentToEmbed): Promise<void> {
  console.log(`  Processing: ${doc.title}`);

  // Generate embedding
  const { embedding } = await deepseekEmbedder.embed(doc.content);

  // Upsert into database
  await sql`
    INSERT INTO document_embeddings (
      id, type, title, content, url, metadata, embedding, updated_at
    ) VALUES (
      ${doc.id},
      ${doc.type},
      ${doc.title},
      ${doc.content},
      ${doc.url},
      ${JSON.stringify(doc.metadata)}::jsonb,
      ${JSON.stringify(embedding)}::vector(384),
      NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
      type = EXCLUDED.type,
      title = EXCLUDED.title,
      content = EXCLUDED.content,
      url = EXCLUDED.url,
      metadata = EXCLUDED.metadata,
      embedding = EXCLUDED.embedding,
      updated_at = NOW()
  `;

  console.log(`  ✅ Upserted: ${doc.id}`);
}

/**
 * Process documents in batches with rate limiting
 */
async function processBatch(documents: DocumentToEmbed[]): Promise<void> {
  for (let i = 0; i < documents.length; i += BATCH_SIZE) {
    const batch = documents.slice(i, i + BATCH_SIZE);

    console.log(`\n📦 Processing batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(documents.length / BATCH_SIZE)}`);
    console.log(`   Documents: ${i + 1}-${Math.min(i + BATCH_SIZE, documents.length)} of ${documents.length}`);

    for (const doc of batch) {
      try {
        if (await needsUpdate(doc)) {
          await upsertDocument(doc);

          // Rate limiting
          await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_DELAY));
        } else {
          console.log(`  ⏭️  Skipped (up-to-date): ${doc.title}`);
        }
      } catch (error) {
        console.error(`  ❌ Failed to process ${doc.id}:`, error);
      }
    }
  }
}

/**
 * Main execution
 */
async function main() {
  console.log('🚀 Document Embeddings Population Script\n');
  console.log('Mode:', FORCE_MODE ? 'FORCE (全データ再投入)' : INCREMENTAL_MODE ? 'INCREMENTAL (差分のみ)' : 'NORMAL (全データ投入)');
  console.log('Batch size:', BATCH_SIZE);
  console.log('Rate limit delay:', RATE_LIMIT_DELAY, 'ms\n');

  // Verify environment variables
  if (!process.env.DEEPSEEK_API_KEY) {
    throw new Error('❌ DEEPSEEK_API_KEY is not set');
  }

  if (!process.env.POSTGRES_URL) {
    throw new Error('❌ POSTGRES_URL is not set');
  }

  try {
    // Fetch all documents
    const [blogPosts, faqs, courses, events, instructors, knowledgeBase] = await Promise.all([
      fetchBlogPosts(),
      fetchFAQs(),
      fetchCourses(),
      fetchEvents(),
      fetchInstructors(),
      fetchKnowledgeBase()
    ]);

    const allDocuments = [...blogPosts, ...faqs, ...courses, ...events, ...instructors, ...knowledgeBase];

    console.log(`\n📊 Total documents: ${allDocuments.length}`);
    console.log(`   - Blog posts: ${blogPosts.length}`);
    console.log(`   - FAQs: ${faqs.length}`);
    console.log(`   - Courses: ${courses.length}`);
    console.log(`   - Events: ${events.length}`);
    console.log(`   - Instructors: ${instructors.length}`);
    console.log(`   - Knowledge Base: ${knowledgeBase.length}`);

    if (allDocuments.length === 0) {
      console.log('\n⚠️  No documents found. Exiting.');
      return;
    }

    // Process documents
    await processBatch(allDocuments);

    // Summary
    const result = await sql`SELECT COUNT(*) as count FROM document_embeddings`;
    const totalInDb = result.rows[0].count;

    console.log('\n✅ Population complete!');
    console.log(`   Total documents in database: ${totalInDb}`);

  } catch (error) {
    console.error('\n❌ Population failed:', error);
    process.exit(1);
  }
}

// Execute
main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
