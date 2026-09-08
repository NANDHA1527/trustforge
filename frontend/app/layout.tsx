import type { Metadata } from 'next';
import './globals.css';
import Sidebar from '@/components/Sidebar';
import TopHeader from '@/components/TopHeader';

export const metadata: Metadata = {
  title: 'TRUSTFORGE | Intelligent Identity & Document Verification Platform',
  description: 'AI-Based Fake Identity & Document Screening System (Smart India Hackathon 2026 - SIH26188, Ministry of Home Affairs / SSB)',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-background text-slate-100 min-h-screen flex antialiased selection:bg-blue-600 selection:text-white">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <TopHeader />
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}
