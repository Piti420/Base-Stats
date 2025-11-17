import { NextRequest, NextResponse } from 'next/server';
import { fetchBasenameFromAddress } from '@/utils/fetchBasenameFromAddress';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const address = searchParams.get('address');

    if (!address) {
      return NextResponse.json(
        { error: 'Address parameter is required' },
        { status: 400 }
      );
    }

    const result = await fetchBasenameFromAddress(address);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in resolve-basename API route:', error);
    return NextResponse.json(
      { 
        error: 'Failed to resolve basename',
        basename: null,
        address: request.nextUrl.searchParams.get('address') || '',
      },
      { status: 500 }
    );
  }
}

