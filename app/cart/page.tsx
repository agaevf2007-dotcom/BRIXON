import { CartPageView } from "@/components/CartPageView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cart",
};

export default function CartPage() {
  return <CartPageView />;
}
