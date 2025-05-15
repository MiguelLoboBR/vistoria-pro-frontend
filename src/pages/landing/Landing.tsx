import { useSmoothScrolling } from "@/components/landing/SmoothScrolling";
import Header from "@/components/landing/Header";
import HeroSection from "@/components/landing/HeroSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import CTASection from "@/components/landing/CTASection";
import FooterSection from "@/components/landing/FooterSection";
import PWAInstallButton from "@/components/landing/PWAInstallButton";

export const Landing = () => {
  useSmoothScrolling(); // Ativa rolagem suave para âncoras

  return (
    <>
      <Header />

      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <TestimonialsSection />
        <CTASection />
      </main>

      <footer>
        <FooterSection />
      </footer>

      <PWAInstallButton />
    </>
  );
};

export default Landing;
