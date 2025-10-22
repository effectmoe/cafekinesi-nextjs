#!/usr/bin/env tsx
/**
 * RAG System End-to-End Test Script
 *
 * Purpose: Verify RAG system retrieves content correctly from the database
 * and generates appropriate responses with context.
 *
 * Tests:
 * 1. Original failing query: "アクセス方法は？" (access method)
 * 2. FAQ-related queries
 * 3. Event-related queries
 * 4. Verify responses include proper context and citations
 */

interface RAGResponse {
  response: string;
  sources: any[];
  confidence: number;
  provider: string;
  searchResults: number;
  webResults: number;
  debug?: {
    searchResultsCount: number;
    confidence: number;
    searchResults: any[];
    context: string;
    topResults: any[];
  };
}

async function testRAGQuery(
  query: string,
  description: string,
  debug: boolean = true
): Promise<void> {
  console.log(`\n${'='.repeat(80)}`);
  console.log(`📝 TEST: ${description}`);
  console.log(`🔍 Query: "${query}"`);
  console.log('='.repeat(80));

  const sessionId = `test-${Date.now()}`;

  try {
    const response = await fetch('http://localhost:3000/api/chat/rag', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: query,
        sessionId,
        debug
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ API Error:', errorData);
      return;
    }

    const data: RAGResponse = await response.json();

    // Display results
    console.log('\n✅ RESPONSE RECEIVED');
    console.log('─'.repeat(80));
    console.log(`🤖 AI Response:\n${data.response}\n`);
    console.log(`📊 Metadata:`);
    console.log(`   - Provider: ${data.provider}`);
    console.log(`   - Confidence: ${(data.confidence * 100).toFixed(1)}%`);
    console.log(`   - Search Results: ${data.searchResults}`);
    console.log(`   - Sources: ${data.sources.length}`);

    if (data.sources.length > 0) {
      console.log('\n📚 Sources:');
      data.sources.forEach((source, idx) => {
        console.log(`   ${idx + 1}. ${source.title || source.url}`);
        console.log(`      Type: ${source.type}`);
        console.log(`      URL: ${source.url}`);
      });
    }

    if (debug && data.debug) {
      console.log('\n🔍 DEBUG INFO:');
      console.log(`   - DB Search Results: ${data.debug.searchResultsCount}`);

      if (data.debug.topResults && data.debug.topResults.length > 0) {
        console.log('\n   Top 3 Retrieved Documents:');
        data.debug.topResults.forEach((result, idx) => {
          console.log(`   ${idx + 1}. Score: ${result.score?.toFixed(4) || 'N/A'}`);
          console.log(`      Title: ${result.title}`);
          console.log(`      Content: ${result.content.substring(0, 150)}...`);
        });
      }

      // Show augmented prompt (first 500 chars)
      if (data.debug.context) {
        console.log(`\n   Augmented Prompt (first 500 chars):`);
        console.log(`   ${data.debug.context.substring(0, 500)}...`);
      }
    }

    console.log('\n' + '='.repeat(80));

  } catch (error) {
    console.error('\n❌ TEST FAILED:', error);
    console.error('Error details:', error instanceof Error ? error.message : 'Unknown error');
  }
}

async function runAllTests() {
  console.log('\n🚀 RAG SYSTEM END-TO-END TEST SUITE');
  console.log('Testing database: Vercel Postgres with 55 documents');
  console.log('Date:', new Date().toISOString());

  // Wait a moment for server to be fully ready
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Test 1: Original failing query - Access method
  await testRAGQuery(
    'アクセス方法は？',
    'Original Failing Query - Access Method'
  );

  // Test 2: FAQ query
  await testRAGQuery(
    'カフェキネシの営業時間を教えてください',
    'FAQ Query - Business Hours'
  );

  // Test 3: Event query
  await testRAGQuery(
    '今度のイベントについて教えてください',
    'Event Query - Upcoming Events'
  );

  // Test 4: General wellness query
  await testRAGQuery(
    'ヨガのクラスについて教えてください',
    'Course Query - Yoga Classes'
  );

  // Test 5: Blog content query
  await testRAGQuery(
    'アロマテラピーについて',
    'Blog Query - Aromatherapy'
  );

  console.log('\n✅ ALL TESTS COMPLETED');
  console.log('\nSummary: Tested 5 different query types across all document types (FAQ, Event, Course, Blog)');
}

// Execute tests
runAllTests().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
