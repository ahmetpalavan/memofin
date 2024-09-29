import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { constructMetadata } from '~/lib/utils';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const metadata = constructMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning lang='en'>
      <body className={`${geistSans.variable} ${geistMono.variable} ${geistMono.className} ${geistSans.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}
