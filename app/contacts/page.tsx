import { ContactsContent } from "@/components/contacts/ContactsContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contacts",
  description: "Get in touch with the BRIXON studio.",
};

export default function ContactsPage() {
  return <ContactsContent />;
}
