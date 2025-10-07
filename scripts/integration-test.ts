import { config } from 'dotenv';
import { VercelVectorStore } from '../lib/vector/vercel-vector-store';
import { RAGEngine } from '../lib/rag/rag-engine';
import { publicClient } from '../lib/sanity.client';

// .env.localファイルを明示的に読み込み
config({ path: '.env.local' });

async function runIntegrationTests() {
  console.log('🚀 統合テスト開始...\n');

  let passedTests = 0;
  let totalTests = 0;

  // Test 1: Database Connection
  console.log('📊 Test 1: データベース接続テスト');
  totalTests++;
  try {
    const { sql } = await import('@vercel/postgres');
    const result = await sql`SELECT COUNT(*) as count FROM embeddings`;
    const count = result.rows[0].count;
    console.log(`✅ データベース接続成功 (${count}件のドキュメント)`);
    passedTests++;
  } catch (error) {
    console.log(`❌ データベース接続失敗: ${error.message}`);
  }

  // Test 2: Sanity Client
  console.log('\n📊 Test 2: Sanity接続テスト');
  totalTests++;
  try {
    const chatConfig = await publicClient.fetch('*[_type == "chatConfiguration"][0]');
    console.log(`✅ Sanity接続成功 (チャット設定: ${chatConfig ? '取得済み' : '未設定'})`);
    passedTests++;
  } catch (error) {
    console.log(`❌ Sanity接続失敗: ${error.message}`);
  }

  // Test 3: Vector Store
  console.log('\n📊 Test 3: ベクトルストアテスト');
  totalTests++;
  try {
    const vectorStore = new VercelVectorStore();
    await vectorStore.initialize();
    const stats = await vectorStore.getStats();
    console.log(`✅ ベクトルストア成功 (${stats.total_documents}件, 最終更新: ${stats.last_update})`);
    passedTests++;
  } catch (error) {
    console.log(`❌ ベクトルストア失敗: ${error.message}`);
  }

  // Test 4: RAG Engine
  console.log('\n📊 Test 4: RAGエンジンテスト');
  totalTests++;
  try {
    const ragEngine = new RAGEngine();
    await ragEngine.initialize();
    const searchResults = await ragEngine.testSearch('瞑想');
    console.log(`✅ RAGエンジン成功 (${searchResults.length}件の検索結果)`);
    passedTests++;
  } catch (error) {
    console.log(`❌ RAGエンジン失敗: ${error.message}`);
  }

  // Test 5: API Endpoint
  console.log('\n📊 Test 5: API エンドポイントテスト');
  totalTests++;
  try {
    const response = await fetch('http://localhost:3000/api/chat/rag', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'テストメッセージ',
        sessionId: 'integration-test'
      })
    });

    if (response.ok) {
      const data = await response.json();
      console.log(`✅ API エンドポイント成功 (レスポンス: ${data.response ? '取得済み' : 'なし'})`);
      passedTests++;
    } else {
      throw new Error(`HTTP ${response.status}`);
    }
  } catch (error) {
    console.log(`❌ API エンドポイント失敗: ${error.message}`);
  }

  // Test Results
  console.log('\n📋 テスト結果サマリー');
  console.log('='.repeat(50));
  console.log(`✅ 成功: ${passedTests}/${totalTests} テスト`);
  console.log(`❌ 失敗: ${totalTests - passedTests}/${totalTests} テスト`);

  if (passedTests === totalTests) {
    console.log('\n🎉 すべてのテストが成功しました！');
    console.log('✅ システムは正常に動作しています');
  } else {
    console.log('\n⚠️ 一部のテストが失敗しました');
    console.log('🔧 失敗したコンポーネントを確認してください');
  }

  console.log('\n🚀 統合テスト完了');
  process.exit(passedTests === totalTests ? 0 : 1);
}

// 実行
if (require.main === module) {
  runIntegrationTests().catch(error => {
    console.error('❌ 統合テスト中に予期しないエラー:', error);
    process.exit(1);
  });
}

export { runIntegrationTests };