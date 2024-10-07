import localFont from 'next/font/local';
import { constructMetadata } from '~/lib/utils';
import './globals.css';
import { Toaster } from '~/components/ui/toaster';

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
    <html className='h-full' suppressHydrationWarning lang='en'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${geistMono.className} ${geistSans.className} antialiased h-full bg-zinc-100`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
