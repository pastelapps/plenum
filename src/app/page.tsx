import Header from "@/components/sections/Header";
import Hero from "@/components/sections/Hero";
import Events from "@/components/sections/Events";
import Academy from "@/components/sections/Academy";
import SocialProof from "@/components/sections/SocialProof";
import Consultoria from "@/components/sections/Consultoria";
import Corporativa from "@/components/sections/Corporativa";
import BrasilInteiro from "@/components/sections/BrasilInteiro";
import Enderecos from "@/components/sections/Enderecos";
import Blog from "@/components/sections/Blog";
import Instagram from "@/components/sections/Instagram";
import Footer from "@/components/sections/Footer";
import { getInstagramPosts } from "@/lib/instagram";

export default async function Home() {
  const instagramPosts = await getInstagramPosts();

  return (
    <main className="text-[#030D1F] overflow-x-hidden">
      <Header />
      <Hero />

      {/* Conteúdo que sobe por cima da Hero (parallax) */}
      <div className="relative z-[5] bg-[#F1F1F1]">
        <Events />
        <Academy />
        <SocialProof />
        <Consultoria />
        <Corporativa />
        <BrasilInteiro />
        <Blog />
        <Instagram posts={instagramPosts} />
        <Enderecos />
        <Footer />
      </div>
    </main>
  );
}
