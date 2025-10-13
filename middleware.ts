import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // CORS headers for PDF extraction API
  if (request.nextUrl.pathname.startsWith('/api/extract-pdf-text')) {
    const origin = request.headers.get('origin') || '';
    const allowedOrigins = [
      'https://cafekinesi.sanity.studio',
      'http://localhost:3333', // Local Sanity Studio
    ];

    // Handle preflight request
    if (request.method === 'OPTIONS') {
      const response = NextResponse.json({}, { status: 200 });

      if (allowedOrigins.includes(origin)) {
        response.headers.set('Access-Control-Allow-Origin', origin);
      }

      response.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
      response.headers.set('Access-Control-Max-Age', '86400');

      return response;
    }

    // Handle actual request
    const response = NextResponse.next();

    if (allowedOrigins.includes(origin)) {
      response.headers.set('Access-Control-Allow-Origin', origin);
    }

    response.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');

    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/extract-pdf-text',
};
