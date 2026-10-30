import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { Search, Refrigerator, Laptop, Wrench, Tv, Wind, ChefHat, ArrowRight } from 'lucide-react';
import Layout from '@/components/Layout';
import { segments } from '@/data/products';

const segmentIcons = {
  eletrodomesticos: Refrigerator,
  informatica: Laptop,
  ferramentas: Wrench,
  eletronicos: Tv,
  climatizacao: Wind,
  cozinha: ChefHat,
};

export default function HomePage() {
  const [term, setTerm] = useState('');
  const navigate = useNavigate();

  const go = (e) => {
    e.preventDefault();
    navigate(`/produtos?q=${encodeURIComponent(term)}`);
  };

  return (
    <Layout>
      <Helmet>
        <title>GMONEY Consultoria | Especificações técnicas de produtos</title>
        <meta name="description" content="Compare especificações técnicas de eletrodomésticos, informática, ferramentas e eletrônicos antes de comprar." />
      </Helmet>

      <section className="mx-auto max-w-[64rem] px-5 pt-16 pb-10 text-center sm:pt-20">
        <p className="text-xs uppercase tracking-[0.4em] text-neutral-500">Consultoria de compra</p>
        <h1 className="mt-5 text-4xl font-black leading-[1.05] text-[#D4AF37] sm:text-6xl">
          A ficha técnica antes<br className="hidden sm:block" /> da decisão de compra
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-base text-neutral-400 sm:text-lg">
          Consulte tipo, capacidade, peso, consumo de energia e garantia dos produtos mais buscados —
          organizados por marca e fabricante.
        </p>

        <form onSubmit={go} className="mx-auto mt-10 flex max-w-xl items-center gap-2 rounded-full border border-[#D4AF37]/40 bg-neutral-950/80 px-4 py-2 focus-within:border-[#D4AF37]">
          <Search className="h-5 w-5 shrink-0 text-[#D4AF37]" strokeWidth={1.75} />
          <input
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="Buscar: geladeira, fogão, ventilador, lavadora..."
            className="min-h-[44px] w-full bg-transparent text-neutral-200 placeholder:text-neutral-600 outline-none"
          />
          <button type="submit" className="min-h-[44px] rounded-full bg-[#D4AF37] px-5 text-sm font-semibold text-black transition hover:bg-[#e6c352] active:scale-[0.98]">
            Buscar
          </button>
        </form>

        <div className="mt-4 flex flex-wrap justify-center gap-2 text-xs text-neutral-500">
          {['geladeira', 'fogão', 'ventilador', 'lavadora', 'notebook'].map((s) => (
            <button key={s} onClick={() => navigate(`/produtos?q=${s}`)} className="rounded-full border border-neutral-800 px-3 py-1 transition hover:border-[#D4AF37]/50 hover:text-[#D4AF37]">
              {s}
            </button>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[72rem] px-5 py-10 sm:py-14">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-sm uppercase tracking-[0.3em] text-neutral-500">Buscar por segmento</h2>
          <span className="hidden text-xs text-neutral-600 sm:block">Escolha uma categoria para ver os produtos</span>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {segments.map((s) => {
            const Icon = segmentIcons[s.id] || Search;
            return (
              <button
                key={s.id}
                onClick={() => navigate(`/produtos?segmento=${s.id}`)}
                className="group flex min-h-[84px] items-center gap-4 rounded-xl border border-neutral-900 bg-neutral-950/70 px-5 py-4 text-left transition hover:border-[#D4AF37]/60 hover:bg-neutral-900/60 active:scale-[0.99]"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-[#D4AF37]/30 bg-[#D4AF37]/5 text-[#D4AF37] transition group-hover:border-[#D4AF37]/60 group-hover:bg-[#D4AF37]/10">
                  <Icon className="h-5 w-5" strokeWidth={1.75} />
                </span>
                <span className="flex flex-1 flex-col">
                  <span className="text-lg font-semibold text-neutral-200 group-hover:text-[#D4AF37]">{s.nome}</span>
                  <span className="text-xs text-neutral-500">Ver produtos desta categoria</span>
                </span>
                <ArrowRight className="h-5 w-5 shrink-0 text-neutral-600 transition group-hover:text-[#D4AF37]" strokeWidth={1.75} />
              </button>
            );
          })}
        </div>
      </section>
    </Layout>
  );
}
