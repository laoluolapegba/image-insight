import LandingNavbar from "@/components/landing/LandingNavbar";
import HeroSection from "@/components/landing/HeroSection";
import FeatureSection from "@/components/landing/FeatureSection";
import SecondaryVisual from "@/components/landing/SecondaryVisual";
import ComingSoonSection from "@/components/landing/ComingSoonSection";
import FAQSection from "@/components/landing/FAQSection";
import Footer from "@/components/landing/Footer";

export default function LandingPage() {
    return (
        <>
            <LandingNavbar />
            <main className="min-h-screen bg-white">
                <HeroSection />
                <FeatureSection />
                <SecondaryVisual />
                <ComingSoonSection />
                <FAQSection />
            </main>
            <Footer />
        </>
    );
}
