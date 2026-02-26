/**
 * Migration Script: pontos → jf_pontos
 *
 * Migrates all existing Juiz de Fora data from the old "pontos" collection
 * to the new multi-city architecture using "jf_pontos" collection.
 *
 * ⚠️ IMPORTANT: Run this in a Node.js environment with Firebase Admin SDK
 *
 * Usage:
 *   npx ts-node migrations/migrate-jf-data.ts
 */

import * as admin from 'firebase-admin';
import * as fs from 'fs';
import * as path from 'path';

// Initialize Firebase Admin
function initializeFirebase() {
  if (admin.apps.length === 0) {
    // Try to load service account from environment
    const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

    if (serviceAccountKey) {
      const serviceAccount = JSON.parse(serviceAccountKey);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    } else {
      // Fallback to project ID (uses Application Default Credentials)
      const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
      if (!projectId) {
        throw new Error('Missing Firebase credentials. Set FIREBASE_SERVICE_ACCOUNT_KEY or NEXT_PUBLIC_FIREBASE_PROJECT_ID');
      }
      admin.initializeApp({
        projectId,
      });
    }
  }
  return admin.firestore();
}

interface OldPoint {
  tipo: 'coleta' | 'abrigo';
  nome: string;
  endereco: string;
  complemento?: string;
  horarios?: string;
  doacoes: string[];
  responsavel?: string;
  telefone?: string;
  capacidade?: number;
  lat: number;
  lng: number;
  timestamp: admin.firestore.Timestamp;
}

interface MigrationResult {
  success: boolean;
  totalDocs: number;
  migrated: number;
  skipped: number;
  errors: Array<{ id: string; error: string }>;
}

/**
 * Main migration function
 */
