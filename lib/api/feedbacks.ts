import { Feedback } from '@/types/feedback';

export async function getFeedbacks(): Promise<Feedback[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/feedbacks`, {
    cache: 'no-store', // або next: { revalidate: 60 }
  });

  if (!res.ok) {
    throw new Error('Failed to fetch feedbacks');
  }

  return res.json();
}