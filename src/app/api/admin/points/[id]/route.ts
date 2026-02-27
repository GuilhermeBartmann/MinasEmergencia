import { NextRequest, NextResponse } from 'next/server';
import { requireAdminSession } from '@/lib/admin/session';
import { getAdminFirestore } from '@/lib/firebase/admin';
import { getCityBySlug } from '@/config/cities';
import { adminPointSchema } from '@/lib/validation/schemas';
import { sanitizeInput } from '@/lib/validation/sanitizer';
import { FieldValue } from 'firebase-admin/firestore';

type RouteContext = { params: Promise<{ id: string }> };

/**
 * PUT /api/admin/points/[id]?city=jf
 * Updates a point and increments _version
 */
export async function PUT(request: NextRequest, { params }: RouteContext) {
  const session = requireAdminSession(request);
  if (session instanceof NextResponse) return session;

  try {
    const { id } = await params;
    const citySlug = request.nextUrl.searchParams.get('city');

    if (!citySlug) {
      return NextResponse.json({ error: 'city query param is required' }, { status: 400 });
    }

    const city = getCityBySlug(citySlug);
    if (!city) {
      return NextResponse.json({ error: 'City not found' }, { status: 404 });
    }

    const body = await request.json();
    const validationResult = adminPointSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validationResult.error.issues },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    const updateData = {
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
      _version: FieldValue.increment(1),
      updatedAt: FieldValue.serverTimestamp(),
    };

    const db = getAdminFirestore();
    const docRef = db.collection(city.collectionName).doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return NextResponse.json({ error: 'Point not found' }, { status: 404 });
    }

    await docRef.update(updateData);

    return NextResponse.json({ success: true, message: 'Point updated successfully' });
  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }
    console.error('Error updating admin point:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * DELETE /api/admin/points/[id]?city=jf
 * Removes a point from Firestore
 */
export async function DELETE(request: NextRequest, { params }: RouteContext) {
  const session = requireAdminSession(request);
  if (session instanceof NextResponse) return session;

  try {
    const { id } = await params;
    const citySlug = request.nextUrl.searchParams.get('city');

    if (!citySlug) {
      return NextResponse.json({ error: 'city query param is required' }, { status: 400 });
    }

    const city = getCityBySlug(citySlug);
    if (!city) {
      return NextResponse.json({ error: 'City not found' }, { status: 404 });
    }

    const db = getAdminFirestore();
    const docRef = db.collection(city.collectionName).doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return NextResponse.json({ error: 'Point not found' }, { status: 404 });
    }

    await docRef.delete();

    return NextResponse.json({ success: true, message: 'Point deleted successfully' });
  } catch (error) {
    console.error('Error deleting admin point:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
