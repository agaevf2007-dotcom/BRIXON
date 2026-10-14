import { DeliveryContent } from "@/components/delivery/DeliveryContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Delivery",
  description: "White-glove delivery, installation and old-appliance removal.",
};

export default function DeliveryPage() {
  return <DeliveryContent />;
}
