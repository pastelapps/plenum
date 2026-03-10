import {
  BookOpen,
  Users,
  TrendingUp,
  GraduationCap,
  ArrowUpRight,
  CalendarDays,
  MapPin,
  Info,
} from 'lucide-react';

// ── Mock data ──────────────────────────────────────────────────────────────
const KPI_CARDS = [
  {
    label:    'Cursos Ativos',
    value:    '8',
    sub:      '+2 este trimestre',
    icon:     BookOpen,
    trend:    'up',
    color:    'text-blue-600',
    bg:       'bg-blue-50',
    border:   'border-blue-100',
  },
  {
    label:    'Turmas Abertas',
    value:    '3',
    sub:      'Próxima em 14 dias',
    icon:     CalendarDays,
    trend:    'neutral',
    color:    'text-emerald-600',
    bg:       'bg-emerald-50',
    border:   'border-emerald-100',
  },
  {
    label:    'Leads este Mês',
    value:    '47',
    sub:      '+18% vs mês anterior',
    icon:     TrendingUp,
    trend:    'up',
    color:    'text-violet-600',
    bg:       'bg-violet-50',
    border:   'border-violet-100',
  },
  {
    label:    'Alunos Formados',
    value:    '284',
    sub:      'Total acumulado',
    icon:     GraduationCap,
    trend:    'up',
    color:    'text-amber-600',
    bg:       'bg-amber-50',
    border:   'border-amber-100',
  },
];

// Monthly enrollment data (last 6 months)
const CHART_DATA = [
  { label: 'Out', value: 32 },
  { label: 'Nov', value: 48 },
  { label: 'Dez', value: 28 },
  { label: 'Jan', value: 22 },
  { label: 'Fev', value: 51 },
  { label: 'Mar', value: 38 },
];

const UPCOMING_TURMAS = [
  { course: 'Gestão de Projetos do Zero ao Avançado', date: '24–26 Mar', location: 'Brasília, DF', status: 'Inscrições abertas' },
  { course: 'Liderança e Gestão de Pessoas',         date: '07–09 Abr', location: 'São Paulo, SP', status: 'Confirmada' },
  { course: 'Finanças para Gestores',                 date: '28–30 Abr', location: 'Rio de Janeiro, RJ', status: 'Em formação' },
];

const TOP_COURSES = [
  { name: 'Gestão de Projetos',    pct: 94 },
  { name: 'Liderança e Pessoas',   pct: 67 },
  { name: 'Finanças para Gestores', pct: 55 },
  { name: 'Agile & Scrum',         pct: 43 },
  { name: 'Power BI na Prática',   pct: 35 },
];

// ── Bar chart (pure SVG, no external deps) ─────────────────────────────────
const BAR_W  = 56;
const BAR_GAP = 22;
const CHART_H = 140;
const CHART_PAD_X = 48;
const CHART_PAD_Y = 12;
const CHART_W  = CHART_DATA.length * BAR_W + (CHART_DATA.length - 1) * BAR_GAP + CHART_PAD_X * 2;
const maxVal = Math.max(...CHART_DATA.map((d) => d.value));

function barX(i: number) { return CHART_PAD_X + i * (BAR_W + BAR_GAP); }
function barH(v: number) { return (v / maxVal) * CHART_H; }
function barY(v: number) { return CHART_PAD_Y + CHART_H - barH(v); }
const SVG_H = CHART_PAD_Y + CHART_H + 36; // +36 for labels

