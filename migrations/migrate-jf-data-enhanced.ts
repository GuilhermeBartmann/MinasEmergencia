/**
 * Enhanced Migration Script: pontos → jf_pontos
 *
 * Migrates all existing Juiz de Fora data from the old "pontos" collection
 * to the new multi-city architecture using "jf_pontos" collection.
 *
 * Enhanced features:
 * - Zod schema validation during migration
 * - Preview/dry-run mode
 * - Coordinate bounds validation
 * - Detailed error reporting
 *
 * Usage:
 *   npx ts-node migrations/migrate-jf-data-enhanced.ts preview   - Preview migration
 *   npx ts-node migrations/migrate-jf-data-enhanced.ts migrate   - Execute migration
 */

// Load environment variables from .env.local
import * as path from 'path';
import * as dotenv from 'dotenv';
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

import * as admin from 'firebase-admin';
import * as fs from 'fs';
import { z } from 'zod';

// Import validation schema from src (we'll create a migration-specific version)
// Note: We need to omit the 'consent' field which is only for form submission
const DONATION_TYPES = ['Roupas', 'Alimentos', 'Água', 'Higiene', 'Medicamentos', 'Outros'];

// Migration-specific schema (without consent field)
const migrationPointSchema = z.object({
  tipo: z.enum(['coleta', 'abrigo']),
  nome: z.string().min(3).max(100).trim(),
  endereco: z.string().min(10).max(200).trim().optional().or(z.literal('')),
  complemento: z.string().max(200).trim().optional().or(z.literal('')),
  horarios: z.string().max(100).trim().optional().or(z.literal('')),
  doacoes: z.array(z.string()).min(1).max(6),
  responsavel: z.string().max(100).regex(/^[a-zA-ZÀ-ÿ\s]*$/).trim().optional().or(z.literal('')),
  telefone: z.string().regex(/^\(\d{2}\)\s\d{4,5}-\d{4}$/).optional().or(z.literal('')),
  capacidade: z.number().int().positive().optional().nullable(),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
}).refine(
  (data) => {
    // If tipo is abrigo, capacidade should be present (but we'll be lenient in migration)
    return true;
  }
);

// Juiz de Fora bounds
const JF_BOUNDS = {
  lat: { min: -21.82, max: -21.68 },
  lng: { min: -43.42, max: -43.28 }
};

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

interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

interface DetailedError {
  id: string;
  nome: string;
  tipo: string;
  error: string;
  fieldErrors?: string[];
}

interface MigrationResult {
  success: boolean;
  totalDocs: number;
  migrated: number;
  skipped: number;
  invalid: number;
  errors: DetailedError[];
  warnings: Array<{ id: string; issues: string[] }>;
}

interface PreviewResult {
  totalDocs: number;
  validDocs: number;
  invalidDocs: number;
  existingDocs: number;
  toMigrate: number;
  warnings: Array<{ id: string; issues: string[] }>;
  errors: DetailedError[];
}

/**
 * Validate a point document with Zod schema
 */
function validatePoint(data: any): ValidationResult {
  const result = migrationPointSchema.safeParse(data);
  const warnings: string[] = [];

  if (!result.success) {
    return {
      valid: false,
      errors: result.error.issues.map(i => `${i.path.join('.')}: ${i.message}`),
      warnings: []
    };
  }

  // Additional warnings (non-blocking)
  if (!data.telefone && !data.responsavel) {
    warnings.push('Missing contact info (telefone and responsavel)');
  }

  if (data.tipo === 'abrigo' && !data.capacidade) {
    warnings.push('Abrigo without capacidade specified');
  }

  return { valid: true, errors: [], warnings };
}

/**
 * Validate coordinates are within Juiz de Fora bounds
 */
function validateCoordinates(lat: number, lng: number): boolean {
  if (lat < JF_BOUNDS.lat.min || lat > JF_BOUNDS.lat.max) return false;
  if (lng < JF_BOUNDS.lng.min || lng > JF_BOUNDS.lng.max) return false;
  return true;
}

/**
 * Preview migration (dry-run mode)
 */
