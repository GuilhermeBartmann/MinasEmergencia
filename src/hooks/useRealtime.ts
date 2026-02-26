'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
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

function mapDocToPoint(doc: DocumentData): Point {
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
}

/**
 * Hook for real-time Firestore updates with API fallback
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
  const prevCountRef = useRef(0);

  // Extract citySlug from collectionName (e.g., 'jf_pontos' -> 'jf')
  const citySlug = collectionName.replace('_pontos', '');

  // API fallback
  const fetchFromAPI = useCallback(async () => {
    try {
      const res = await fetch(`/api/points?city=${citySlug}`);
      const data = await res.json();
      if (data.success && data.points) {
        setPoints(data.points);
        prevCountRef.current = data.points.length;
      }
    } catch {
      setError('Erro ao carregar pontos. Recarregue a página.');
    } finally {
      setLoading(false);
    }
  }, [citySlug]);

  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    // Timeout: if Firestore doesn't respond in 8s, fall back to API
    const timeout = setTimeout(() => {
      console.warn('Firestore timeout, falling back to API');
      fetchFromAPI();
    }, 8000);

    const pointsRef = collection(db, collectionName);
    const q = query(
      pointsRef,
      orderBy('timestamp', 'desc'),
      limit(limitCount)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot: QuerySnapshot<DocumentData>) => {
        clearTimeout(timeout);
        const updatedPoints: Point[] = snapshot.docs.map(mapDocToPoint);

        if (prevCountRef.current > 0 && updatedPoints.length > prevCountRef.current) {
          const newCount = updatedPoints.length - prevCountRef.current;
          setNewPointsCount(prev => prev + newCount);
        }
        prevCountRef.current = updatedPoints.length;

        setPoints(updatedPoints);
        setLoading(false);
      },
      (err) => {
        clearTimeout(timeout);
        console.error('Firestore listener error:', err);
        // Fall back to API instead of showing error
        fetchFromAPI();
      }
    );

    return () => {
      clearTimeout(timeout);
      unsubscribe();
    };
  }, [collectionName, limitCount, enabled, fetchFromAPI]);

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
