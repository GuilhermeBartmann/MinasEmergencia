import { NextRequest, NextResponse } from 'next/server';
import { getAdminFirestore } from '@/lib/firebase/admin';
import { getCityBySlug } from '@/config/cities';
import { rateLimit, getRateLimitHeaders } from '@/lib/api/rate-limiter';
import { pointSchema } from '@/lib/validation/schemas';
import { sanitizeInput } from '@/lib/validation/sanitizer';
import { FieldValue } from 'firebase-admin/firestore';

/**
 * GET /api/points?city=jf
 * Get all points for a city
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const citySlug = searchParams.get('city');

    if (!citySlug) {
      return NextResponse.json(
        { error: 'City parameter is required' },
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

    // Get Firestore instance
    const db = getAdminFirestore();

    // Query points
    const snapshot = await db
      .collection(city.collectionName)
      .orderBy('timestamp', 'desc')
      .limit(500)
      .get();

    const points = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({
      success: true,
      points,
      count: points.length,
    });
  } catch (error) {
    console.error('Error fetching points:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/points
 * Create a new point
 */
export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimitResult = await rateLimit(request);
    const rateLimitHeaders = getRateLimitHeaders(rateLimitResult);

    if (!rateLimitResult.success) {
      return NextResponse.json(
        {
          error: 'Too many requests. Please wait before submitting again.',
          retryAfter: rateLimitResult.retryAfter,
        },
        {
          status: 429,
          headers: rateLimitHeaders,
        }
      );
    }

    // Parse request body
    const body = await request.json();

    // Validate with Zod
    const validationResult = pointSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validationResult.error.issues,
        },
        {
          status: 400,
          headers: rateLimitHeaders,
        }
      );
    }

    const data = validationResult.data;

    // Get city
    const city = getCityBySlug(data.citySlug);
    if (!city) {
      return NextResponse.json(
        { error: 'Invalid city' },
        { status: 400, headers: rateLimitHeaders }
      );
    }

    // Sanitize inputs
    const sanitizedData = {
      tipo: data.tipo,
      nome: sanitizeInput(data.nome),
      endereco: data.endereco ? sanitizeInput(data.endereco) : '',
      complemento: data.complemento ? sanitizeInput(data.complemento) : '',
      horarios: data.horarios ? sanitizeInput(data.horarios) : '',
      doacoes: data.doacoes,
      responsavel: data.responsavel ? sanitizeInput(data.responsavel) : '',
      telefone: data.telefone || '',
      capacidade: data.capacidade || null,
      lat: data.lat!,
      lng: data.lng!,
      citySlug: data.citySlug,
      _version: 1,
    };

    // Get Firestore instance
    const db = getAdminFirestore();

    // Add document
    const docRef = await db.collection(city.collectionName).add({
      ...sanitizedData,
      timestamp: FieldValue.serverTimestamp(),
    });

    return NextResponse.json(
      {
        success: true,
        id: docRef.id,
        message: 'Point created successfully',
      },
      {
        status: 201,
        headers: rateLimitHeaders,
      }
    );
  } catch (error) {
    console.error('Error creating point:', error);

    // Check for specific error types
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