async function previewMigration(): Promise<PreviewResult> {
  console.log('📊 PREVIEW MODE - Nenhum dado será modificado\n');

  const db = initializeFirebase();

  // Read collections
  console.log('📖 Reading collections...');
  const oldSnapshot = await db.collection('pontos').get();
  const newSnapshot = await db.collection('jf_pontos').get();

  const result: PreviewResult = {
    totalDocs: oldSnapshot.size,
    validDocs: 0,
    invalidDocs: 0,
    existingDocs: newSnapshot.size,
    toMigrate: 0,
    warnings: [],
    errors: []
  };

  console.log(`   Old collection (pontos): ${oldSnapshot.size} documents`);
  console.log(`   New collection (jf_pontos): ${newSnapshot.size} documents\n`);

  // Analyze each document
  console.log('🔍 Analyzing documents...\n');

  for (const doc of oldSnapshot.docs) {
    const data = doc.data();
    const docId = doc.id;

    // Check if already exists in target
    const targetDoc = await db.collection('jf_pontos').doc(docId).get();
    if (targetDoc.exists) {
      result.validDocs++;
      continue; // Will be skipped in migration
    }

    // Validate with Zod
    const validation = validatePoint(data);

    if (!validation.valid) {
      result.invalidDocs++;
      result.errors.push({
        id: docId,
        nome: data.nome || 'Sem nome',
        tipo: data.tipo || 'Indefinido',
        error: 'Validação falhou',
        fieldErrors: validation.errors
      });
      continue;
    }

    result.validDocs++;

    // Check coordinates bounds (warning only)
    if (!validateCoordinates(data.lat, data.lng)) {
      result.warnings.push({
        id: docId,
        issues: [
          `Coordenadas fora dos limites de JF: (${data.lat.toFixed(4)}, ${data.lng.toFixed(4)})`,
          `Nome: ${data.nome}`,
          `Endereço: ${data.endereco || 'N/A'}`
        ]
      });
    }

    // Add validation warnings
    if (validation.warnings.length > 0) {
      const existingWarning = result.warnings.find(w => w.id === docId);
      if (existingWarning) {
        existingWarning.issues.push(...validation.warnings);
      } else {
        result.warnings.push({
          id: docId,
          issues: validation.warnings
        });
      }
    }
  }

  result.toMigrate = result.validDocs - result.existingDocs;

  // Print summary
  console.log('='.repeat(70));
  console.log('📊 PREVIEW SUMMARY');
  console.log('='.repeat(70));
  console.log(`Total de documentos:          ${result.totalDocs}`);
  console.log(`Válidos:                      ${result.validDocs}`);
  console.log(`Inválidos:                    ${result.invalidDocs}`);
  console.log(`Já existem em jf_pontos:      ${result.existingDocs}`);
  console.log(`Serão migrados:               ${result.toMigrate}`);
  console.log(`Avisos:                       ${result.warnings.length}`);
  console.log('='.repeat(70) + '\n');

  // Print errors
  if (result.errors.length > 0) {
    console.log('❌ DOCUMENTOS INVÁLIDOS (não serão migrados):\n');
    result.errors.slice(0, 10).forEach(err => {
      console.log(`   ${err.id} - ${err.tipo}: ${err.nome}`);
      if (err.fieldErrors) {
        err.fieldErrors.forEach(fe => console.log(`      • ${fe}`));
      }
    });

    if (result.errors.length > 10) {
      console.log(`\n   ... e mais ${result.errors.length - 10} erros`);
    }
    console.log();
  }

  // Print warnings
  if (result.warnings.length > 0) {
    console.log('⚠️  AVISOS (serão migrados mas podem precisar de atenção):\n');
    result.warnings.slice(0, 10).forEach(w => {
      console.log(`   ${w.id}:`);
      w.issues.forEach(i => console.log(`      • ${i}`));
    });

    if (result.warnings.length > 10) {
      console.log(`\n   ... e mais ${result.warnings.length - 10} avisos`);
    }
    console.log();
  }

  if (result.toMigrate > 0) {
    console.log('✅ Pronto para migrar! Execute: npm run migrate:execute\n');
  } else if (result.existingDocs === result.validDocs) {
    console.log('ℹ️  Todos os documentos válidos já foram migrados.\n');
  } else {
    console.log('⚠️  Nenhum documento válido encontrado para migração.\n');
  }

  return result;
}

/**
 * Main migration function (enhanced version)
 */
