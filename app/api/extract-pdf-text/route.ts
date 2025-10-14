import { NextRequest, NextResponse } from 'next/server';
import { extractText } from 'unpdf';

// CORS headers for Sanity Studio
const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://cafekinesi.sanity.studio',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Max-Age': '86400',
};

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  });
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    const { fileUrl } = await request.json();

    if (!fileUrl) {
      console.error('🚫 Missing fileUrl parameter');
      return NextResponse.json(
        { error: 'Missing fileUrl parameter' },
        { status: 400, headers: corsHeaders }
      );
    }

    console.log('========================================');
    console.log('🚀 PDF TEXT EXTRACTION DEBUG START');
    console.log('========================================');
    console.log('📄 File URL:', fileUrl);
    console.log('⏰ Start time:', new Date(startTime).toISOString());

    // Fetch the PDF file
    console.log('🌐 Fetching PDF from URL...');
    const response = await fetch(fileUrl);
    console.log('📡 Response status:', response.status, response.statusText);
    console.log('📋 Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      console.error('❌ Failed to fetch PDF:', response.statusText);
      return NextResponse.json(
        { error: 'Failed to fetch PDF file' },
        { status: 500, headers: corsHeaders }
      );
    }

    // Get the PDF as ArrayBuffer
    console.log('💾 Converting response to ArrayBuffer...');
    const arrayBuffer = await response.arrayBuffer();
    const fileSizeKB = (arrayBuffer.byteLength / 1024).toFixed(2);
    const fileSizeMB = (arrayBuffer.byteLength / 1024 / 1024).toFixed(2);
    console.log(`📦 PDF file size: ${fileSizeKB}KB (${fileSizeMB}MB)`);
    console.log(`📦 Buffer byte length: ${arrayBuffer.byteLength} bytes`);

    // Validate PDF header
    const uint8Array = new Uint8Array(arrayBuffer);
    const header = String.fromCharCode(...uint8Array.slice(0, 5));
    console.log('📄 PDF Header (first 5 bytes):', header);
    if (!header.startsWith('%PDF-')) {
      console.error('⚠️  WARNING: File does not have valid PDF header!');
      console.error('📄 First 20 bytes:', String.fromCharCode(...uint8Array.slice(0, 20)));
    } else {
      console.log('✅ Valid PDF header detected');
    }

    // Check file size limit (max 4.5MB for Vercel)
    if (arrayBuffer.byteLength > 4.5 * 1024 * 1024) {
      console.error('❌ PDF file too large:', fileSizeMB, 'MB (max: 4.5MB)');
      return NextResponse.json(
        { error: 'PDF file too large. Maximum size is 4.5MB' },
        { status: 413, headers: corsHeaders }
      );
    }

    console.log('⏱️  Starting PDF text extraction with unpdf...');
    const extractStartTime = Date.now();

    // Extract text using unpdf
    const data = await extractText(uint8Array);

    const extractDuration = ((Date.now() - extractStartTime) / 1000).toFixed(2);
    console.log(`⏱️  Extraction completed in ${extractDuration}s`);

    // Debug extracted data structure
    console.log('📊 Extraction result structure:');
    console.log('  - Type of data.text:', Array.isArray(data.text) ? 'Array' : typeof data.text);
    console.log('  - Total pages:', data.totalPages || 0);

    if (Array.isArray(data.text)) {
      console.log('  - Array length:', data.text.length);
      console.log('  - First page text length:', data.text[0]?.length || 0);
      console.log('  - First page text preview:', data.text[0]?.substring(0, 100) || '(empty)');
    }

    const extractedText = Array.isArray(data.text) ? data.text.join('\n\n') : data.text;

    console.log('📝 Extracted text information:');
    console.log('  - Total characters:', extractedText.length);
    console.log('  - Total lines:', extractedText.split('\n').length);
    console.log('  - First 200 characters preview:');
    console.log('    ', extractedText.substring(0, 200).replace(/\n/g, '\\n'));

    if (extractedText.length === 0) {
      console.error('⚠️  WARNING: Extracted text is EMPTY!');
      console.error('  - This might indicate:');
      console.error('    1. The PDF contains only images (scanned document)');
      console.error('    2. The PDF text is encoded in an unsupported format');
      console.error('    3. The PDF is corrupted or protected');
    } else if (extractedText.length < 50) {
      console.warn('⚠️  WARNING: Extracted text is very short (<50 characters)');
      console.warn('  - Full text:', extractedText);
    } else {
      console.log('✅ PDF text extracted successfully');
    }

    const totalDuration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`⏱️  Total processing time: ${totalDuration}s`);
    console.log('========================================');
    console.log('✅ PDF TEXT EXTRACTION DEBUG END');
    console.log('========================================');

    return NextResponse.json(
      {
        success: true,
        text: extractedText,
        metadata: {
          pages: data.totalPages || 0,
          textLength: extractedText.length,
          processingTime: `${totalDuration}s`,
          linesCount: extractedText.split('\n').length,
          isEmpty: extractedText.length === 0,
          preview: extractedText.substring(0, 200),
        },
      },
      { headers: corsHeaders }
    );
  } catch (error) {
    const totalDuration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.error('========================================');
    console.error('❌ PDF EXTRACTION ERROR');
    console.error('========================================');
    console.error('⏱️  Failed after', totalDuration, 's');
    console.error('❌ Error type:', error?.constructor?.name);
    console.error('❌ Error message:', error instanceof Error ? error.message : 'Unknown error');

    if (error instanceof Error && error.stack) {
      console.error('📚 Stack trace:');
      console.error(error.stack);
    }

    console.error('========================================');

    return NextResponse.json(
      {
        error: 'Failed to extract text from PDF',
        details: error instanceof Error ? error.message : 'Unknown error',
        errorType: error?.constructor?.name || 'Unknown',
        processingTime: `${totalDuration}s`,
      },
      { status: 500, headers: corsHeaders }
    );
  }
}
