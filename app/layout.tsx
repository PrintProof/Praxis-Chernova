import type {ReactNode} from 'react';

// Reihenfolge ist bedeutsam: Tokens -> Basis -> Layout -> Komponenten -> Seiten.
// Jede Datei hat genau einen Zweck, damit Stile auffindbar bleiben.
import '@/app/styles/tokens.css';
import '@/app/styles/base.css';
import '@/app/styles/layout.css';
import '@/app/styles/components.css';
import '@/app/styles/page-home.css';
import '@/app/styles/page-services.css';
import '@/app/styles/page-news.css';
import '@/app/styles/page-contact.css';
import '@/app/styles/page-legal.css';

export default function RootLayout({children}: {children: ReactNode}) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}
