'use client';

import { Link2, Mail, Phone } from 'lucide-react';
import type { CompanySettings } from '@/types/company';

// ─── Props ─────────────────────────────────────────────
export interface FooterColumn {
  title: string;
  links: { label: string; href: string }[];
}

export interface FooterProps {
  company: CompanySettings;
  logoUrl?: string;
  description?: string;
  columns?: FooterColumn[];
}

// ─── Defaults ──────────────────────────────────────────
const defaultColumns: FooterColumn[] = [
  {
    title: 'Navegação',
    links: [
      { label: 'Diferenciais', href: '#diferenciais' },
      { label: 'Para quem é', href: '#publico' },
      { label: 'Programação', href: '#programacao' },
      { label: 'Instrutora', href: '#instrutor' },
    ],
  },
  {
    title: 'Recursos',
    links: [
      { label: 'Investimento', href: '#investimento' },
      { label: 'Material', href: '#folder' },
      { label: 'Inscrição', href: '#inscricao' },
      { label: 'Notificação', href: '#notificacao' },
    ],
  },
];

// ─── Component ────────────────────────────────────────
export default function Footer({
  company,
  logoUrl = '/logo-plenum-aberta2.png',
  description = 'Capacitação em gestão pública com foco em emendas parlamentares, compliance e prestação de contas.',
  columns = defaultColumns,
}: FooterProps) {
  const year = new Date().getFullYear();

  // Derive contact links from company data
  const websiteUrl = company.website || 'https://www.plenumbrasil.com.br';
  const emailHref = company.emails?.[0]?.email
    ? `mailto:${company.emails[0].email}`
    : 'mailto:contato@plenumbrasil.com.br';
  const whatsappNumber = company.phones?.find(p => p.label?.toLowerCase().includes('whatsapp'))?.number
    || company.phones?.[0]?.number
    || '553125311776';
  const whatsappHref = `https://wa.me/${whatsappNumber.replace(/\D/g, '')}`;

  return (
    <footer className="relative bg-[var(--ds-background-alt)] border-t border-white/[0.06] pt-16 pb-8 px-6 md:px-12">
      <div className="max-w-[1200px] mx-auto">
        {/* ── Top Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-16">
          {/* Logo + Description */}
          <div className="md:col-span-2">
            <img
              src={logoUrl}
              alt={company.company_name}
              className="h-8 w-auto object-contain opacity-90 mb-5"
            />
            <p className="text-white/40 text-sm leading-relaxed max-w-[360px]">
              {description}
            </p>
          </div>

          {/* Link Columns */}
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="font-[var(--font-bricolage)] text-sm font-bold text-white mb-4 uppercase tracking-wider">
                {col.title}
              </h4>
              <ul className="flex flex-col gap-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="text-white/40 text-sm hover:text-white transition-colors">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── Bottom Bar ── */}
        <div className="border-t border-white/[0.06] pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-xs">
            &copy; {year} {company.company_name}. Todos os direitos reservados.
          </p>

          <div className="flex items-center gap-3">
            <a
              href={websiteUrl}
              target="_blank"
              rel="noopener"
              className="w-9 h-9 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-white/40 hover:text-white hover:bg-white/[0.08] transition-colors"
              title="Website"
            >
              <Link2 className="w-4 h-4" />
            </a>
            <a
              href={emailHref}
              className="w-9 h-9 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-white/40 hover:text-white hover:bg-white/[0.08] transition-colors"
              title="E-mail"
            >
              <Mail className="w-4 h-4" />
            </a>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener"
              className="w-9 h-9 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-white/40 hover:text-white hover:bg-white/[0.08] transition-colors"
              title="WhatsApp"
            >
              <Phone className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
