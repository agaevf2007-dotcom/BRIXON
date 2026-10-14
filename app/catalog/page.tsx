import { CatalogView } from "@/components/CatalogView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Catalog",
  description: "Explore the BRIXON collection of smart home appliances.",
};

export default function CatalogPage() {
  return <CatalogView />;
}
