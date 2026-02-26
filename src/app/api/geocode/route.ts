import { NextRequest, NextResponse } from 'next/server';
import { getCityBySlug } from '@/config/cities';

/**
 * GET /api/geocode?address=...&city=jf
 * Proxy for Nominatim geocoding API
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const address = searchParams.get('address');
    const citySlug = searchParams.get('city');

    if (!address || !citySlug) {
      return NextResponse.json(
        { error: 'Address and city parameters are required' },
        { status: 400 }
      );
    }

    const city = getCityBySlug(citySlug);
    if (!city) {
      return NextResponse.json(
        { error: 'City not found' },
        { status: 404 }
      );
    }

    // Build search query with city context
    const searchQuery = `${address}, ${city.name}, ${city.state}, Brasil`;

    // Call Nominatim API
    const nominatimUrl = new URL('https://nominatim.openstreetmap.org/search');
    nominatimUrl.searchParams.set('q', searchQuery);
    nominatimUrl.searchParams.set('format', 'json');
    nominatimUrl.searchParams.set('limit', '5');
    nominatimUrl.searchParams.set('addressdetails', '1');
    nominatimUrl.searchParams.set('bounded', '1');
    nominatimUrl.searchParams.set('viewbox',
      `${city.bounds.west},${city.bounds.south},${city.bounds.east},${city.bounds.north}`
    );

    const userAgent = process.env.NOMINATIM_USER_AGENT || 'EmergenciaColetas/2.0';

    const response = await fetch(nominatimUrl.toString(), {
      headers: {
        'User-Agent': userAgent,
      },
    });

    if (!response.ok) {
      throw new Error(`Nominatim API error: ${response.status}`);
    }

    const results = await response.json();

    if (!results || results.length === 0) {
      return NextResponse.json(
        { error: 'No results found for this address' },
        { status: 404 }
      );
    }

    // Return first result (best match)
    const bestMatch = results[0];

    return NextResponse.json({
      success: true,
      result: {
        lat: parseFloat(bestMatch.lat),
        lng: parseFloat(bestMatch.lon),
        displayName: bestMatch.display_name,
        address: bestMatch.address,
      },
    });
  } catch (error) {
    console.error('Geocoding error:', error);
    return NextResponse.json(
      { error: 'Geocoding service unavailable' },
      { status: 503 }
    );
  }
}
