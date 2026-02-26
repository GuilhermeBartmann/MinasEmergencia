'use client';

import { useState, useEffect } from 'react';
import {
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
  QuerySnapshot,
  DocumentData
} from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { Point } from '@/types/point';

export interface UseRealtimeOptions {
  limitCount?: number;
  enabled?: boolean;
}

/**
 * Hook for real-time Firestore updates
 * Subscribes to a collection and updates when documents change
 */
export function useRealtime(
  collectionName: string,
  initialPoints: Point[] = [],
  options: UseRealtimeOptions = {}
) {
  const {
    limitCount = 500,
    enabled = true,
  } = options;

  const [points, setPoints] = useState<Point[]>(initialPoints);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newPointsCount, setNewPointsCount] = useState(0);

  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    // Create Firestore query
    const pointsRef = collection(db, collectionName);
    const q = query(
      pointsRef,
      orderBy('timestamp', 'desc'),
      limit(limitCount)
    );

    // Subscribe to real-time updates
    const unsubscribe = onSnapshot(
      q,
      (snapshot: QuerySnapshot<DocumentData>) => {
        // Map documents to points
        const updatedPoints: Point[] = snapshot.docs.map(doc => {
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

        // Detect new points (if we already have points loaded)
        if (points.length > 0 && updatedPoints.length > points.length) {
          const newCount = updatedPoints.length - points.length;
          setNewPointsCount(prev => prev + newCount);
        }

        setPoints(updatedPoints);
        setLoading(false);
      },
      (err) => {
        console.error('Firestore listener error:', err);
        setError('Erro ao conectar com o servidor. Recarregue a página.');
        setLoading(false);
      }
    );

    // Cleanup listener on unmount
    return () => {
      unsubscribe();
    };
  }, [collectionName, limitCount, enabled, points.length]);

  // Reset new points counter
  const resetNewPointsCount = () => {
    setNewPointsCount(0);
  };

  return {
    points,
    loading,
    error,
    newPointsCount,
    resetNewPointsCount,
  };
}
