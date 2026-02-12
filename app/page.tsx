import { Hero } from "./components/Hero";
import { Features } from "./components/Features";
import { WhyTaskGenius } from "./components/FAQPage";
import { CTA } from "./components/CTA";

export default function Home() {
  return (
    <>
      <Hero />
      <Features />
      <WhyTaskGenius />
      <CTA />
    </>
  );
}
