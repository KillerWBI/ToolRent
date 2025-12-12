import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function AuthPage() {
  const token = (await cookies()).get('accessToken')?.value;
  if (token) redirect('/');
  return /* login/register UI */;
}
