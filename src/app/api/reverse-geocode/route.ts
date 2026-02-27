import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/reverse-geocode?lat=X&lng=Y
 * Reverse geocoding via Nominatim: coordinates → street name + number
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');

    if (!lat || !lng) {
      return NextResponse.json(
        { error: 'lat and lng are required' },
        { status: 400 }
      );
    }

    const nominatimUrl = new URL('https://nominatim.openstreetmap.org/reverse');
    nominatimUrl.searchParams.set('lat', lat);
    nominatimUrl.searchParams.set('lon', lng);
    nominatimUrl.searchParams.set('format', 'json');
    nominatimUrl.searchParams.set('addressdetails', '1');

    const userAgent = process.env.NOMINATIM_USER_AGENT || 'EmergenciaColetas/2.0';

    const response = await fetch(nominatimUrl.toString(), {
      headers: { 'User-Agent': userAgent },
    });

    if (!response.ok) {
      throw new Error(`Nominatim error: ${response.status}`);
    }

    const data = await response.json();

    const addr = data.address ?? {};
    const road = addr.road ?? addr.pedestrian ?? addr.footway ?? addr.path ?? '';
    const number = addr.house_number ?? '';
    const shortAddress = road
      ? number
        ? `${road}, ${number}`
        : road
      : data.display_name ?? '';

    return NextResponse.json({ address: shortAddress });
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    return NextResponse.json({ address: null }, { status: 200 });
  }
}
