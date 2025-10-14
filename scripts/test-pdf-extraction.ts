import { readFileSync } from 'fs';
import { extractText } from 'unpdf';

/**
 * PDFファイルをテストしてテキスト抽出を診断
 */
async function testPdfExtraction(filePath: string) {
  console.log('\n========================================');
  console.log('🧪 Testing PDF:', filePath);
  console.log('========================================');

  try {
    // Read the PDF file
    console.log('📖 Reading file...');
    const buffer = readFileSync(filePath);
    console.log('✅ File read successfully');

    // File size information
    const fileSizeKB = (buffer.length / 1024).toFixed(2);
    const fileSizeMB = (buffer.length / 1024 / 1024).toFixed(2);
    console.log(`📦 File size: ${fileSizeKB}KB (${fileSizeMB}MB)`);
    console.log(`📦 Buffer length: ${buffer.length} bytes`);

    // Check PDF header
    const header = buffer.slice(0, 5).toString('ascii');
    console.log('📄 PDF Header (first 5 bytes):', header);
    if (!header.startsWith('%PDF-')) {
      console.error('⚠️  WARNING: File does not have valid PDF header!');
      console.error('📄 First 20 bytes:', buffer.slice(0, 20).toString('ascii'));
      return;
    }
    console.log('✅ Valid PDF header detected');

    // Extract text using unpdf
    console.log('⏱️  Starting text extraction with unpdf...');
    const startTime = Date.now();

    const data = await extractText(new Uint8Array(buffer));

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`⏱️  Extraction completed in ${duration}s`);

    // Analyze extracted data
    console.log('\n📊 Extraction Results:');
    console.log('  - Type of data.text:', Array.isArray(data.text) ? 'Array' : typeof data.text);
    console.log('  - Total pages:', data.totalPages || 0);

    if (Array.isArray(data.text)) {
      console.log('  - Array length:', data.text.length);
      for (let i = 0; i < Math.min(3, data.text.length); i++) {
        console.log(`  - Page ${i + 1} text length:`, data.text[i]?.length || 0);
        if (data.text[i] && data.text[i].length > 0) {
          console.log(`  - Page ${i + 1} preview:`, data.text[i].substring(0, 100).replace(/\n/g, '\\n'));
        } else {
          console.log(`  - Page ${i + 1} preview: (empty)`);
        }
      }
    }

    // Combine text
    const extractedText = Array.isArray(data.text) ? data.text.join('\n\n') : data.text;

    console.log('\n📝 Combined Text Information:');
    console.log('  - Total characters:', extractedText.length);
    console.log('  - Total lines:', extractedText.split('\n').length);

    if (extractedText.length === 0) {
      console.error('\n⚠️  WARNING: Extracted text is EMPTY!');
      console.error('  Possible reasons:');
      console.error('    1. The PDF contains only images (scanned document)');
      console.error('    2. The PDF text is encoded in an unsupported format');
      console.error('    3. The PDF is corrupted or protected');
    } else if (extractedText.length < 50) {
      console.warn('\n⚠️  WARNING: Extracted text is very short (<50 characters)');
      console.warn('  - Full text:', extractedText);
    } else {
      console.log('\n✅ PDF text extracted successfully');
      console.log('  - First 300 characters:');
      console.log('    ', extractedText.substring(0, 300).replace(/\n/g, '\\n'));
    }

    console.log('\n========================================');
    console.log('✅ TEST COMPLETED');
    console.log('========================================');

  } catch (error) {
    console.error('\n========================================');
    console.error('❌ ERROR DURING TEST');
    console.error('========================================');
    console.error('Error type:', error?.constructor?.name);
    console.error('Error message:', error instanceof Error ? error.message : 'Unknown error');
    if (error instanceof Error && error.stack) {
      console.error('Stack trace:');
      console.error(error.stack);
    }
    console.error('========================================');
  }
}

/**
 * メイン関数
 */
async function main() {
  console.log('🚀 PDF EXTRACTION TEST SUITE');
  console.log('Testing two PDF files to diagnose extraction issues');

  // Test 1: Working PDF
  await testPdfExtraction('/Users/tonychustudio/Desktop/REC-0000000011 (1).pdf');

  // Test 2: Failing PDF
  await testPdfExtraction('/Users/tonychustudio/Desktop/石野歯科医院様診療科目詳細.pdf');

  console.log('\n');
  console.log('🏁 ALL TESTS COMPLETED');
}

main().catch(console.error);
