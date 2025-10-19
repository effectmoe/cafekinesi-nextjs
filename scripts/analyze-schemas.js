#!/usr/bin/env node

/**
 * Sanity スキーマ分析スクリプト
 *
 * スキーマファイルを解析して、使用状況のレポートを生成します。
 *
 * 使用方法:
 *   npm run analyze:schemas
 *
 * または:
 *   node scripts/analyze-schemas.js
 */

const fs = require('fs');
const path = require('path');

// 設定
const SCHEMA_DIR = path.join(__dirname, '../studio/schemas');
const INDEX_FILE = path.join(SCHEMA_DIR, 'index.ts');
const OUTPUT_FILE = path.join(__dirname, '../SCHEMA_ANALYSIS.md');

// 色付き出力
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
};

const log = {
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
};

/**
 * index.tsからアクティブなスキーマのリストを取得
 */
function getActiveSchemas() {
  const indexContent = fs.readFileSync(INDEX_FILE, 'utf-8');
  const lines = indexContent.split('\n');

  const activeSchemas = [];
  const deprecatedSchemas = [];

  for (const line of lines) {
    // コメントアウトされていないimport文を探す
    const importMatch = line.match(/^import\s+(\w+)\s+from\s+['"](.+)['"]/);
    if (importMatch) {
      const [, name, filePath] = importMatch;
      activeSchemas.push({ name, filePath });
    }

    // コメントアウトされたimport文を探す（非推奨化されたスキーマ）
    const deprecatedMatch = line.match(/^\/\/\s*import\s+(\w+)\s+from\s+['"](.+)['"]/);
    if (deprecatedMatch) {
      const [, name, filePath] = deprecatedMatch;
      deprecatedSchemas.push({ name, filePath });
    }
  }

  return { activeSchemas, deprecatedSchemas };
}

/**
 * スキーマファイルからメタ情報を抽出
 */
function extractSchemaMetadata(filePath) {
  const fullPath = path.join(SCHEMA_DIR, filePath.replace(/^\.\//, '') + '.ts');

  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const content = fs.readFileSync(fullPath, 'utf-8');

  // descriptionフィールドを探す
  const descriptionMatch = content.match(/description:\s*['"`](.+?)['"`]/);
  const description = descriptionMatch ? descriptionMatch[1] : '';

  // アイコンを探す
  const iconMatch = content.match(/icon:\s*.*?['"`](.+?)['"`]/);
  const icon = iconMatch ? iconMatch[1] : '';

  // スキーマ名（name フィールド）を探す
  const nameMatch = content.match(/name:\s*['"`](\w+)['"`]/);
  const schemaName = nameMatch ? nameMatch[1] : '';

  // タイトル（title フィールド）を探す
  const titleMatch = content.match(/title:\s*['"`](.+?)['"`]/);
  const title = titleMatch ? titleMatch[1] : '';

  return {
    schemaName,
    title,
    description,
    icon,
    filePath,
  };
}

/**
 * Markdownレポートを生成
 */
function generateReport(activeSchemas, deprecatedSchemas) {
  const now = new Date().toISOString().split('T')[0];

  let report = `# Sanity スキーマ分析レポート

**生成日時**: ${now}
**生成方法**: \`npm run analyze:schemas\`

---

## 📊 サマリー

- **アクティブなスキーマ**: ${activeSchemas.length}個
- **非推奨化されたスキーマ**: ${deprecatedSchemas.length}個
- **総スキーマ数**: ${activeSchemas.length + deprecatedSchemas.length}個

---

## ✅ アクティブなスキーマ（${activeSchemas.length}個）

| # | スキーマ名 | タイトル | アイコン | ステータス |
|---|-----------|---------|---------|-----------|
`;

  activeSchemas.forEach((schema, index) => {
    const metadata = extractSchemaMetadata(schema.filePath);
    if (metadata) {
      const statusMatch = metadata.description.match(/ステータス:\s*(.+?)\s*\|/);
      const status = statusMatch ? statusMatch[1] : '-';
      report += `| ${index + 1} | \`${metadata.schemaName}\` | ${metadata.title} | ${metadata.icon || '-'} | ${status} |\n`;
    }
  });

  report += `\n---\n\n## ⚠️ 非推奨化されたスキーマ（${deprecatedSchemas.length}個）

| # | スキーマ名 | ファイルパス |
|---|-----------|------------|
`;

  deprecatedSchemas.forEach((schema, index) => {
    report += `| ${index + 1} | \`${schema.name}\` | ${schema.filePath} |\n`;
  });

  report += `\n---

## 📝 詳細情報

### アクティブなスキーマの詳細

`;

  activeSchemas.forEach((schema) => {
    const metadata = extractSchemaMetadata(schema.filePath);
    if (metadata) {
      report += `#### ${metadata.icon || '📄'} ${metadata.title} (\`${metadata.schemaName}\`)

${metadata.description || '説明なし'}

- **ファイル**: \`studio/schemas/${schema.filePath}.ts\`

---

`;
    }
  });

  report += `\n## 🔧 メンテナンス

### スキーマを非推奨化する場合

1. \`studio/schemas/index.ts\` でimport文とexport文をコメントアウト
2. このスクリプトを実行して分析レポートを更新: \`npm run analyze:schemas\`
3. \`SCHEMA_MAP.md\` を手動で更新（必要に応じて）

### スキーマを復元する場合

1. \`studio/schemas/index.ts\` でコメントアウトを解除
2. このスクリプトを実行: \`npm run analyze:schemas\`
3. \`SCHEMA_MAP.md\` を手動で更新

---

**このレポートは自動生成されました。手動で編集しないでください。**
`;

  return report;
}

/**
 * メイン処理
 */
function main() {
  log.info('Sanity スキーマ分析を開始します...');

  // index.tsからスキーマリストを取得
  log.info('index.ts を読み込んでいます...');
  const { activeSchemas, deprecatedSchemas } = getActiveSchemas();

  log.success(`アクティブなスキーマ: ${activeSchemas.length}個`);
  log.warning(`非推奨化されたスキーマ: ${deprecatedSchemas.length}個`);

  // メタデータを抽出
  log.info('スキーマファイルからメタデータを抽出しています...');

  // レポートを生成
  log.info('レポートを生成しています...');
  const report = generateReport(activeSchemas, deprecatedSchemas);

  // ファイルに書き込み
  fs.writeFileSync(OUTPUT_FILE, report, 'utf-8');
  log.success(`レポートを生成しました: ${OUTPUT_FILE}`);

  // サマリーを表示
  console.log('\n' + '='.repeat(60));
  console.log('📊 分析結果');
  console.log('='.repeat(60));
  console.log(`アクティブなスキーマ:     ${activeSchemas.length}個`);
  console.log(`非推奨化されたスキーマ:   ${deprecatedSchemas.length}個`);
  console.log(`総スキーマ数:             ${activeSchemas.length + deprecatedSchemas.length}個`);
  console.log('='.repeat(60));
  console.log(`\n📄 詳細レポート: ${OUTPUT_FILE}`);
}

// スクリプト実行
try {
  main();
} catch (error) {
  log.error(`エラーが発生しました: ${error.message}`);
  process.exit(1);
}
