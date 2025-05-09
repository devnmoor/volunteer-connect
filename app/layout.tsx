// app/layout.tsx
import './globals.css';
import { Inter } from 'next/font/google';
import type { Metadata } from 'next';
import EnhancedNavigation from '@/app/components/layout/EnhancedNavigation';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Volunteer Connect',
  description: 'A platform for tracking volunteering activities and connecting with others locally',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <EnhancedNavigation />
        {/* Add padding to account for fixed navigation */}
        <main className="pt-16">
          {children}
        </main>
      </body>
    </html>
  );
}