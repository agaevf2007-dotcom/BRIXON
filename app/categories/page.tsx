import { CategoriesPageView } from "@/components/CategoriesPageView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Categories",
  description: "Browse BRIXON appliances by room and ritual.",
};

export default function CategoriesPage() {
  return <CategoriesPageView />;
}
