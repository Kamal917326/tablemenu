import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { getRestaurant } from "@/lib/store";

type Props = { params: { slug: string } };

export default async function AdminRestaurantPage({ params }: Props) {
  const restaurant = await getRestaurant(params.slug);
  if (!restaurant) notFound();

  const headersList = headers();
  const host = headersList.get("host") ?? "localhost:3000";
  const protocol = host.includes("localhost") ? "http" : "https";
  const baseUrl = `${protocol}://${host}`;

  return <AdminDashboard initialRestaurant={restaurant} baseUrl={baseUrl} />;
}
