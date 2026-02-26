# Emergência Coletas - Next.js 15

Sistema colaborativo para localizar pontos de doação e abrigos durante emergências em Minas Gerais.

## 🚀 Tecnologias

- **Next.js 15** - Framework React com App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Firebase Firestore** - Database real-time
- **Leaflet** - Mapas interativos
- **React Hook Form + Zod** - Validação de formulários
- **Vercel Analytics** - Analytics (cookieless, LGPD-compliant)

## 📋 Pré-requisitos

- Node.js 18+ instalado
- npm ou yarn
- Conta Firebase (gratuita)

## 🔧 Configuração

### 1. Instalar Dependências

```bash
npm install
```

### 2. Configurar Firebase

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Crie um novo projeto ou use um existente
3. Ative o Firestore Database
4. Copie as credenciais do projeto

### 3. Variáveis de Ambiente

Copie o arquivo `.env.example` para `.env.local` e preencha com suas credenciais:

```bash
cp .env.example .env.local
```

Edite `.env.local` e adicione suas credenciais do Firebase:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=sua_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=seu_projeto_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=seu_projeto.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=seu_messaging_id
NEXT_PUBLIC_FIREBASE_APP_ID=seu_app_id
```

### 4. Configurar Firestore Security Rules

No Firebase Console, vá em Firestore Database > Rules e aplique:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Pontos das cidades (jf_pontos, uba_pontos, etc)
    match /{cityCollection}/{pointId} {
      allow read: if cityCollection.matches('.*_pontos$');
      allow create: if cityCollection.matches('.*_pontos$');
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

## 🏃 Rodando o Projeto

### Desenvolvimento

```bash
npm run dev
```

Acesse: http://localhost:3000

### Build de Produção

```bash
npm run build
npm start
```

### Type Check

```bash
npm run type-check
```

### Lint

```bash
npm run lint
```

## 📁 Estrutura do Projeto

```
emergencia-coletas-nextjs/
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── layout.tsx    # Layout raiz
│   │   ├── page.tsx      # Landing page
│   │   ├── api/          # API routes
│   │   │   ├── points/   # GET/POST pontos
│   │   │   └── geocode/  # Geocoding proxy
│   │   └── [citySlug]/   # Páginas dinâmicas
│   ├── components/       # Componentes React
│   │   ├── ui/          # Componentes base
│   │   ├── layout/      # Header, Footer, Nav
│   │   ├── city/        # CitySelector, Stats
│   │   ├── map/         # MapView, Legend
│   │   └── forms/       # PointForm, inputs
│   ├── lib/             # Utilitários
│   │   ├── firebase/    # Config e helpers
│   │   ├── validation/  # Schemas Zod
│   │   ├── api/         # Rate limiting
│   │   └── utils/       # Funções auxiliares
│   ├── types/           # TypeScript types
│   ├── config/          # Configurações
│   ├── hooks/           # Custom hooks
│   └── contexts/        # React contexts
├── public/              # Assets estáticos
└── .env.local           # Variáveis de ambiente
```

## 🗺️ Cidades Suportadas

- **Juiz de Fora** (JF) - `/jf`
- **Ubá** - `/uba`
- **Matias Barbosa** - `/matias-barbosa`

Para adicionar mais cidades, edite `src/config/cities.ts`.

## 🔄 Migração de Dados

Se você está migrando de um sistema antigo, use os scripts de migração:

```bash
# 1. Inicializar coleção de cidades
npm run migrate:cities

# 2. Migrar dados de Juiz de Fora (pontos → jf_pontos)
npm run migrate:jf

# 3. Validar migração
npm run migrate:validate
```

**⚠️ IMPORTANTE:** Sempre faça backup manual antes de executar migrações!

Consulte o guia completo em [`migrations/README.md`](./migrations/README.md) para instruções detalhadas.

## ✨ Features Implementadas

- ✅ **Fase 1**: Foundation - Next.js + Firebase setup
- ✅ **Fase 2**: Componentes UI base e landing page
- ✅ **Fase 3**: Mapa interativo com Leaflet
- ✅ **Fase 4**: Formulário de cadastro com validação
- ✅ **Fase 5**: API routes e backend
- ✅ **Fase 6**: Atualizações em tempo real
- ✅ **Fase 7**: Scripts de migração de dados
- ✅ **Fase 8**: SEO e performance otimizados
- ✅ **Fase 9**: PWA completo
- ⏳ **Fase 10**: Deploy

## 🔥 Atualizações em Tempo Real

O sistema utiliza Firestore listeners para atualizações automáticas:

- Novos pontos aparecem instantaneamente no mapa
- Sem necessidade de recarregar a página
- Notificação visual quando novos pontos são adicionados
- Indicador de conexão em tempo real

## 🔍 SEO e Performance

Otimizações implementadas para máxima visibilidade:

- **Metadata Dinâmica**: Title, description e keywords por cidade
- **Open Graph Images**: Imagens sociais geradas dinamicamente (1200×630px)
- **Structured Data**: JSON-LD para WebSite, Organization e WebPage
- **Sitemap XML**: Gerado automaticamente para todas as cidades
- **robots.txt**: Configurado para indexação otimizada
- **Core Web Vitals**: LCP < 2.5s, FID < 100ms, CLS < 0.1
- **Font Optimization**: Poppins com next/font (self-hosted)
- **Performance Monitoring**: Web Vitals tracking integrado

Consulte o guia completo em [`docs/SEO-GUIDE.md`](./docs/SEO-GUIDE.md).

## 📱 PWA (Progressive Web App)

O sistema funciona como um app nativo, instalável e com suporte offline:

- **Instalável**: Adicione à tela inicial (Android, iOS, Desktop)
- **Offline-First**: Service Worker com cache inteligente
- **Map Tiles Cached**: 200 tiles do mapa em cache (30 dias)
- **API Fallback**: Network-first com fallback para cache
- **Install Prompt**: Banner inteligente após 10 segundos
- **Offline Indicator**: Badge visual quando sem conexão
- **Offline Page**: Fallback com instruções e contatos de emergência
- **App Shortcuts**: Acesso rápido para JF e Ubá

**Estratégias de Cache:**
- Fonts: CacheFirst (365 dias)
- Map Tiles: CacheFirst (30 dias, 200 entries)
- API: NetworkFirst (5 min, timeout 10s)
- Static Assets: CacheFirst (365 dias)

Consulte o guia completo em [`docs/PWA-GUIDE.md`](./docs/PWA-GUIDE.md).

## 🔒 Segurança

- **Client-side**: Validação Zod + sanitização XSS
- **Server-side**: Rate limiting (1 req/30s) + validação duplicada
- **Firestore**: Security rules + server timestamps
- **LGPD**: Consentimento obrigatório + dados públicos

## 🚀 Deploy

### Vercel (Recomendado)

1. Faça push do código para GitHub
2. Importe o projeto no [Vercel](https://vercel.com)
3. Configure as variáveis de ambiente
4. Deploy automático!

### Variáveis de Ambiente (Vercel)

Configure todas as variáveis do `.env.local` no dashboard da Vercel.

## 📄 Licença

MIT

## 🤝 Contribuindo

Contribuições são bem-vindas! Este é um sistema de emergência para ajuda humanitária.

## ⚠️ Importante

Este é um sistema de emergência. Mantenha sempre:
- Disponibilidade 24/7
- Performance otimizada
- Segurança robusta
- Dados sempre validados
- LGPD compliance

## 📞 Contatos de Emergência

- 🚨 Defesa Civil: 199
- 🚒 Bombeiros: 193
- 🚔 Polícia: 190
- 🏥 SAMU: 192
