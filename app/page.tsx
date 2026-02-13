import { Hero } from "./components/Hero";
import { Features } from "./components/Features";
import { WhyTaskGenius } from "./components/FAQPage";
import { CTA } from "./components/CTA";
import Navbar from "./components/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Features />
      <WhyTaskGenius />
      <CTA />
    </>
  );
}
