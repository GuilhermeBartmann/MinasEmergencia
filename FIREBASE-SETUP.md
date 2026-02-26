# Configuração do Firebase - Emergência Coletas

## ⚠️ ERRO: Missing or insufficient permissions

Se você está recebendo este erro, é porque as Security Rules do Firestore precisam ser configuradas.

## 📋 Passo a Passo

### 1. Acessar Firebase Console

1. Acesse: https://console.firebase.google.com/
2. Selecione seu projeto: **emergenciajf-a30c5**
3. Menu lateral > **Firestore Database**

### 2. Configurar Security Rules

1. Na aba **Rules** (no topo)
2. **APAGUE** tudo que está lá
3. **COLE** o código abaixo:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // ==========================================
    // PONTOS DAS CIDADES (jf_pontos, uba_pontos, etc)
    // ==========================================
    match /{cityCollection}/{pointId} {
      // Permitir LEITURA de qualquer coleção que termina com "_pontos"
      allow read: if cityCollection.matches('.*_pontos$');

      // Permitir CRIAÇÃO de novos pontos (apenas)
      allow create: if cityCollection.matches('.*_pontos$')
                    && request.resource.data.keys().hasAll([
                      'tipo', 'nome', 'endereco', 'doacoes',
                      'lat', 'lng', 'timestamp', 'citySlug', '_version'
                    ])
                    && request.resource.data.tipo in ['coleta', 'abrigo']
                    && request.resource.data._version == 1;

      // BLOQUEAR atualização e exclusão (por segurança)
      allow update, delete: if false;
    }

    // ==========================================
    // COLEÇÃO "CITIES" (Read-Only)
    // ==========================================
    match /cities/{cityId} {
      allow read: if true;
      allow write: if false;
    }

    // ==========================================
    // COLEÇÃO ANTIGA "PONTOS" (Read-Only para migração)
    // ==========================================
    match /pontos/{pointId} {
      allow read: if true;
      allow write: if false;
    }
  }
}
```

4. Clique em **Publish** (botão azul no topo direito)

### 3. Verificar Publicação

Você deve ver: ✅ **Rules published successfully**

---

## 🧪 Testar Permissões

### Teste de Leitura

1. No seu app, acesse: http://localhost:3000/jf
2. Você deve ver o mapa carregando
3. Se houver pontos, eles aparecem no mapa
4. **Console do navegador** (F12) não deve mostrar erros

### Teste de Escrita

1. Clique no botão **+** (FAB) ou "Cadastrar"
2. Preencha o formulário
3. Clique em "Cadastrar Ponto"
4. Você deve ver mensagem de sucesso
5. Novo ponto aparece no mapa automaticamente

---

## 🔒 O que essas Rules fazem?

### ✅ Permitem:
- **Leitura** de qualquer coleção `*_pontos` (jf_pontos, uba_pontos, etc)
- **Criação** de novos pontos (mas valida campos obrigatórios)
- **Leitura** da coleção `cities`
- **Leitura** da coleção antiga `pontos` (para migração)

### ❌ Bloqueiam:
- **Atualização** de pontos existentes (evita vandalismo)
- **Exclusão** de pontos (dados permanecem)
- **Escrita** na coleção `cities`
- **Escrita** na coleção antiga `pontos`

---

## ⚡ Regras Temporárias (APENAS PARA TESTE)

**⚠️ NÃO USE EM PRODUÇÃO!**

Se você quer testar rapidamente sem validação:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

**IMPORTANTE:** Após testar, volte para as regras de segurança acima!

---

## 🐛 Ainda com erro?

### Problema 1: "Permission denied" mesmo após publicar

**Solução:**
1. Aguarde 30-60 segundos (propagação das rules)
2. Recarregue a página (Ctrl+Shift+R)
3. Limpe cache do navegador

### Problema 2: "Firebase App has been deleted"

**Solução:**
1. Verifique se `.env.local` está configurado
2. Recarregue variáveis: `npm run dev` novamente

### Problema 3: Erro ao criar ponto

**Console mostra:** `Missing required field: XYZ`

**Solução:**
1. Verifique se todos os campos estão sendo enviados
2. Console do navegador > Network > POST `/api/points` > Preview
3. Ver qual campo está faltando

---

## 📊 Verificar Dados no Firestore

### Ver pontos cadastrados:

1. Firebase Console > Firestore Database
2. Navegue até: `jf_pontos` (para Juiz de Fora)
3. Você verá a lista de documentos
4. Clique em um documento para ver os campos

### Estrutura esperada:

```
jf_pontos/
  └── [ID_AUTO_GERADO]/
      ├── tipo: "coleta"
      ├── nome: "Escola Municipal São José"
      ├── endereco: "Rua das Flores, 123"
      ├── doacoes: ["roupas", "alimentos"]
      ├── lat: -21.7642
      ├── lng: -43.3502
      ├── timestamp: [ServerTimestamp]
      ├── citySlug: "jf"
      └── _version: 1
```

---

## ✅ Checklist Final

- [ ] Security Rules publicadas
- [ ] App carrega sem erros (F12 > Console)
- [ ] Mapa aparece com pontos (se houver)
- [ ] Consegue cadastrar novo ponto
- [ ] Novo ponto aparece no mapa automaticamente
- [ ] Offline indicator funciona (desligar WiFi)
- [ ] Install prompt aparece após 10s (mobile)

---

## 📞 Suporte

Se ainda tiver problemas:

1. **Console do navegador (F12):** Print screen do erro
2. **Firebase Console > Rules:** Verificar se foram aplicadas
3. **Network tab:** Ver se request para Firestore está 403/401

**Logs importantes:**
- `FirebaseError: Missing or insufficient permissions` = Rules não aplicadas
- `FirebaseError: PERMISSION_DENIED` = Rules incorretas
- `FirebaseError: NOT_FOUND` = Coleção não existe

---

✅ **Após configurar, seu app estará 100% funcional!**
