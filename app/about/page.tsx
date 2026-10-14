import { AboutContent } from "@/components/about/AboutContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "The story, philosophy and design language of BRIXON.",
};

export default function AboutPage() {
  return <AboutContent />;
}
