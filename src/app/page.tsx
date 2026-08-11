import { AboutSection } from "@/components/AboutSection";
import { DealsSection } from "@/components/DealsSection";
import { Hero } from "@/components/Hero";
import { ProcessSection } from "@/components/ProcessSection";
import { ReviewsSection } from "@/components/ReviewsSection";
import { SellerCta } from "@/components/SellerCta";
import { ServicesSection } from "@/components/ServicesSection";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { curatedDeals } from "@/data/curated-deals";

/** Спокойный кадр для солидной обложки (дом), не первый пост ленты. */
const HERO_IMAGE = "/photos/deals/molzino-dom.png";

export default function HomePage() {
  return (
    <div id="top">
      <SiteHeader />
      <main>
        <Hero imageSrc={HERO_IMAGE} />
        <DealsSection deals={curatedDeals} />
        <AboutSection />
        <ServicesSection />
        <ProcessSection />
        <ReviewsSection />
        <SellerCta />
      </main>
      <SiteFooter />
    </div>
  );
}
