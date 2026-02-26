import { getApps, initializeApp, cert, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';

let app: App | undefined;
let firestore: Firestore | undefined;

/**
 * Initialize Firebase Admin SDK (server-side only)
 */
export function getFirebaseAdmin() {
  if (!app) {
    // Check if already initialized
    const existingApps = getApps();

    if (existingApps.length > 0) {
      app = existingApps[0];
    } else {
      // Initialize with service account
      const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

      if (!serviceAccount) {
        // Fallback: Use project ID only (for dev without service account)
        console.warn('⚠️  FIREBASE_SERVICE_ACCOUNT_KEY not found. Using project ID only.');

        const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

        if (!projectId) {
          throw new Error('Firebase configuration missing. Set NEXT_PUBLIC_FIREBASE_PROJECT_ID or FIREBASE_SERVICE_ACCOUNT_KEY.');
        }

        app = initializeApp({
          projectId,
        });
      } else {
        // Parse service account JSON
        let serviceAccountJson;
        try {
          serviceAccountJson = JSON.parse(serviceAccount);
        } catch (error) {
          throw new Error('Invalid FIREBASE_SERVICE_ACCOUNT_KEY JSON');
        }

        app = initializeApp({
          credential: cert(serviceAccountJson),
        });
      }
    }
  }

  if (!firestore) {
    firestore = getFirestore(app);
  }

  return { app, firestore };
}

/**
 * Get Firestore instance (server-side)
 */
export function getAdminFirestore(): Firestore {
  const { firestore } = getFirebaseAdmin();
  return firestore;
}
