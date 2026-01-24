import { headers } from 'next/headers';
import NominaLanding from '@/components/NominaLanding';
import PresentationContent from '@/components/PresentationContent';

export default async function Page() {
  const headersList = await headers();
  const host = headersList.get('host') || '';

  // Check if the request is coming from the presentation domain
  const isPresentationDomain = host.includes('presentacion-comite-2025.vercel.app') ||
    host.includes('presentacion-comite');

  if (isPresentationDomain) {
    return <PresentationContent />;
  }

  return <NominaLanding />;
}
