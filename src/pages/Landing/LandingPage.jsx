import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { CategoriesSection } from "@/components/landing/CategoriesSection";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { StatsSection } from "@/components/landing/StatsSection";
import { CTASection } from "@/components/landing/CTASection";

export default function LandingPage() {
  return (
    <div>
      <HeroSection />
      <FeaturesSection />
      <CategoriesSection />
      <StatsSection />
      <TestimonialsSection />
      <CTASection />
    </div>
  );
}
