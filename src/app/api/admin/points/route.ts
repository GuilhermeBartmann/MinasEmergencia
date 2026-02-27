import { NextRequest, NextResponse } from 'next/server';
import { requireAdminSession } from '@/lib/admin/session';
import { getAdminFirestore } from '@/lib/firebase/admin';
import { getCityBySlug, getAllEnabledCities } from '@/config/cities';
import { adminPointSchema } from '@/lib/validation/schemas';
import { sanitizeInput } from '@/lib/validation/sanitizer';
import { FieldValue } from 'firebase-admin/firestore';

/**
 * GET /api/admin/points?city=jf|uba|all
 */
export async function GET(request: NextRequest) {
  const session = requireAdminSession(request);
  if (session instanceof NextResponse) return session;

  try {
    const citySlug = request.nextUrl.searchParams.get('city') ?? 'all';
    const db = getAdminFirestore();

    if (citySlug === 'all') {
      const cities = getAllEnabledCities();
      const results = await Promise.all(
        cities.map(async (city) => {
          const snapshot = await db
            .collection(city.collectionName)
            .orderBy('timestamp', 'desc')
            .limit(500)
            .get();
          return snapshot.docs.map(doc => ({
            id: doc.id,
            citySlug: city.slug,
            ...doc.data(),
          }));
        })
      );
      const points = results.flat();
      return NextResponse.json({ success: true, points, count: points.length });
    }

    const city = getCityBySlug(citySlug);
    if (!city) {
      return NextResponse.json({ error: 'City not found' }, { status: 404 });
    }

    const snapshot = await db
      .collection(city.collectionName)
      .orderBy('timestamp', 'desc')
      .limit(500)
      .get();

    const points = snapshot.docs.map(doc => ({
      id: doc.id,
      citySlug: city.slug,
      ...doc.data(),
    }));

    return NextResponse.json({ success: true, points, count: points.length });
  } catch (error) {
    console.error('Error fetching admin points:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * POST /api/admin/points
 * Creates a new point (no rate limit for admin)
 */
export async function POST(request: NextRequest) {
  const session = requireAdminSession(request);
  if (session instanceof NextResponse) return session;

  try {
    const body = await request.json();
    const validationResult = adminPointSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validationResult.error.issues },
        { status: 400 }
      );
    }

    const data = validationResult.data;
    const city = getCityBySlug(data.citySlug);
    if (!city) {
      return NextResponse.json({ error: 'Invalid city' }, { status: 400 });
    }

    const sanitizedData = {
      tipo: data.tipo,
      nome: sanitizeInput(data.nome),
      endereco: data.endereco ? sanitizeInput(data.endereco) : '',
      complemento: data.complemento ? sanitizeInput(data.complemento) : '',
      horarios: data.horarios ? sanitizeInput(data.horarios) : '',
      doacoes: data.doacoes,
      responsavel: data.responsavel ? sanitizeInput(data.responsavel) : '',
      telefone: data.telefone || '',
      capacidade: data.capacidade ?? null,
      lat: data.lat,
      lng: data.lng,
      citySlug: data.citySlug,
      _version: 1,
    };

    const db = getAdminFirestore();
    const docRef = await db.collection(city.collectionName).add({
      ...sanitizedData,
      timestamp: FieldValue.serverTimestamp(),
    });

    return NextResponse.json(
      { success: true, id: docRef.id, message: 'Point created successfully' },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }
    console.error('Error creating admin point:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
