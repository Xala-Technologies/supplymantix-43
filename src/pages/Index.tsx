
import Hero3D from "@/components/ui/hero";
import Header from "@/components/landing/Header";
import FeaturesSection from "@/components/landing/FeaturesSection";
import BenefitsSection from "@/components/landing/BenefitsSection";
import CTASection from "@/components/landing/CTASection";
import Footer from "@/components/landing/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="pt-16">
        <Hero3D />
        <FeaturesSection />
        <BenefitsSection />
        <CTASection />
        <Footer />
      </div>
    </div>
  );
};

export default Index;
