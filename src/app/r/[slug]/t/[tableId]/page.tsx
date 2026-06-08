import { notFound } from "next/navigation";
import { MenuView } from "@/components/MenuView";
import { getRestaurant } from "@/lib/store";

export const dynamic = "force-dynamic";

type Props = { params: { slug: string; tableId: string } };

export default async function TableMenuPage({ params }: Props) {
  const restaurant = await getRestaurant(params.slug);
  if (!restaurant) notFound();

  const tableNum = Number.parseInt(params.tableId, 10);
  if (Number.isNaN(tableNum) || tableNum < 1 || tableNum > restaurant.tableCount) {
    notFound();
  }

  return <MenuView restaurant={restaurant} tableId={params.tableId} />;
}
