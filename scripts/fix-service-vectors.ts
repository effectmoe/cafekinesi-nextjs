#!/usr/bin/env npx tsx

import { config } from 'dotenv';
import { sql } from '@vercel/postgres';
import { VercelVectorStore } from '../lib/vector/vercel-vector-store';

config({ path: '.env.local' });

async function fixServiceVectors() {
  console.log('🔧 Service エンティティのベクトル埋め込みを修正中...\n');

  try {
    // 1. 既存のai-first-serviceデータを削除
    console.log('🗑️ 既存のai-first-serviceデータを削除中...');
    const deleteResult = await sql`
      DELETE FROM embeddings
      WHERE source = 'ai-first-service'
    `;
    console.log(`✅ ${deleteResult.rowCount}件のServiceデータを削除しました`);

    // 2. SanityからServiceデータを再取得
    console.log('\n📡 SanityからServiceデータを取得中...');
    const { createClient } = require('@sanity/client');

    const client = createClient({
      projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
      apiVersion: '2023-05-03',
      token: process.env.SANITY_API_TOKEN,
      useCdn: false
    });

    const services = await client.fetch(`
      *[_type == "service" && defined(name)] {
        _id,
        name,
        serviceType,
        category,
        price,
        currency,
        description,
        aiQuickAnswer,
        aiFAQ,
        aiKeywords,
        popularity,
        _updatedAt
      }
    `);

    console.log(`📊 ${services.length}件のServiceデータを取得しました`);

    // 3. 改善されたコンテンツでベクトル埋め込みを再生成
    const vectorStore = new VercelVectorStore();
    await vectorStore.initialize();

    const documents = services.map(service => {
      // 日本語検索に最適化されたコンテンツを生成
      const content = `講座: ${service.name}

${service.name}は、カフェキネシオロジーの講座・コースの一つです。どのような講座があるかお探しの方におすすめです。

${service.aiQuickAnswer || `${service.name}について詳しく学べる講座です。`}

詳細内容:
${typeof service.description === 'string' ? service.description : `${service.name}の講座では、カフェキネシオロジーの技術を学び、心身のバランスを整える方法を習得できます。初心者から上級者まで対応しています。`}

この講座について:
- 講座名: ${service.name}
- コース種類: ${service.serviceType}
- カテゴリー: ${service.category}
- 人気度: ${service.popularity || 70}/100

検索キーワード: ${service.aiKeywords?.join(', ') || '講座, コース, どのような講座, どんな講座があるか, カフェキネシ講座'}

${service.aiFAQ?.length > 0 ? `よくある質問:\n${service.aiFAQ.map(faq => `Q: ${faq.question}\nA: ${faq.answer}`).join('\n')}` : '講座の詳細やお申し込みについては、お気軽にお問い合わせください。'}

カフェキネシオロジーの講座を受講したい方、どのような講座があるか知りたい方は、ぜひ${service.name}をご検討ください。`;

      return {
        content,
        metadata: {
          id: `service-${service._id}`,
          name: service.name,
          type: 'service',
          serviceType: service.serviceType,
          category: service.category,
          price: service.price,
          currency: service.currency,
          popularity: service.popularity,
          aiKeywords: service.aiKeywords || [],
          updatedAt: service._updatedAt
        },
        source: 'ai-first-service'
      };
    });

    console.log('\n🔄 ベクトル埋め込みを再生成中...');
    await vectorStore.addDocuments(documents);

    // 4. 結果を確認
    console.log('\n✅ 修正完了！結果を確認中...');

    // 低い閾値で検索テスト
    const testResults = await vectorStore.hybridSearch('どのような講座がありますか？', {
      topK: 20,
      threshold: 0.05
    });

    const serviceResults = testResults.filter(r => r.source === 'ai-first-service');
    console.log(`🎯 Serviceデータの検索結果: ${serviceResults.length}件`);

    if (serviceResults.length > 0) {
      console.log('\n📚 検索されたService:');
      serviceResults.forEach((result, index) => {
        const metadata = typeof result.metadata === 'string' ?
          JSON.parse(result.metadata) : result.metadata;
        const score = result.combined_score || result.vector_score || 0;
        console.log(`  ${index + 1}. [${score.toFixed(3)}] ${metadata.name}`);
      });

      const scores = serviceResults.map(r => r.combined_score || r.vector_score || 0);
      const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
      console.log(`\n📊 平均スコア: ${avgScore.toFixed(3)}`);
      console.log(`📊 推奨閾値: ${Math.max(0.05, Math.min(...scores) - 0.01).toFixed(3)}`);
    } else {
      console.log('❌ まだServiceデータが検索されません。コンテンツをさらに調整が必要です。');
    }

  } catch (error) {
    console.error('❌ 修正エラー:', error);
  }
}

fixServiceVectors();