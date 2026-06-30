import Header from "@/components/sections/Header";
import Hero from "@/components/sections/Hero";
import Events from "@/components/sections/Events";
import Academy from "@/components/sections/Academy";
import SocialProof from "@/components/sections/SocialProof";
import GovTechHome from "@/components/sections/GovTechHome";
import EducaPublicaHome from "@/components/sections/EducaPublicaHome";
import Consultoria from "@/components/sections/Consultoria";
import AlumniHome from "@/components/sections/AlumniHome";
import Blog from "@/components/sections/Blog";
import Instagram from "@/components/sections/Instagram";
import Enderecos from "@/components/sections/Enderecos";
import WhatsappFinal from "@/components/sections/WhatsappFinal";
import Footer from "@/components/sections/Footer";
import { getInstagramPosts } from "@/lib/instagram";

export default async function Home() {
  const instagramPosts = await getInstagramPosts();

  return (
    <main className="text-[#030D1F] overflow-x-hidden">
      <Header />
      <Hero />

      <div className="relative z-[5] bg-[#F1F1F1]">
        <Events />
        <Academy />
        <SocialProof />
        <GovTechHome />
        <EducaPublicaHome />
        <Consultoria />
        <AlumniHome />
        <Blog />
        <Instagram posts={instagramPosts} />
        <Enderecos />
        <WhatsappFinal />
        <Footer />
      </div>
    </main>
  );
}
