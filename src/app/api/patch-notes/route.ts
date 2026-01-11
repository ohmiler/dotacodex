import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const version = searchParams.get('version') || '7.40b';
    const language = searchParams.get('language') || 'english';

    try {
        const response = await fetch(
            `https://www.dota2.com/datafeed/patchnotes?version=${version}&language=${language}`,
            {
                headers: {
                    'Accept': 'application/json',
                },
                next: { revalidate: 3600 } // Cache for 1 hour
            }
        );

        if (!response.ok) {
            return NextResponse.json(
                { error: 'Failed to fetch patch notes from Valve API' },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Patch notes API error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
