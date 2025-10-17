import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(process.cwd(), '.env.local') });

import { hybridSearch } from '@/lib/db/document-vector-operations';

async function main() {
  console.log('🔍 「ハッピーオーラス入門の予約は可能ですか？」の検索テスト\n');

  try {
    const query = 'ハッピーオーラス入門の予約は可能ですか？';

    console.log(`📝 クエリ: "${query}"\n`);

    // RAGEngineと同じ設定で検索
    const results = await hybridSearch(query, {
      topK: 30,
      threshold: 0.03,
      type: 'event'
    });

    console.log(`📊 検索結果: ${results.length}件\n`);

    if (results.length > 0) {
      results.forEach((result: any, idx: number) => {
        console.log(`${idx + 1}. タイトル: ${result.title}`);
        console.log(`   ベクトルスコア: ${result.vector_score?.toFixed(4)}`);
        console.log(`   テキストスコア: ${result.text_score?.toFixed(4)}`);
        console.log(`   総合スコア: ${result.combined_score?.toFixed(4)}`);
        console.log(`   コンテンツ（最初の200文字）:`);
        console.log(`   ${result.content.substring(0, 200)}...\n`);
      });
    } else {
      console.log('❌ 検索結果が0件です！');
      console.log('\n💡 問題の原因を調査します...\n');

      // より広い条件で再検索
      console.log('🔄 より広い条件で再検索（threshold: 0.0, topK: 50）...\n');
      const widerResults = await hybridSearch(query, {
        topK: 50,
        threshold: 0.0,
        type: 'event'
      });

      console.log(`📊 広範囲検索結果: ${widerResults.length}件\n`);

      if (widerResults.length > 0) {
        widerResults.slice(0, 5).forEach((result: any, idx: number) => {
          console.log(`${idx + 1}. タイトル: ${result.title}`);
          console.log(`   ベクトルスコア: ${result.vector_score?.toFixed(4)}`);
          console.log(`   テキストスコア: ${result.text_score?.toFixed(4)}`);
          console.log(`   総合スコア: ${result.combined_score?.toFixed(4)}\n`);
        });
      }
    }

    // 別のクエリでもテスト
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('🔍 「ハッピーオーラス」で再検索...\n');

    const simpleResults = await hybridSearch('ハッピーオーラス', {
      topK: 10,
      threshold: 0.03,
      type: 'event'
    });

    console.log(`📊 検索結果: ${simpleResults.length}件\n`);

    if (simpleResults.length > 0) {
      simpleResults.forEach((result: any, idx: number) => {
        console.log(`${idx + 1}. タイトル: ${result.title}`);
        console.log(`   ベクトルスコア: ${result.vector_score?.toFixed(4)}`);
        console.log(`   テキストスコア: ${result.text_score?.toFixed(4)}`);
        console.log(`   総合スコア: ${result.combined_score?.toFixed(4)}\n`);
      });
    }

  } catch (error) {
    console.error('\n❌ エラー:', error);
    process.exit(1);
  }
}

main();
