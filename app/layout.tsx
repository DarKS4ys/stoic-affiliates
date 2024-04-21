import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import { EdgeStoreProvider } from '@/lib/edgestore';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'STOIC AFFILIATES',
  description: 'Stoiccord affiliate system',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
      {/* <EdgeStoreProvider> */}
      <html lang="en">
        <body className={inter.className}>{children}</body>
      </html>
      {/* </EdgeStoreProvider> */}
    </ClerkProvider>
  );
}
