// app/dashboard/booking/[toolId]/page.tsx
import BookingToolForm from "@/components/forms/BookingToolForm/BookingToolForm";
import { notFound } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

type PageProps = {
  params: { toolId: string };
};


export default async function BookingPage({ params }: PageProps) {
  // если params асинхронные:
  const { toolId } = await params; // <-- await

  if (!toolId) {
    notFound();
  }

  const res = await fetch(`${API_URL}/api/tools/${toolId}`);
  if (!res.ok) notFound();
  const data = await res.json();

  return <BookingToolForm tool={data} />;
}

