# Minas Emergencia

Mapa colaborativo para localizar pontos de doacao e abrigos durante emergencias em Minas Gerais.

**Acesse:** [minas-emergencia.com](https://minas-emergencia.com)

## O que e

Sistema web aberto que permite qualquer pessoa cadastrar e localizar pontos de coleta de doacoes e abrigos em cidades de Minas Gerais atingidas por enchentes e desastres naturais.

Funciona como um mapa interativo onde a comunidade pode:
- Ver pontos de coleta e abrigos no mapa
- Cadastrar novos pontos com endereco, tipo de doacao aceita, horarios, contato
- Filtrar por tipo (ponto de coleta / abrigo)
- Navegar ate o ponto via Google Maps

## Cidades suportadas

| Cidade | Rota | Status |
|--------|------|--------|
| Juiz de Fora | `/jf` | Ativo |
| Uba | `/uba` | Ativo |
| Matias Barbosa | `/matias-barbosa` | Desativado |

Para adicionar uma cidade, edite `src/config/cities.ts`.

## Stack

- **Next.js 15** (App Router, Turbopack)
- **TypeScript**
- **Tailwind CSS**
- **Firebase Firestore**
- **Leaflet** (mapas)
- **React Hook Form + Zod** (formularios)
- **Vercel** (hosting)

## Rodando localmente

### Pre-requisitos

- Node.js 18+
- Conta Firebase (gratuita)

### Setup

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variaveis de ambiente
cp .env.example .env.local
# Edite .env.local com suas credenciais do Firebase

# 3. Rodar
npm run dev
```

Acesse http://localhost:3000

### Configurando o Firebase

1. Crie um projeto no [Firebase Console](https://console.firebase.google.com/)
2. Ative o Firestore Database
3. Copie as credenciais para `.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

4. Configure as Security Rules no Firestore:

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

## Estrutura do projeto

```
src/
  app/              # Rotas (Next.js App Router)
    api/points/     # API GET/POST pontos
    api/geocode/    # Proxy geocoding
    [citySlug]/     # Paginas dinamicas por cidade
  components/       # Componentes React
    map/            # MapView, LeafletMap, Legend
    forms/          # PointForm, inputs
    city/           # CitySelector, CityStats, CityCard
  config/cities.ts  # Configuracao das cidades
  lib/firebase/     # Config e helpers Firebase
  types/            # TypeScript types
```

## Deploy

O projeto roda na Vercel. Push na `main` faz deploy automatico.

Para deploy manual:

```bash
npx vercel --prod
```

## Contribuindo

Contribuicoes sao bem-vindas! Este e um projeto de ajuda humanitaria.

1. Fork o repositorio
2. Crie uma branch (`git checkout -b minha-feature`)
3. Faca suas alteracoes e teste localmente
4. Commit e push
5. Abra um Pull Request

### Como adicionar uma nova cidade

1. Adicione a cidade em `src/config/cities.ts` com coordenadas, bounds e slug
2. Crie a colecao no Firestore (ex: `novacidade_pontos`)
3. Teste localmente com `npm run dev`

## Projetos similares

Outros projetos voltados para ajuda em emergencias em Minas Gerais:

- [SOS Juiz de Fora](https://sosjuizdefora.growberry.com.br/) - Plataforma de apoio emergencial para JF
- [SOS JF](https://sosjf.org) - Rede de apoio a vitimas de enchentes em Juiz de Fora
- [Ajude.io](https://ajude.io/) - Plataforma de ajuda para desastres
- [Minas Emergencia](https://minas-emergencia.com) - Este projeto

## Contatos de emergencia

- Defesa Civil: **199**
- Bombeiros: **193**
- SAMU: **192**
- Policia: **190**

## Licenca

MIT
