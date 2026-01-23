import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from 'sonner';
import { PresentationProvider } from '@/context/PresentationContext';
import { Suspense } from 'react';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Nómina Colombia",
  description: "Sistema de gestión de nómina y asistencia",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <Suspense fallback={<div className="h-screen w-full bg-slate-950 flex items-center justify-center text-white">Cargando...</div>}>
          <PresentationProvider>
            {children}
            <Toaster position="top-center" richColors />
          </PresentationProvider>
        </Suspense>
      </body>
    </html>
  );
}
