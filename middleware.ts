import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const origin = request.headers.get('origin') || '';
  const allowedOrigins = [
    'https://cafekinesi.sanity.studio',
    'http://localhost:3333', // Local Sanity Studio
  ];

  // CORS headers for PDF extraction API
  if (request.nextUrl.pathname === '/api/extract-pdf-text') {
    // Handle preflight request
    if (request.method === 'OPTIONS') {
      const response = new NextResponse(null, { status: 204 });

      if (allowedOrigins.includes(origin)) {
        response.headers.set('Access-Control-Allow-Origin', origin);
      }

      response.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
      response.headers.set('Access-Control-Max-Age', '86400');

      return response;
    }

    // Handle actual POST request - just add CORS headers, don't block
    if (request.method === 'POST') {
      // Clone the request headers
      const requestHeaders = new Headers(request.headers);

      // Create response that will continue to the API route
      const response = NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });

      if (allowedOrigins.includes(origin)) {
        response.headers.set('Access-Control-Allow-Origin', origin);
      }

      response.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type');

      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/extract-pdf-text',
};