// ── Component ──────────────────────────────────────────────────────────────
export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Visão geral do sistema Plenum</p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-medium">
          <Info className="w-3.5 h-3.5" />
          Dados fictícios — em desenvolvimento
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {KPI_CARDS.map((k) => (
          <div key={k.label} className={`rounded-xl border p-5 ${k.border} bg-white`}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-500">{k.label}</span>
              <div className={`w-8 h-8 rounded-lg ${k.bg} flex items-center justify-center`}>
                <k.icon className={`w-4 h-4 ${k.color}`} />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{k.value}</p>
            <p className={`text-xs mt-1 flex items-center gap-1 ${k.trend === 'up' ? 'text-emerald-600' : 'text-gray-400'}`}>
              {k.trend === 'up' && <ArrowUpRight className="w-3 h-3" />}
              {k.sub}
            </p>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">

        {/* Bar chart — alunos por mês */}
        <div className="lg:col-span-3 bg-white border border-gray-100 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-gray-900">Alunos por Mês</h2>
              <p className="text-xs text-gray-400 mt-0.5">Matrículas confirmadas — últimos 6 meses</p>
            </div>
            <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-md">Out → Mar</span>
          </div>
          <svg
            viewBox={`0 0 ${CHART_W} ${SVG_H}`}
            className="w-full"
            aria-label="Gráfico de barras: alunos por mês"
          >
            {/* Horizontal grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((t) => {
              const y = CHART_PAD_Y + CHART_H * (1 - t);
              const val = Math.round(maxVal * t);
              return (
                <g key={t}>
                  <line x1={CHART_PAD_X - 8} y1={y} x2={CHART_W - 8} y2={y}
                    stroke="#f0f0f0" strokeWidth="1" />
                  <text x={CHART_PAD_X - 12} y={y + 4} textAnchor="end"
                    fontSize="9" fill="#aaa">{val}</text>
                </g>
              );
            })}

            {/* Bars */}
            {CHART_DATA.map((d, i) => {
              const x = barX(i);
              const h = barH(d.value);
              const y = barY(d.value);
              const isMax = d.value === maxVal;
              return (
                <g key={d.label}>
                  <rect
                    x={x} y={y} width={BAR_W} height={h}
                    rx="6" ry="6"
                    fill={isMax ? '#3b82f6' : '#bfdbfe'}
                  />
                  {/* Value label on top */}
                  <text x={x + BAR_W / 2} y={y - 5} textAnchor="middle"
                    fontSize="10" fontWeight="600" fill={isMax ? '#1d4ed8' : '#60a5fa'}>
                    {d.value}
                  </text>
                  {/* Month label */}
                  <text x={x + BAR_W / 2} y={SVG_H - 4} textAnchor="middle"
                    fontSize="10" fill="#9ca3af">
                    {d.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Top courses horizontal bars */}
        <div className="lg:col-span-2 bg-white border border-gray-100 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-1">Cursos Mais Procurados</h2>
          <p className="text-xs text-gray-400 mb-4">% de leads por curso</p>
          <div className="space-y-3">
            {TOP_COURSES.map((c, i) => (
              <div key={c.name}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-600 truncate pr-2">{c.name}</span>
                  <span className="text-xs font-semibold text-gray-800 shrink-0">{c.pct}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${c.pct}%`,
                      background: i === 0 ? '#3b82f6' : i === 1 ? '#6366f1' : '#a5b4fc',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Upcoming turmas */}
      <div className="bg-white border border-gray-100 rounded-xl p-5">
        <h2 className="text-sm font-semibold text-gray-900 mb-4">Próximas Turmas</h2>
        <div className="divide-y divide-gray-50">
          {UPCOMING_TURMAS.map((t) => (
            <div key={t.course} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{t.course}</p>
                <div className="flex items-center gap-3 mt-0.5">
                  <span className="flex items-center gap-1 text-xs text-gray-400">
                    <CalendarDays className="w-3 h-3" />{t.date}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-gray-400">
                    <MapPin className="w-3 h-3" />{t.location}
                  </span>
                </div>
              </div>
              <span className={`ml-4 shrink-0 text-xs px-2.5 py-1 rounded-full font-medium ${
                t.status === 'Inscrições abertas' ? 'bg-emerald-50 text-emerald-700' :
                t.status === 'Confirmada'          ? 'bg-blue-50 text-blue-700' :
                                                     'bg-amber-50 text-amber-700'
              }`}>
                {t.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Users distribution placeholder */}
      <div className="bg-white border border-gray-100 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-4 h-4 text-gray-400" />
          <h2 className="text-sm font-semibold text-gray-900">Leads por Estado</h2>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {[
            { uf: 'DF', v: 38 }, { uf: 'SP', v: 27 }, { uf: 'RJ', v: 18 },
            { uf: 'MG', v: 14 }, { uf: 'GO', v: 11 }, { uf: 'Outros', v: 9 },
          ].map((s) => (
            <div key={s.uf} className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-bold text-gray-800">{s.uf}</span>
              <span className="text-xs text-gray-400 mt-0.5">{s.v} leads</span>
              <div className="w-full h-1.5 bg-gray-200 rounded-full mt-2 overflow-hidden">
                <div className="h-full bg-blue-400 rounded-full" style={{ width: `${(s.v / 38) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
