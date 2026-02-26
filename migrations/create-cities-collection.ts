/**
 * Script to initialize the "cities" collection in Firestore
 *
 * Creates configuration documents for all supported cities.
 * Safe to run multiple times (idempotent).
 *
 * Usage:
 *   npx ts-node migrations/create-cities-collection.ts
 */

import * as admin from 'firebase-admin';
import { CITIES } from '../src/config/cities';

// Initialize Firebase Admin
function initializeFirebase() {
  if (admin.apps.length === 0) {
    const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

    if (serviceAccountKey) {
      const serviceAccount = JSON.parse(serviceAccountKey);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    } else {
      const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
      if (!projectId) {
        throw new Error('Missing Firebase credentials');
      }
      admin.initializeApp({
        projectId,
      });
    }
  }
  return admin.firestore();
}

async function createCitiesCollection() {
  console.log('🏙️  Initializing cities collection...\n');

  const db = initializeFirebase();
  const citiesRef = db.collection('cities');

  let created = 0;
  let updated = 0;
  let skipped = 0;

  for (const city of CITIES) {
    const docRef = citiesRef.doc(city.slug);
    const doc = await docRef.get();

    const cityData = {
      name: city.name,
      slug: city.slug,
      state: city.state,
      coordinates: city.coordinates,
      bounds: city.bounds,
      enabled: city.enabled,
      collectionName: city.collectionName,
      metadata: city.metadata,
      seo: city.seo,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    if (!doc.exists) {
      await docRef.set({
        ...cityData,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      console.log(`✅ Created: ${city.name} (${city.slug})`);
      created++;
    } else {
      await docRef.update(cityData);
      console.log(`🔄 Updated: ${city.name} (${city.slug})`);
      updated++;
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('📊 CITIES COLLECTION INITIALIZED');
  console.log('='.repeat(60));
  console.log(`Created:  ${created}`);
  console.log(`Updated:  ${updated}`);
  console.log(`Skipped:  ${skipped}`);
  console.log(`Total:    ${CITIES.length}`);
  console.log('='.repeat(60) + '\n');
}

// Run
if (require.main === module) {
  createCitiesCollection()
    .then(() => {
      console.log('✅ Done!\n');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Error:', error);
      process.exit(1);
    });
}

export { createCitiesCollection };
