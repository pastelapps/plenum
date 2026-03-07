import Header from "@/components/sections/Header";
import Hero from "@/components/sections/Hero";
import Events from "@/components/sections/Events";
import Academy from "@/components/sections/Academy";
import SocialProof from "@/components/sections/SocialProof";
import Consultoria from "@/components/sections/Consultoria";
import Corporativa from "@/components/sections/Corporativa";
import Blog from "@/components/sections/Blog";
import Instagram from "@/components/sections/Instagram";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <main className="bg-[#F1F1F1] text-[#0D0D0D] overflow-x-hidden">
      <Header />
      <Hero />
      <Events />
      <Academy />
      <SocialProof />
      <Consultoria />
      <Corporativa />
      <Blog />
      <Instagram />
      <Footer />
    </main>
  );
}
