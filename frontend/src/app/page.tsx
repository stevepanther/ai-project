import { HeroSection } from "@/components/custom/hero-section";
import { FeatureSection } from "@/components/custom/features-section";
import { getHomePageData } from "@/data/loader";

export default async function Home() {
  const strapiData = await getHomePageData();
  const {blocks} = strapiData?.data || [];
  return <main className="" >{blocks.map(blockRenderer)}</main>
}

const blockComponents = {
  "layout.hero-section": HeroSection,
  "layout.feature-section": FeatureSection,
};

function blockRenderer(block: any) {
  const Component = blockComponents[block.__component as keyof typeof blockComponents];
  return Component ? <Component key={block.id} data={block} /> : null
}