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
      return NextResponse.json(
        { error: 'Missing fileUrl parameter' },
        { status: 400, headers: corsHeaders }
      );
    }

    console.log('📄 Extracting text from PDF:', fileUrl);

    // Fetch the PDF file
    const response = await fetch(fileUrl);
    if (!response.ok) {
      console.error('Failed to fetch PDF:', response.statusText);
      return NextResponse.json(
        { error: 'Failed to fetch PDF file' },
        { status: 500, headers: corsHeaders }
      );
    }

    // Get the PDF as ArrayBuffer
    const arrayBuffer = await response.arrayBuffer();
    const fileSizeMB = (arrayBuffer.byteLength / 1024 / 1024).toFixed(2);
    console.log(`📦 PDF file size: ${fileSizeMB}MB`);

    // Check file size limit (max 4.5MB for Vercel)
    if (arrayBuffer.byteLength > 4.5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'PDF file too large. Maximum size is 4.5MB' },
        { status: 413, headers: corsHeaders }
      );
    }

    console.log('⏱️  Starting PDF text extraction...');
    const extractStartTime = Date.now();

    // Extract text using unpdf
    const data = await extractText(new Uint8Array(arrayBuffer));
    const extractedText = Array.isArray(data.text) ? data.text.join('\n\n') : data.text;

    const extractDuration = ((Date.now() - extractStartTime) / 1000).toFixed(2);
    console.log(`⏱️  Extraction completed in ${extractDuration}s`);

    console.log('✅ PDF text extracted successfully');
    console.log(`📊 Extracted ${extractedText.length} characters from ${data.totalPages || 0} pages`);

    const totalDuration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`⏱️  Total processing time: ${totalDuration}s`);

    return NextResponse.json(
      {
        success: true,
        text: extractedText,
        metadata: {
          pages: data.totalPages || 0,
          textLength: extractedText.length,
          processingTime: `${totalDuration}s`,
        },
      },
      { headers: corsHeaders }
    );
  } catch (error) {
    const totalDuration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.error('❌ PDF extraction error:', error);
    console.error(`⏱️  Failed after ${totalDuration}s`);

    return NextResponse.json(
      {
        error: 'Failed to extract text from PDF',
        details: error instanceof Error ? error.message : 'Unknown error',
        processingTime: `${totalDuration}s`,
      },
      { status: 500, headers: corsHeaders }
    );
  }
}
