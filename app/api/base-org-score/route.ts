import { NextRequest, NextResponse } from 'next/server';
import { fetchBaseOrgOnchainScore } from '@/utils/fetchBaseOrgScore';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const basename = searchParams.get('basename');

    if (!basename) {
      return NextResponse.json(
        { error: 'Basename parameter is required' },
        { status: 400 }
      );
    }

    // Use the direct HTML scraping function (server-side)
    const result = await fetchBaseOrgOnchainScore(basename);
    
    console.log('API route - fetched result:', JSON.stringify({
      onchainScore: result.onchainScore,
      builderScore: result.builderScore,
      basename: result.basename,
      error: result.error,
    }, null, 2));
    console.log('API route - onchainScore:', result.onchainScore, 'builderScore:', result.builderScore);
    
    return NextResponse.json({
      onchainScore: result.onchainScore,
      builderScore: result.builderScore,
      basename: result.basename,
      error: result.error,
    });
  } catch (error) {
    console.error('Error in base-org-score API route:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch base.org score',
        onchainScore: null,
        basename: request.nextUrl.searchParams.get('basename') || '',
      },
      { status: 500 }
    );
  }
}

