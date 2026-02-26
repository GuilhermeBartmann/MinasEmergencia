import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  limit,
  Timestamp,
  serverTimestamp
} from 'firebase/firestore';
import { db } from './config';
import { Point } from '@/types/point';

/**
 * Get all points for a city (client-side)
 */
export async function getPoints(collectionName: string, limitCount = 500): Promise<Point[]> {
  try {
    const pointsRef = collection(db, collectionName);
    const q = query(
      pointsRef,
      orderBy('timestamp', 'desc'),
      limit(limitCount)
    );

    const snapshot = await getDocs(q);

    const points: Point[] = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        tipo: data.tipo,
        nome: data.nome,
        endereco: data.endereco,
        complemento: data.complemento,
        horarios: data.horarios,
        doacoes: data.doacoes,
        responsavel: data.responsavel,
        telefone: data.telefone,
        capacidade: data.capacidade,
        lat: data.lat,
        lng: data.lng,
        timestamp: data.timestamp,
        citySlug: data.citySlug,
        _version: data._version,
      } as Point;
    });

    return points;
  } catch (error) {
    console.error('Error getting points:', error);
    throw new Error('Failed to fetch points');
  }
}

/**
 * Add a new point (client-side - will call API instead)
 */
export async function addPoint(collectionName: string, pointData: Omit<Point, 'id' | 'timestamp'>) {
  try {
    const pointsRef = collection(db, collectionName);

    const docRef = await addDoc(pointsRef, {
      ...pointData,
      timestamp: serverTimestamp(),
    });

    return docRef.id;
  } catch (error) {
    console.error('Error adding point:', error);
    throw new Error('Failed to add point');
  }
}
