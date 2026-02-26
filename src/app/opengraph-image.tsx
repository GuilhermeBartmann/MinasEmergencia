import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Emergência Coletas - Sistema Multi-Cidade';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

/**
 * Landing page OG Image
 */
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#ffffff',
        }}
      >
        {/* Header */}
        <div
          style={{
            width: '100%',
            height: '180px',
            background: 'linear-gradient(135deg, #c0392b 0%, #e74c3c 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: 15,
          }}
        >
          <div style={{ fontSize: 72, fontWeight: 'bold', color: 'white' }}>
            🆘 Emergência Coletas
          </div>
          <div style={{ fontSize: 32, color: 'rgba(255,255,255,0.95)' }}>
            Sistema Colaborativo de Ajuda Humanitária
          </div>
        </div>

        {/* Main Content */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '60px',
            backgroundColor: '#f8f9fa',
            gap: 40,
          }}
        >
          {/* Cities */}
          <div
            style={{
              display: 'flex',
              gap: 30,
              alignItems: 'center',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 10,
                backgroundColor: 'white',
                padding: '30px 40px',
                borderRadius: 16,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              }}
            >
              <div style={{ fontSize: 48 }}>🏙️</div>
              <div style={{ fontSize: 32, fontWeight: 'bold', color: '#2c3e50' }}>
                Juiz de Fora
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 10,
                backgroundColor: 'white',
                padding: '30px 40px',
                borderRadius: 16,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              }}
            >
              <div style={{ fontSize: 48 }}>🏘️</div>
              <div style={{ fontSize: 32, fontWeight: 'bold', color: '#2c3e50' }}>
                Ubá
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 10,
                backgroundColor: 'white',
                padding: '30px 40px',
                borderRadius: 16,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              }}
            >
              <div style={{ fontSize: 48 }}>🌆</div>
              <div style={{ fontSize: 32, fontWeight: 'bold', color: '#2c3e50' }}>
                Matias Barbosa
              </div>
            </div>
          </div>

          {/* Features */}
          <div style={{ display: 'flex', gap: 25, marginTop: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ fontSize: 36 }}>📍</div>
              <div style={{ fontSize: 26, color: '#7f8c8d' }}>Pontos de Coleta</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ fontSize: 36 }}>🏠</div>
              <div style={{ fontSize: 26, color: '#7f8c8d' }}>Abrigos</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ fontSize: 36 }}>⚡</div>
              <div style={{ fontSize: 26, color: '#7f8c8d' }}>Tempo Real</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ fontSize: 36 }}>🗺️</div>
              <div style={{ fontSize: 26, color: '#7f8c8d' }}>Mapas Interativos</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            width: '100%',
            height: '80px',
            backgroundColor: '#2c3e50',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: 26,
          }}
        >
          🚨 Defesa Civil: 199 • Bombeiros: 193 • SAMU: 192
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
