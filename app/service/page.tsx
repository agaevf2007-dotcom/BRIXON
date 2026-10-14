import { ServiceContent } from "@/components/service/ServiceContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Service",
  description: "Warranty, repair, installation, maintenance and spare parts.",
};

export default function ServicePage() {
  return <ServiceContent />;
}
