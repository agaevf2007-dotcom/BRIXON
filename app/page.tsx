import { CategorySection } from "@/components/home/CategorySection";
import { CTA } from "@/components/home/CTA";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { Hero } from "@/components/home/Hero";
import { LifestyleSection } from "@/components/home/LifestyleSection";
import { Statistics } from "@/components/home/Statistics";
import { TechnologySection } from "@/components/home/TechnologySection";

export default function HomePage() {
  return (
    <>
      <Hero />
      <CategorySection />
      <FeaturedProducts />
      <LifestyleSection />
      <TechnologySection />
      <Statistics />
      <CTA />
    </>
  );
}
