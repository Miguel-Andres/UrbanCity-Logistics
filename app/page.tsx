import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/sections/Hero";
import TrustStats from "@/components/sections/TrustStats";
import Services from "@/components/sections/Services";
import HowItWorks from "@/components/sections/HowItWorks";
import CTASection from "@/components/sections/CTASection";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <TrustStats />
      <Services />
      <HowItWorks />
      <CTASection />
      <Footer />
    </div>
  );
}