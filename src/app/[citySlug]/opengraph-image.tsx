import { ImageResponse } from 'next/og';
import { getCityBySlug } from '@/config/cities';

export const runtime = 'edge';
export const alt = 'Emergência Coletas - Pontos de Doação';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

/**
 * Dynamic OG Image for each city
 * Generates a custom Open Graph image with city-specific information
 */
export default async function Image({ params }: { params: Promise<{ citySlug: string }> }) {
  try {
    const { citySlug } = await params;
    const city = getCityBySlug(citySlug);

    if (!city) {
      // Fallback generic image
      return new ImageResponse(
        (
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#c0392b',
              color: 'white',
              fontFamily: 'sans-serif',
            }}
          >
            <div style={{ fontSize: 72, fontWeight: 'bold', marginBottom: 20 }}>
              🆘 Emergência Coletas
            </div>
            <div style={{ fontSize: 32, opacity: 0.9 }}>
              Pontos de Doação e Abrigos
            </div>
          </div>
        ),
        {
          ...size,
        }
      );
    }

    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#ffffff',
            position: 'relative',
          }}
        >
          {/* Header Banner */}
          <div
            style={{
              width: '100%',
              height: '140px',
              backgroundColor: '#c0392b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 60px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              <div style={{ fontSize: 64 }}>🆘</div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontSize: 48, fontWeight: 'bold', color: 'white' }}>
                  Emergência Coletas
                </div>
                <div style={{ fontSize: 24, color: 'rgba(255,255,255,0.9)' }}>
                  Pontos de Doação e Abrigos
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              padding: '60px',
              backgroundColor: '#f8f9fa',
            }}
          >
            {/* City Name */}
            <div
              style={{
                fontSize: 80,
                fontWeight: 'bold',
                color: '#2c3e50',
                marginBottom: 20,
              }}
            >
              {city.name}
            </div>

            {/* Description */}
            <div
              style={{
                fontSize: 32,
                color: '#7f8c8d',
                marginBottom: 40,
                lineHeight: 1.4,
              }}
            >
              {city.metadata.description}
            </div>

            {/* Features */}
            <div style={{ display: 'flex', gap: 40 }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 15,
                  backgroundColor: 'white',
                  padding: '20px 30px',
                  borderRadius: 12,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                }}
              >
                <div style={{ fontSize: 40 }}>🎯</div>
                <div style={{ fontSize: 28, color: '#c0392b', fontWeight: 'bold' }}>
                  Pontos de Coleta
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 15,
                  backgroundColor: 'white',
                  padding: '20px 30px',
                  borderRadius: 12,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                }}
              >
                <div style={{ fontSize: 40 }}>🏠</div>
                <div style={{ fontSize: 28, color: '#f39c12', fontWeight: 'bold' }}>
                  Abrigos
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 15,
                  backgroundColor: 'white',
                  padding: '20px 30px',
                  borderRadius: 12,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                }}
              >
                <div style={{ fontSize: 40 }}>⚡</div>
                <div style={{ fontSize: 28, color: '#27ae60', fontWeight: 'bold' }}>
                  Tempo Real
                </div>
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
              fontSize: 24,
            }}
          >
            🚨 Defesa Civil: {city.metadata.emergencyPhone} • Sistema de Emergência
          </div>
        </div>
      ),
      {
        ...size,
      }
    );
  } catch (error) {
    console.error('Error generating OG image:', error);

    // Fallback error image
    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#c0392b',
            color: 'white',
            fontSize: 48,
          }}
        >
          Emergência Coletas
        </div>
      ),
      {
        ...size,
      }
    );
  }
}
