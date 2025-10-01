import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    
    const title = searchParams.get('title') || 'Unknown';
    const score = searchParams.get('score') || '0';
    const persona = searchParams.get('persona') || '';
    const heat = searchParams.get('heat') || '';
    const blurb = searchParams.get('blurb') || '';

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#0f172a',
            padding: '60px',
            fontFamily: 'system-ui, -apple-system',
          }}
        >
          {/* Main Card */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#1e293b',
              borderRadius: '24px',
              padding: '60px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
              width: '800px',
            }}
          >
            {/* Score Badge */}
            <div
              style={{
                fontSize: 80,
                fontWeight: 'bold',
                color: '#fff',
                marginBottom: '20px',
              }}
            >
              {score}
            </div>

            {/* Archetype Title */}
            <div
              style={{
                fontSize: 56,
                fontWeight: 'bold',
                color: '#60a5fa',
                marginBottom: '16px',
                textAlign: 'center',
              }}
            >
              {title}
            </div>

            {/* Blurb */}
            <div
              style={{
                fontSize: 28,
                color: '#94a3b8',
                marginBottom: '40px',
                textAlign: 'center',
                maxWidth: '600px',
              }}
            >
              {blurb}
            </div>

            {/* Persona + Heat Tags */}
            <div
              style={{
                display: 'flex',
                gap: '12px',
                marginBottom: '20px',
              }}
            >
              {persona && (
                <div
                  style={{
                    backgroundColor: '#334155',
                    color: '#e2e8f0',
                    padding: '8px 20px',
                    borderRadius: '999px',
                    fontSize: 20,
                  }}
                >
                  {persona}
                </div>
              )}
              {heat && (
                <div
                  style={{
                    backgroundColor: '#334155',
                    color: '#e2e8f0',
                    padding: '8px 20px',
                    borderRadius: '999px',
                    fontSize: 20,
                  }}
                >
                  {heat}
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div
            style={{
              marginTop: '40px',
              fontSize: 20,
              color: '#64748b',
            }}
          >
            linkedroast.com
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error) {
    console.error('Error generating card image:', error);
    return new Response('Failed to generate image', { status: 500 });
  }
}
