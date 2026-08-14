import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from 'sonner';
import { Suspense } from 'react';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NominaX",
  description: "Gestión de nómina para pequeñas y medianas empresas colombianas",
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
          {children}
          <Toaster position="top-center" richColors />
        </Suspense>
      </body>
    </html>
  );
}
