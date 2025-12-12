import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import type { ReactNode } from 'react';

export default async function PrivateLayout({ children }: { children: ReactNode }) {
  const token = (await cookies()).get('accessToken')?.value;
  if (!token) redirect('/auth/login');
  return <>{children}</>;
}
