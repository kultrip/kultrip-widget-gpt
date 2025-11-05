import { useEffect, useRef, useState } from "react";

interface KultripWidgetProps {
  userId?: string;
  language?: 'en' | 'es' | 'auto';
  height?: number | string;
  width?: number | string;
  onLoad?: () => void;
  onError?: (error: Error) => void;
}

export default function KultripWidget({ 
  userId = "DEMO_AGENCY", 
  language,
  height = 600,
  width = "100%",
  onLoad,
  onError
}: KultripWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [containerId] = useState(() => `kultrip-widget-${Math.random().toString(36).substr(2, 9)}`);

  useEffect(() => {
    let didCancel = false;

    const loadWidget = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Load CSS
        if (!document.getElementById('kultrip-widget-css')) {
          const link = document.createElement('link');
          link.id = 'kultrip-widget-css';
          link.rel = 'stylesheet';
          link.href = 'https://widget.kultrip.com/kultrip-widget.css';
          document.head.appendChild(link);
        }

        // Load JS
        if (!window.KultripWidget) {
          await new Promise<void>((resolve, reject) => {
            const existingScript = document.getElementById('kultrip-widget-js');
            
            if (existingScript) {
              // Script exists, check if KultripWidget is available
              if (window.KultripWidget) {
                resolve();
                return;
              }
              // Script exists but KultripWidget not ready, wait for it
              existingScript.addEventListener('load', () => resolve());
              existingScript.addEventListener('error', reject);
              return;
            }

            // Create new script
            const script = document.createElement('script');
            script.id = 'kultrip-widget-js';
            script.src = 'https://widget.kultrip.com/kultrip-widget.umd.js';
            script.async = true;
            
            script.onload = () => {
              // Give it a moment to initialize
              setTimeout(resolve, 100);
            };
            script.onerror = () => reject(new Error('Failed to load Kultrip widget script'));
            
            document.head.appendChild(script);
          });
        }

        if (didCancel) return;

        // Initialize widget
        if (window.KultripWidget && containerRef.current) {
          const options: any = { userId };
          if (language && language !== 'auto') {
            options.language = language;
          }

          window.KultripWidget.init(containerId, options);
          
          setIsLoading(false);
          onLoad?.();
        } else {
          throw new Error('KultripWidget not available or container not found');
        }

      } catch (err) {
        if (!didCancel) {
          const error = err instanceof Error ? err : new Error('Unknown error loading widget');
          setError(error.message);
          setIsLoading(false);
          onError?.(error);
        }
      }
    };

    loadWidget();

    return () => {
      didCancel = true;
      // Optional: destroy widget instance if API provides cleanup method
      // window.KultripWidget?.destroy?.(containerId);
    };
  }, [userId, language, containerId, onLoad, onError]);

  const containerStyle: React.CSSProperties = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
    border: '1px solid #ddd',
    borderRadius: '8px',
    position: 'relative',
    overflow: 'hidden'
  };

  const overlayStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    zIndex: 10
  };

  return (
    <div style={containerStyle}>
      <div id={containerId} ref={containerRef} style={{ width: '100%', height: '100%' }} />
      
      {/* Loading/Error Overlay */}
      {(isLoading || error) && (
        <div style={overlayStyle}>
          {isLoading && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                width: '40px', 
                height: '40px', 
                border: '4px solid #f3f3f3',
                borderTop: '4px solid #3498db',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 10px'
              }} />
              <div>Loading Kultrip Widget...</div>
            </div>
          )}
          
          {error && (
            <div style={{ textAlign: 'center', color: '#e74c3c' }}>
              <div style={{ fontSize: '24px', marginBottom: '10px' }}>⚠️</div>
              <div>Failed to load widget</div>
              <div style={{ fontSize: '12px', marginTop: '5px' }}>{error}</div>
            </div>
          )}
        </div>
      )}

      {/* CSS for loading spinner */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

// Type declaration for window.KultripWidget
declare global {
  interface Window {
    KultripWidget?: {
      init: (containerId: string, options: { userId: string; language?: string }) => void;
      destroy?: (containerId: string) => void;
    };
  }
}