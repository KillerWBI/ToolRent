import { redirect } from 'next/navigation';
import type { ReactNode } from 'react';
import { verifyAuthServer } from '../../lib/auth';

export default async function PrivateLayout({ children }: { children: ReactNode }) {
  const token = await verifyAuthServer();
  if (!token) redirect('/login');
  return <>{children}</>;
}
