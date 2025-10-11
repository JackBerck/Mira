import { FeaturesSection } from "@/components/home/features"
import { HeroSection } from "@/components/home/hero"
import Layout from "@/layouts"
import { AboutSection } from "./about"
import { CategoriesSection } from "./categories"
import { PopularIdeasSection } from "./popular-ideas"
import { CtaSection } from "./cta"

export default function Home() {
  return (
    <Layout>
      <HeroSection />
      <FeaturesSection />
      <AboutSection />
      <CategoriesSection />
      <PopularIdeasSection />
    <CtaSection />
    </Layout>
  )
}
