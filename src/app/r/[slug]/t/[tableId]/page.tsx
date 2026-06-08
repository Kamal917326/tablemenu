import { notFound } from "next/navigation";
import { MenuView } from "@/components/MenuView";
import { getRestaurant } from "@/lib/data";

type Props = {
  params: { slug: string; tableId: string };
};

export default function TableMenuPage({ params }: Props) {
  const restaurant = getRestaurant(params.slug);

  if (!restaurant) {
    notFound();
  }

  const tableNum = Number.parseInt(params.tableId, 10);
  if (
    Number.isNaN(tableNum) ||
    tableNum < 1 ||
    tableNum > restaurant.tableCount
  ) {
    notFound();
  }

  return <MenuView restaurant={restaurant} tableId={params.tableId} />;
}
