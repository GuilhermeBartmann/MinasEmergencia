# ✅ Checklist Pré-Migração

Use este checklist antes de executar a migração em produção.

## 🔐 Segurança

- [ ] **Backup manual criado**
  - Acessar Firebase Console → Firestore → Settings → Import/Export
  - Exportar coleção `pontos` para Cloud Storage
  - Download local do backup
  - Verificar integridade do arquivo

- [ ] **Credenciais configuradas**
  - Service Account Key OU Project ID definido
  - Arquivo `.env.local` configurado
  - Testar conexão com Firestore

- [ ] **Ambiente de teste disponível**
  - Projeto Firebase de staging criado (opcional mas recomendado)
  - Testar migração em staging primeiro

## 📊 Verificação de Dados

- [ ] **Coleção origem verificada**
  - Acessar Firebase Console → Firestore
  - Verificar coleção `pontos` existe
  - Anotar número de documentos: ______
  - Verificar campos obrigatórios presentes

- [ ] **Estrutura de dados validada**
  - Campos `lat` e `lng` são números (não strings)
  - Campo `tipo` é 'coleta' ou 'abrigo'
  - Campo `timestamp` existe
  - Arrays de `doacoes` são válidos

## 🏗️ Infraestrutura

- [ ] **Dependências instaladas**
  ```bash
  npm install
  ```

- [ ] **TypeScript compila sem erros**
  ```bash
  npm run type-check
  ```

- [ ] **Scripts de migração testados**
  ```bash
  # Dry-run (apenas listar, não migrar)
  # Ver código em migrations/migrate-jf-data.ts
  ```

## 🚀 Plano de Execução

- [ ] **Horário agendado**
  - Escolher horário de baixo tráfego (ex: madrugada)
  - Notificar usuários se necessário
  - Ter pelo menos 2 horas de janela

- [ ] **Equipe de suporte disponível**
  - Desenvolvedores de prontidão
  - Acesso ao Firebase Console
  - Documentação de rollback pronta

- [ ] **Monitoramento preparado**
  - Logs do Firestore habilitados
  - Alertas configurados (opcional)
  - Dashboard de métricas (opcional)

## 📝 Ordem de Execução

Execute nesta ordem exata:

### 1. Criar coleção de cidades
```bash
npm run migrate:cities
```

**Verificar:**
- Coleção `cities` criada
- 3 documentos presentes (jf, uba, matias-barbosa)

### 2. Migrar dados de JF
```bash
npm run migrate:jf
```

**Verificar:**
- Log mostra "✅ SUCCESS"
- Número de documentos migrados = número original
- Arquivo `migration-report.json` gerado

### 3. Validar migração
```bash
npm run migrate:validate
```

**Verificar:**
- Contagens batem: `pontos` === `jf_pontos`
- Spot-check de 10 docs passa
- Nenhum erro reportado

### 4. Teste manual no app
```bash
npm run dev
```

**Verificar:**
- Acessar http://localhost:3000/jf
- Ver mapa carregando
- Ver markers de pontos
- Clicar em markers → popup funciona
- Cadastrar novo ponto → aparece no mapa

### 5. Aplicar Security Rules

Copiar e colar no Firebase Console → Firestore → Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{cityCollection}/{pointId} {
      allow read: if cityCollection.matches('.*_pontos$');
      allow create: if cityCollection.matches('.*_pontos$');
      allow update, delete: if false;
    }
    match /cities/{cityId} {
      allow read: if true;
      allow write: if false;
    }
  }
}
```

**Verificar:**
- Rules publicadas sem erros
- Testar leitura de pontos (deve funcionar)
- Testar escrita via app (deve funcionar)

## 🔙 Plano de Rollback

Se algo der errado:

### Opção 1: Reverter migração (rápido)
```bash
npm run migrate:rollback
```

Isso deleta a coleção `jf_pontos`. A coleção `pontos` permanece intacta.

### Opção 2: Restaurar backup (seguro)
1. Firebase Console → Firestore → Settings → Import/Export
2. Import do arquivo de backup salvo anteriormente
3. Restaurar para coleção `pontos`

### Opção 3: Rollback manual
1. Firebase Console → Firestore
2. Deletar coleção `jf_pontos`
3. Verificar que `pontos` ainda existe

## 📞 Contatos de Emergência

Em caso de problemas críticos durante a migração:

- **Desenvolvedor Principal**: _______
- **Suporte Firebase**: https://firebase.google.com/support
- **Documentação**: migrations/README.md

## ✅ Pós-Migração

Depois de 24-48h de estabilidade:

- [ ] **Monitorar erros**
  - Verificar logs do Firestore
  - Verificar logs da aplicação
  - Coletar feedback de usuários

- [ ] **Performance OK**
  - Tempo de carregamento do mapa < 3s
  - Queries do Firestore otimizadas
  - Sem timeout errors

- [ ] **Dados consistentes**
  - Contagem de pontos estável
  - Novos pontos sendo adicionados corretamente
  - Real-time updates funcionando

- [ ] **Backup da coleção antiga**
  - (Opcional) Após 1 semana de estabilidade
  - Considerar deletar coleção `pontos` antiga
  - Manter backup offline permanente

---

## 🎯 Critérios de Sucesso

A migração é considerada bem-sucedida quando:

✅ Todos os documentos migrados (contagem bate)
✅ Nenhum erro no relatório de migração
✅ Validação passou (10/10 docs corretos)
✅ App carrega e exibe pontos corretamente
✅ Cadastro de novos pontos funciona
✅ Real-time updates funcionando
✅ Security rules aplicadas
✅ Zero downtime para usuários

---

**Data da Migração:** ___/___/______
**Executado por:** _________________
**Resultado:** ☐ Sucesso ☐ Falha ☐ Rollback
