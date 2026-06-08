import { redirect } from "next/navigation";
import { demoRestaurant } from "@/lib/data";

export default function AdminIndexPage() {
  redirect(`/admin/${demoRestaurant.slug}`);
}
