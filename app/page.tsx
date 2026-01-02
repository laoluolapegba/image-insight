import HeroSection from "@/components/landing/HeroSection";
import FeatureSection from "@/components/landing/FeatureSection";
import ComingSoonSection from "@/components/landing/ComingSoonSection";
import FAQSection from "@/components/landing/FAQSection";
import Footer from "@/components/landing/Footer";

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col">
            <HeroSection />
            <FeatureSection />
            <ComingSoonSection />
            <FAQSection />
            <Footer />
        </main>
    );
}