async function migrateData(): Promise<MigrationResult> {
  console.log('🚀 Starting migration: pontos → jf_pontos\n');

  const db = initializeFirebase();
  const result: MigrationResult = {
    success: false,
    totalDocs: 0,
    migrated: 0,
    skipped: 0,
    errors: [],
  };

  try {
    // Step 1: Read all documents from old collection
    console.log('📖 Step 1: Reading documents from "pontos" collection...');
    const oldCollectionRef = db.collection('pontos');
    const snapshot = await oldCollectionRef.get();
    result.totalDocs = snapshot.size;
    console.log(`   Found ${result.totalDocs} documents\n`);

    if (result.totalDocs === 0) {
      console.log('⚠️  No documents to migrate. Exiting.');
      return result;
    }

    // Step 2: Check if target collection already has data
    console.log('🔍 Step 2: Checking target collection "jf_pontos"...');
    const newCollectionRef = db.collection('jf_pontos');
    const existingSnapshot = await newCollectionRef.get();
    console.log(`   Target collection has ${existingSnapshot.size} documents\n`);

    // Step 3: Migrate documents in batches
    console.log('🔄 Step 3: Migrating documents...\n');
    const batchSize = 500; // Firestore limit
    let batch = db.batch();
    let batchCount = 0;

    for (const doc of snapshot.docs) {
      try {
        const oldData = doc.data() as OldPoint;
        const docId = doc.id;

        // Check if document already exists in target collection
        const targetDocRef = newCollectionRef.doc(docId);
        const targetDoc = await targetDocRef.get();

        if (targetDoc.exists) {
          console.log(`   ⏭️  Skipping ${docId} (already exists)`);
          result.skipped++;
          continue;
        }

        // Prepare new document with additional fields
        const newData = {
          ...oldData,
          citySlug: 'jf',
          _version: 1,
          _migratedAt: admin.firestore.FieldValue.serverTimestamp(),
        };

        // Add to batch
        batch.set(targetDocRef, newData);
        batchCount++;

        console.log(`   ✅ Queued ${docId} (${oldData.tipo}: ${oldData.nome})`);

        // Commit batch if we reach the limit
        if (batchCount === batchSize) {
          console.log(`\n   💾 Committing batch of ${batchCount} documents...`);
          await batch.commit();
          result.migrated += batchCount;
          batch = db.batch();
          batchCount = 0;
          console.log(`   ✅ Batch committed\n`);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error(`   ❌ Error migrating ${doc.id}: ${errorMessage}`);
        result.errors.push({ id: doc.id, error: errorMessage });
      }
    }

    // Commit remaining documents
    if (batchCount > 0) {
      console.log(`\n   💾 Committing final batch of ${batchCount} documents...`);
      await batch.commit();
      result.migrated += batchCount;
      console.log(`   ✅ Final batch committed\n`);
    }

    // Step 4: Verify migration
    console.log('✅ Step 4: Verifying migration...');
    const finalSnapshot = await newCollectionRef.get();
    console.log(`   Target collection now has ${finalSnapshot.size} documents\n`);

    result.success = result.errors.length === 0;

    // Generate report
    console.log('\n' + '='.repeat(60));
    console.log('📊 MIGRATION REPORT');
    console.log('='.repeat(60));
    console.log(`Status:           ${result.success ? '✅ SUCCESS' : '⚠️  PARTIAL'}`);
    console.log(`Total documents:  ${result.totalDocs}`);
    console.log(`Migrated:         ${result.migrated}`);
    console.log(`Skipped:          ${result.skipped}`);
    console.log(`Errors:           ${result.errors.length}`);
    console.log('='.repeat(60) + '\n');

    if (result.errors.length > 0) {
      console.log('❌ Errors:');
      result.errors.forEach(({ id, error }) => {
        console.log(`   - ${id}: ${error}`);
      });
      console.log();
    }

    // Save report to file
    const reportPath = path.join(__dirname, 'migration-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(result, null, 2));
    console.log(`📄 Full report saved to: ${reportPath}\n`);

    return result;
  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    throw error;
  }
}

/**
 * Validation function - compares old and new collections
 */
async function validateMigration(): Promise<boolean> {
  console.log('🔍 Validating migration...\n');

  const db = admin.firestore();

  // Get counts
  const oldSnapshot = await db.collection('pontos').get();
  const newSnapshot = await db.collection('jf_pontos').get();

  console.log(`Old collection (pontos):     ${oldSnapshot.size} documents`);
  console.log(`New collection (jf_pontos):  ${newSnapshot.size} documents\n`);

  if (oldSnapshot.size !== newSnapshot.size) {
    console.log('⚠️  Document counts do not match!');
    return false;
  }

  // Spot check 10 random documents
  console.log('🔎 Spot-checking 10 random documents...\n');
  const randomDocs = oldSnapshot.docs
    .sort(() => Math.random() - 0.5)
    .slice(0, 10);

  let allMatch = true;

  for (const oldDoc of randomDocs) {
    const newDoc = await db.collection('jf_pontos').doc(oldDoc.id).get();

    if (!newDoc.exists) {
      console.log(`❌ Document ${oldDoc.id} not found in new collection`);
      allMatch = false;
      continue;
    }

    const oldData = oldDoc.data();
    const newData = newDoc.data();

    // Check critical fields
    const criticalFields = ['tipo', 'nome', 'endereco', 'lat', 'lng'];
    const fieldsMatch = criticalFields.every(field => {
      const match = oldData?.[field] === newData?.[field];
      if (!match) {
        console.log(`❌ Field mismatch in ${oldDoc.id}.${field}: ${oldData?.[field]} !== ${newData?.[field]}`);
      }
      return match;
    });

    if (fieldsMatch) {
      console.log(`✅ ${oldDoc.id}: ${oldData?.tipo} - ${oldData?.nome}`);
    } else {
      allMatch = false;
    }
  }

  console.log();
  if (allMatch) {
    console.log('✅ Validation passed! All checked documents match.\n');
  } else {
    console.log('❌ Validation failed! Some documents do not match.\n');
  }

  return allMatch;
}

/**
 * Rollback function - deletes all migrated documents
 * ⚠️ USE WITH CAUTION
 */
async function rollback(): Promise<void> {
  console.log('⚠️  ROLLBACK: Deleting all documents from jf_pontos...\n');

  const db = admin.firestore();
  const collectionRef = db.collection('jf_pontos');
  const snapshot = await collectionRef.get();

  console.log(`Found ${snapshot.size} documents to delete\n`);

  const batchSize = 500;
  let batch = db.batch();
  let count = 0;

  for (const doc of snapshot.docs) {
    batch.delete(doc.ref);
    count++;

    if (count === batchSize) {
      await batch.commit();
      console.log(`Deleted ${count} documents...`);
      batch = db.batch();
      count = 0;
    }
  }

  if (count > 0) {
    await batch.commit();
    console.log(`Deleted ${count} documents...`);
  }

  console.log('\n✅ Rollback complete\n');
}

// CLI interface
async function main() {
  const command = process.argv[2];

  try {
    switch (command) {
      case 'migrate':
        await migrateData();
        break;
      case 'validate':
        await validateMigration();
        break;
      case 'rollback':
        console.log('⚠️  Are you sure you want to rollback? This will delete all data from jf_pontos!');
        console.log('   To confirm, run: npx ts-node migrations/migrate-jf-data.ts rollback-confirm\n');
        break;
      case 'rollback-confirm':
        await rollback();
        break;
      default:
        console.log('Usage:');
        console.log('  npx ts-node migrations/migrate-jf-data.ts migrate    - Run migration');
        console.log('  npx ts-node migrations/migrate-jf-data.ts validate   - Validate migration');
        console.log('  npx ts-node migrations/migrate-jf-data.ts rollback   - Rollback migration (with confirmation)');
        process.exit(1);
    }

    process.exit(0);
  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

export { migrateData, validateMigration, rollback };
