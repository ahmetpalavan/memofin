import { clsx, type ClassValue } from 'clsx';
import { Metadata } from 'next';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function constructMetadata({
  title = 'Memofin',
  description = 'A simple memo app',
  icons = '/favicon.ico',
  image = '/hedgehog.png',
}: {
  title?: string;
  description?: string;
  image?: string;
  icons?: string;
} = {}): Metadata {
  return {
    title,
    description,
    openGraph: {
      images: [image],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      creator: '@ahmetpalavan',
    },
    icons,
    metadataBase: new URL('https://coverit-up.vercel.app/'),
  };
}

export type PropsWithClassName<T = {}> = T & { className?: string };
