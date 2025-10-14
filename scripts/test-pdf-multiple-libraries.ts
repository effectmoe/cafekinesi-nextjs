import { readFileSync } from 'fs';
import { extractText } from 'unpdf';

/**
 * 複数のライブラリでPDFテキスト抽出をテスト
 */
async function testWithMultipleLibraries(filePath: string) {
  console.log('\n========================================');
  console.log('🧪 Testing PDF:', filePath);
  console.log('========================================');

  const buffer = readFileSync(filePath);
  const fileSizeKB = (buffer.length / 1024).toFixed(2);
  console.log(`📦 File size: ${fileSizeKB}KB`);

  // Test 1: unpdf
  console.log('\n--- Test 1: unpdf ---');
  try {
    const startTime = Date.now();
    const data = await extractText(new Uint8Array(buffer));
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);

    const extractedText = Array.isArray(data.text) ? data.text.join('\n\n') : data.text;

    console.log('✅ unpdf succeeded');
    console.log(`  - Duration: ${duration}s`);
    console.log(`  - Pages: ${data.totalPages || 0}`);
    console.log(`  - Characters: ${extractedText.length}`);
    console.log(`  - Preview: ${extractedText.substring(0, 200).replace(/\n/g, '\\n')}`);

    // Show per-page info if array
    if (Array.isArray(data.text)) {
      console.log(`  - Per-page analysis:`);
      for (let i = 0; i < data.text.length; i++) {
        const pageText = data.text[i] || '';
        console.log(`    Page ${i + 1}: ${pageText.length} chars`);
        if (pageText.length > 0) {
          console.log(`      Preview: ${pageText.substring(0, 100).replace(/\n/g, '\\n')}`);
        }
      }
    }
  } catch (error) {
    console.error('❌ unpdf failed:', error instanceof Error ? error.message : error);
  }

  // Test 2: pdf-parse
  console.log('\n--- Test 2: pdf-parse ---');
  try {
    const { PDFParse } = await import('pdf-parse');
    const startTime = Date.now();
    const parser = new PDFParse();
    const data = await parser.parse(buffer);
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);

    console.log('✅ pdf-parse succeeded');
    console.log(`  - Duration: ${duration}s`);
    console.log(`  - Pages: ${data.numpages}`);
    console.log(`  - Characters: ${data.text.length}`);
    console.log(`  - Info:`, JSON.stringify(data.info, null, 2));
    console.log(`  - Preview: ${data.text.substring(0, 200).replace(/\n/g, '\\n')}`);

    // Check if text is meaningful
    if (data.text.length === 0) {
      console.error('⚠️  pdf-parse extracted 0 characters - likely image-based PDF');
    } else if (data.text.length < 50) {
      console.warn('⚠️  pdf-parse extracted very little text (<50 chars)');
      console.warn(`  - Full text: "${data.text}"`);
    }
  } catch (error) {
    console.error('❌ pdf-parse failed:', error instanceof Error ? error.message : error);
  }

  console.log('\n========================================');
}

/**
 * メイン関数
 */
async function main() {
  console.log('🚀 PDF EXTRACTION LIBRARY COMPARISON TEST');

  // Test working PDF
  console.log('\n\n📄 Testing WORKING PDF:');
  await testWithMultipleLibraries('/Users/tonychustudio/Desktop/REC-0000000011 (1).pdf');

  // Test failing PDF
  console.log('\n\n📄 Testing FAILING PDF:');
  await testWithMultipleLibraries('/Users/tonychustudio/Desktop/石野歯科医院様診療科目詳細.pdf');

  console.log('\n🏁 ALL TESTS COMPLETED\n');
}

main().catch(console.error);
