'use client';

import { useEffect, useRef } from 'react';

const DEFAULT_KEY = 'cd4d47f7bee37b32f81246092a780708';
const DEFAULT_SRC = 'https://bauval.org/22/cd4d47f7bee37b32f81246092a780708';

/**
 * Responsive Adsterra Banner Component
 * 
 * Works with Adsterra standard iframe banners.
 * Isolates each banner inside an iframe to prevent global atOptions
 * collisions and React re-render issues.
 */
export default function AdBanner({
  zoneKey = DEFAULT_KEY,
  src = DEFAULT_SRC,
  width = 300,
  height = 250,
  className = '',
}) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!zoneKey || !containerRef.current) return;

    const iframe = document.createElement('iframe');
    iframe.width = `${width}`;
    iframe.height = `${height}`;
    iframe.scrolling = 'no';
    iframe.frameBorder = '0';
    iframe.style.border = 'none';
    iframe.style.overflow = 'hidden';

    const scriptUrl = src || `https://bauval.org/22/${zoneKey}`;

    iframe.srcdoc = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              margin: 0;
              padding: 0;
              display: flex;
              justify-content: center;
              align-items: center;
              background: transparent;
            }
          </style>
        </head>
        <body>
          <script type="text/javascript">
            atOptions = {
              'key': '${zoneKey}',
              'format': 'iframe',
              'height': ${height},
              'width': ${width},
              'params': {}
            };
          </script>
          <script type="text/javascript" src="${scriptUrl}"></script>
        </body>
      </html>
    `;

    const container = containerRef.current;
    container.innerHTML = '';
    container.appendChild(iframe);

    return () => {
      if (container) container.innerHTML = '';
    };
  }, [zoneKey, src, width, height]);

  if (!zoneKey) return null;

  return (
    <div className={`my-6 flex flex-col items-center justify-center ${className}`}>
      <span className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-gray-500">
        Advertisement
      </span>
      <div
        ref={containerRef}
        style={{ width: `${width}px`, minHeight: `${height}px` }}
        className="flex items-center justify-center overflow-hidden rounded-xl bg-white/5 ring-1 ring-white/10"
      />
    </div>
  );
}
