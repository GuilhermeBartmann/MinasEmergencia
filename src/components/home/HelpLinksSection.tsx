'use client';

import { useState } from 'react';

function HeartIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  );
}

function HandIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function BoltIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  );
}

function CpuIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3H7a2 2 0 00-2 2v2m4-4h6m-6 0v18m6-18h2a2 2 0 012 2v2m-4-4v18M3 9v6m18-6v6M3 9h2m14 0h2M3 15h2m14 0h2M9 21h6" />
    </svg>
  );
}

function BellAlertIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
  );
}

function ExternalLinkIcon() {
  return (
    <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );
}

function ChevronUpIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
    </svg>
  );
}

function CloudIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 15a4 4 0 004 4h9a5 5 0 10-.12-9.998A5.002 5.002 0 0116 7h-2a2 2 0 110-4H3v4z" />
    </svg>
  );
}


const helpLinks = [
  {
    href: "https://ajude.io/?utm_source=ig&utm_medium=social&utm_content=link_in_bio&fbclid=PAZXh0bgNhZW0CMTEAc3J0YwZhcHBfaWQMMjU2MjgxMDQwNTU4AAGnrOrs7KRTE2WHvtzueKm1Q2dxm8L0YOr4bXhXNI1SRqhXv3ohQXC5ZZgJ9XU_aem_ArGA5Vy4UDecevty3kBziQ",
    icon: <HeartIcon />,
    title: "Faça sua Doação",
    description: "Ajude através da plataforma Ajude.io",
  },
  {
    href: "https://sosminas.growberry.com.br/",
    icon: <ShieldIcon />,
    title: "SOS Minas",
    description: "Plataforma de ajuda para as cidades de minas",
  },
  {
    href: "https://sosjf.org",
    icon: <HandIcon />,
    title: "SOS JF",
    description: "Portal de ajuda para Juiz de Fora",
  },
  {
    href: "https://ajudajf.arctei.com.br/",
    icon: <UsersIcon />,
    title: "Ajuda JF",
    description: "Plataforma de coordenação de ajuda humanitária",
  },
  {
    href: "https://ajuda-imediata.vercel.app/",
    icon: <BoltIcon />,
    title: "Ajuda Imediata",
    description: "Sistema de ajuda rápida e emergencial",
  },
  {
    href: "https://studio--studio-9117009730-5014f.us-central1.hosted.app",
    icon: <CpuIcon />,
    title: "IA Monitoramento",
    description: "Inteligência artificial para monitoramento de áreas de risco",
  },
  {
    href: "https://emergencia-mg.netlify.app",
    icon: <BellAlertIcon />,
    title: "Emergência MG",
    description: "Portal de emergências para Minas Gerais",
  },
  {
    href: "https://sosjf.org/chuvas",
    icon: <CloudIcon />,
    title: "Painel de Chuvas",
    description: "Painel de acompanhamento de chuvas em tempo real com satélites e estações meteorológicas",
  },
];

export function HelpLinksSection() {
  const [showAll, setShowAll] = useState(false);
  const displayedLinks = showAll ? helpLinks : helpLinks.slice(0, 3);

  return (
    <div className="max-w-xl mx-auto mb-12">
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 sm:p-5 border border-white/15 shadow-xl">

        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="text-white/80">
            <LinkIcon />
          </div>
          <h2 className="font-sans text-base sm:text-lg font-bold text-white tracking-tight">
            Sites parceiros
          </h2>
        </div>

        <div className="space-y-2">
          {displayedLinks.map((link) => (
            <a
              key={link.title}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between w-full bg-white hover:bg-emergency-50 rounded-lg px-3.5 py-2.5 shadow-sm hover:shadow-md border-2 border-transparent hover:border-emergency-300 transition-all duration-200"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 bg-emergency-50 group-hover:bg-emergency-100 rounded-lg flex items-center justify-center text-emergency-600 flex-shrink-0 transition-colors duration-200">
                  {link.icon}
                </div>
                <div className="leading-tight min-w-0">
                  <span className="text-sm font-bold text-gray-900 group-hover:text-emergency-700 transition-colors block truncate">
                    {link.title}
                  </span>
                  <span className="text-xs text-gray-500 block truncate">{link.description}</span>
                </div>
              </div>
              <div className="text-gray-300 group-hover:text-emergency-400 transition-colors duration-200 ml-3 flex-shrink-0">
                <ExternalLinkIcon />
              </div>
            </a>
          ))}

          {helpLinks.length > 3 && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="group w-full flex items-center justify-center gap-1.5 bg-white/15 hover:bg-white/25 text-white text-sm font-semibold rounded-lg py-2 transition-all duration-200 border border-white/10 hover:border-white/20"
            >
              {showAll ? (
                <>Ver menos <ChevronUpIcon /></>
              ) : (
                <>Ver mais <ChevronDownIcon /></>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
