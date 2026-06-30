import { CONTACT } from "@/lib/plenum-content";
import WhatsAppIcon from "@/components/icons/WhatsAppIcon";

export default function WhatsAppFloat() {
  return (
    <a
      href={CONTACT.whatsappHref}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar no WhatsApp"
      className="group fixed bottom-5 right-5 z-[60] flex items-center"
    >
      {/* Label que expande no hover (desktop) */}
      <span className="mr-3 hidden max-w-0 overflow-hidden whitespace-nowrap rounded-full bg-[#0a1c2e] px-0 py-2.5 text-sm font-medium text-white opacity-0 shadow-lg transition-all duration-300 group-hover:max-w-[200px] group-hover:px-4 group-hover:opacity-100 lg:block">
        Fale com a Plenum
      </span>

      <span className="relative flex h-14 w-14 items-center justify-center">
        {/* anel pulsante */}
        <span className="absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-60 animate-ping motion-reduce:hidden" />
        {/* botão */}
        <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_10px_30px_rgba(37,211,102,0.45)] ring-1 ring-white/20 transition-transform duration-300 group-hover:scale-105 group-active:scale-95">
          <WhatsAppIcon className="h-7 w-7" />
        </span>
      </span>
    </a>
  );
}