async function migrateData(): Promise<MigrationResult> {
  console.log('🚀 Starting enhanced migration: pontos → jf_pontos\n');

  const db = initializeFirebase();
  const result: MigrationResult = {
    success: false,
    totalDocs: 0,
    migrated: 0,
    skipped: 0,
    invalid: 0,
    errors: [],
    warnings: []
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
    console.log('🔄 Step 3: Migrating documents with validation...\n');
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

        // Validate with Zod
        const validation = validatePoint(oldData);

        if (!validation.valid) {
          console.log(`   ❌ Invalid ${docId}: ${oldData.nome || 'Sem nome'}`);
          validation.errors.forEach(e => console.log(`      • ${e}`));
          result.invalid++;
          result.errors.push({
            id: docId,
            nome: oldData.nome || 'Sem nome',
            tipo: oldData.tipo || 'Indefinido',
            error: 'Validação falhou',
            fieldErrors: validation.errors
          });
          continue;
        }

        // Log warnings but continue
        if (validation.warnings.length > 0 || !validateCoordinates(oldData.lat, oldData.lng)) {
          const warnings: string[] = [...validation.warnings];
          if (!validateCoordinates(oldData.lat, oldData.lng)) {
            warnings.push(`Coordenadas fora dos limites de JF: (${oldData.lat}, ${oldData.lng})`);
          }
          result.warnings.push({
            id: docId,
            issues: warnings
          });
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
        result.errors.push({
          id: doc.id,
          nome: doc.data().nome || 'Sem nome',
          tipo: doc.data().tipo || 'Indefinido',
          error: errorMessage
        });
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
    console.log('\n' + '='.repeat(70));
    console.log('📊 MIGRATION REPORT');
    console.log('='.repeat(70));
    console.log(`Status:           ${result.success ? '✅ SUCCESS' : '⚠️  PARTIAL'}`);
    console.log(`Total documents:  ${result.totalDocs}`);
    console.log(`Migrated:         ${result.migrated}`);
    console.log(`Skipped:          ${result.skipped} (already existed)`);
    console.log(`Invalid:          ${result.invalid} (validation failed)`);
    console.log(`Errors:           ${result.errors.length}`);
    console.log(`Warnings:         ${result.warnings.length}`);
    console.log('='.repeat(70) + '\n');

    if (result.errors.length > 0) {
      console.log('❌ Errors:\n');
      result.errors.forEach(({ id, nome, tipo, error, fieldErrors }) => {
        console.log(`   ${id} - ${tipo}: ${nome}`);
        console.log(`      Error: ${error}`);
        if (fieldErrors) {
          fieldErrors.forEach(fe => console.log(`      • ${fe}`));
        }
      });
      console.log();
    }

    if (result.warnings.length > 0) {
      console.log('⚠️  Warnings:\n');
      result.warnings.slice(0, 10).forEach(({ id, issues }) => {
        console.log(`   ${id}:`);
        issues.forEach(i => console.log(`      • ${i}`));
      });
      if (result.warnings.length > 10) {
        console.log(`   ... e mais ${result.warnings.length - 10} avisos`);
      }
      console.log();
    }

    // Save detailed report to file
    const reportPath = path.join(__dirname, 'migration-report-enhanced.json');
    const detailedReport = {
      timestamp: new Date().toISOString(),
      summary: {
        status: result.success ? 'SUCCESS' : 'PARTIAL',
        totalDocs: result.totalDocs,
        migrated: result.migrated,
        skipped: result.skipped,
        invalid: result.invalid,
        errorsCount: result.errors.length,
        warningsCount: result.warnings.length
      },
      errors: result.errors,
      warnings: result.warnings
    };
    fs.writeFileSync(reportPath, JSON.stringify(detailedReport, null, 2));
    console.log(`📄 Full report saved to: ${reportPath}\n`);

    return result;
  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    throw error;
  }
}

// CLI interface
async function main() {
  const command = process.argv[2];

  try {
    switch (command) {
      case 'preview':
        await previewMigration();
        break;
      case 'migrate':
        await migrateData();
        break;
      default:
        console.log('Enhanced Migration Script - Usage:\n');
        console.log('  npx ts-node migrations/migrate-jf-data-enhanced.ts preview   - Preview migration (dry-run)');
        console.log('  npx ts-node migrations/migrate-jf-data-enhanced.ts migrate   - Execute migration');
        console.log('\nOther commands (use original script):');
        console.log('  npm run migrate:validate   - Validate migration results');
        console.log('  npm run migrate:rollback   - Rollback migration (with confirmation)');
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

export { migrateData, previewMigration };
