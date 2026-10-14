import { WishlistPageView } from "@/components/WishlistPageView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Wishlist",
};

export default function WishlistPage() {
  return <WishlistPageView />;
}
