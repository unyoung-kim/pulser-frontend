import { NextResponse } from 'next/server';

// Use environment variable with fallback
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Log the request for debugging
    console.log('Forwarding request to backend:', `${BACKEND_URL}/api/web-retrieval`);

    const response = await fetch(`${BACKEND_URL}/api/web-retrieval`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    // Log the response for debugging
    console.log('Response from backend:', data);

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in web-retrieval:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate content' },
      { status: 500 }
    );
  }
}
