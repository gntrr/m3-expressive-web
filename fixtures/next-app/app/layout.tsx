import type { ReactNode } from 'react';

import 'm3-expressive-web/styles.css';

import { themeCss } from './theme';

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html data-m3-theme="light" lang="en">
      <body>
        <style>{themeCss}</style>
        {children}
      </body>
    </html>
  );
}
