# Guia de Migração de Dados

Este guia explica como migrar os dados existentes de Juiz de Fora para a nova arquitetura multi-cidade.

## ⚠️ Pré-requisitos

Antes de executar a migração:

1. **Backup Manual (CRÍTICO)**
   - Acesse o [Firebase Console](https://console.firebase.google.com/)
   - Vá em Firestore Database
   - Exporte a coleção `pontos` manualmente (Settings > Import/Export)
   - Guarde o backup em local seguro

2. **Credenciais Firebase**
   - Service Account Key (recomendado para produção)
   - OU Project ID com Application Default Credentials

3. **Variáveis de Ambiente**
   ```bash
   # Opção 1: Service Account (mais seguro)
   export FIREBASE_SERVICE_ACCOUNT_KEY='{"type":"service_account",...}'

   # Opção 2: Project ID
   export NEXT_PUBLIC_FIREBASE_PROJECT_ID="seu-projeto-id"
   ```

## 📋 Ordem de Execução

### 1. Inicializar Coleção de Cidades

Cria a coleção `cities` com configuração de todas as cidades suportadas.

```bash
npm run migrate:cities
```

**O que faz:**
- Cria documentos em `cities` collection
- Um documento por cidade (jf, uba, matias-barbosa)
- Contém coordenadas, bounds, metadata, SEO
- Idempotente (seguro executar múltiplas vezes)

**Resultado esperado:**
```
✅ Created: Juiz de Fora (jf)
✅ Created: Ubá (uba)
✅ Created: Matias Barbosa (matias-barbosa)
```

---

### 2. Migrar Dados de Juiz de Fora

Migra todos os pontos da coleção `pontos` para `jf_pontos`.

```bash
npm run migrate:jf
```

**O que faz:**
- Lê todos os documentos de `pontos`
- Copia para `jf_pontos` mantendo os mesmos IDs
- Adiciona campos: `citySlug: 'jf'`, `_version: 1`, `_migratedAt`
- NÃO deleta a coleção original (mantém como backup)
- Pula documentos que já existem no destino
- Processa em batches de 500 (limite do Firestore)
- Gera relatório detalhado

**Resultado esperado:**
```
📖 Step 1: Reading documents from "pontos" collection...
   Found 150 documents

🔍 Step 2: Checking target collection "jf_pontos"...
   Target collection has 0 documents

🔄 Step 3: Migrating documents...
   ✅ Queued abc123 (coleta: Escola Municipal)
   ✅ Queued def456 (abrigo: Centro Comunitário)
   ...
   💾 Committing batch of 150 documents...
   ✅ Batch committed

✅ Step 4: Verifying migration...
   Target collection now has 150 documents

============================================================
📊 MIGRATION REPORT
============================================================
Status:           ✅ SUCCESS
Total documents:  150
Migrated:         150
Skipped:          0
Errors:           0
============================================================
```

---

### 3. Validar Migração

Verifica se a migração foi bem-sucedida comparando as coleções.

```bash
npm run migrate:validate
```

**O que faz:**
- Compara contagem de documentos (pontos vs jf_pontos)
- Spot-check em 10 documentos aleatórios
- Verifica campos críticos: tipo, nome, endereco, lat, lng
- Reporta discrepâncias

**Resultado esperado:**
```
🔍 Validating migration...

Old collection (pontos):     150 documents
New collection (jf_pontos):  150 documents

🔎 Spot-checking 10 random documents...

✅ abc123: coleta - Escola Municipal
✅ def456: abrigo - Centro Comunitário
...

✅ Validation passed! All checked documents match.
```

---

## 🚨 Troubleshooting

### Erro: "Missing Firebase credentials"

**Solução:**
```bash
# Carregue as variáveis de ambiente do .env.local
export $(cat .env.local | xargs)

# Ou defina manualmente
export NEXT_PUBLIC_FIREBASE_PROJECT_ID="seu-projeto"
```

### Erro: "Permission denied"

**Causa:** Firestore Security Rules bloqueando escrita

**Solução temporária:**
1. Acesse Firebase Console > Firestore > Rules
2. Adicione temporariamente (APENAS durante migração):
   ```javascript
   match /jf_pontos/{doc} {
     allow write: if true;  // ⚠️ REMOVER depois da migração
   }
   ```
3. Execute a migração
4. **IMPORTANTE:** Reverta para as regras de segurança corretas

### Documentos duplicados

Se executar a migração múltiplas vezes, documentos existentes serão pulados:

```
⏭️  Skipping abc123 (already exists)
```

Isso é esperado e seguro.

### Rollback (CUIDADO!)

Se precisar reverter a migração:

```bash
npm run migrate:rollback
```

Isso pedirá confirmação e então **DELETARÁ TODOS OS DOCUMENTOS** de `jf_pontos`.

A coleção original `pontos` permanece intacta.

---

## 📊 Logs e Relatórios

Após a migração, um relatório JSON é salvo em:

```
migrations/migration-report.json
```

Contém:
- Status (success/partial)
- Contagem de documentos
- Lista de erros (se houver)

---

## ✅ Checklist de Migração

- [ ] Backup manual da coleção `pontos` feito
- [ ] Variáveis de ambiente configuradas
- [ ] `npm run migrate:cities` executado com sucesso
- [ ] `npm run migrate:jf` executado com sucesso
- [ ] `npm run migrate:validate` passou sem erros
- [ ] Teste manual no app (ver pontos no mapa de JF)
- [ ] Firestore Rules de segurança aplicadas
- [ ] Coleção original `pontos` mantida como backup

---

## 🔐 Aplicar Security Rules

Após migração, configure as regras de segurança no Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Pontos das cidades (jf_pontos, uba_pontos, etc)
    match /{cityCollection}/{pointId} {
      allow read: if cityCollection.matches('.*_pontos$');
      allow create: if cityCollection.matches('.*_pontos$')
                    && isValidPoint();
      allow update, delete: if false;
    }

    // Config de cidades (read-only)
    match /cities/{cityId} {
      allow read: if true;
      allow write: if false;
    }
  }
}
```

---

## 📞 Suporte

Em caso de problemas durante a migração:

1. **NÃO ENTRE EM PÂNICO** - Os dados originais estão intactos
2. Verifique os logs no terminal
3. Consulte o arquivo `migration-report.json`
4. Se necessário, execute o rollback
5. Revise as variáveis de ambiente
6. Tente novamente

---

## 🎯 Próximos Passos

Após migração bem-sucedida:

1. Testar aplicação em staging
2. Verificar que pontos aparecem no mapa de JF
3. Testar cadastro de novos pontos
4. Aplicar Firestore Security Rules
5. Deploy para produção
6. Monitorar por 24h
7. (Opcional) Deletar coleção antiga `pontos` após 1 semana de estabilidade
