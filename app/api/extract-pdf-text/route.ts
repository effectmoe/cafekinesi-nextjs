import { NextRequest, NextResponse } from 'next/server';
import pdf from 'pdf-parse';

// CORS headers for Sanity Studio
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(request: NextRequest) {
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
    const buffer = Buffer.from(arrayBuffer);

    // Extract text using pdf-parse
    const data = await pdf(buffer);
    const extractedText = data.text;

    console.log('✅ PDF text extracted successfully');
    console.log(`📊 Extracted ${extractedText.length} characters from ${data.numpages} pages`);

    return NextResponse.json(
      {
        success: true,
        text: extractedText,
        metadata: {
          pages: data.numpages,
          info: data.info,
          textLength: extractedText.length,
        },
      },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error('❌ PDF extraction error:', error);
    return NextResponse.json(
      {
        error: 'Failed to extract text from PDF',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500, headers: corsHeaders }
    );
  }
}
