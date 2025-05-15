
import { useSmoothScrolling } from "@/components/landing/SmoothScrolling";
import Header from "@/components/landing/Header";
import HeroSection from "@/components/landing/HeroSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import CTASection from "@/components/landing/CTASection";
import FooterSection from "@/components/landing/FooterSection";

export const Landing = () => {
  // Enable smooth scrolling for anchor links
  useSmoothScrolling();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header/Navigation */}
      <Header />
      
      {/* Hero Section */}
      <HeroSection />
      
      {/* Features Section */}
      <FeaturesSection />
      
      {/* How It Works */}
      <HowItWorksSection />

      {/* Testimonials Section */}
      <TestimonialsSection />
      
      {/* CTA Section */}
      <CTASection />
      
      {/* Footer */}
      <FooterSection />
    </div>
  );
};

export default Landing;
