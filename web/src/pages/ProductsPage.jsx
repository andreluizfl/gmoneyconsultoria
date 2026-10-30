import React, { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Search, ArrowRight, Package } from 'lucide-react';
import Layout from '@/components/Layout';
import { segments } from '@/data/products';
import { fetchProducts, groupByBrand, productImageUrl } from '@/lib/productStore';

export default function ProductsPage() {
  const [params] = useSearchParams();
  const q = params.get('q') || '';
  const segmento = params.get('segmento') || '';

  const [term, setTerm] = useState(q);
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);

    fetchProducts({ q, segmento })
      .then(setItems)
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [q, segmento]);

  const total = items.length;
  const segNome = segments.find((s) => s.id === segmento)?.nome;
  const grupos = useMemo(() => groupByBrand(items), [items]);
  const searchMode = q.trim().length > 0;

  return (
    <Layout>
      <Helmet>
        <title>Produtos por marca | GMONEY Consultoria</title>
        <meta
          name="description"
          content="Resultados de busca de produtos organizados por marca e fabricante, com especificações técnicas."
        />
      </Helmet>

      {/* CABEÇALHO DOS RESULTADOS */}
      <section className="mx-auto max-w-[72rem] px-5 pt-10">
        <Link
          to="/"
          className="mb-6 inline-flex min-h-[40px] items-center gap-2 rounded-lg border border-[#D4AF37]/50 px-4 py-2 text-sm font-semibold uppercase tracking-wide text-[#D4AF37] transition hover:bg-[#D4AF37] hover:text-black active:scale-[0.98]"
        >
          <span aria-hidden>←</span>
          Voltar
        </Link>

        <p className="text-xs uppercase tracking-[0.35em] text-neutral-500">
          Resultados
        </p>

        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <h1 className="text-3xl font-black text-[#D4AF37] sm:text-4xl">
            {q ? `Busca: ${q}` : segNome || 'Todos os produtos'}
          </h1>

          <p className="text-sm text-neutral-500">
            {loading ? 'Carregando...' : `${total} produto(s) encontrado(s)`}
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            navigate(`/produtos?q=${encodeURIComponent(term)}`);
          }}
          className="mt-5 flex max-w-lg items-center gap-2 rounded-full border border-[#D4AF37]/40 bg-neutral-950/80 px-4 py-2"
        >
          <Search
            className="h-5 w-5 shrink-0 text-[#D4AF37]"
            strokeWidth={1.75}
          />

          <input
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="Refinar busca"
            className="min-h-[44px] w-full bg-transparent text-neutral-200 placeholder:text-neutral-600 outline-none"
          />
        </form>
      </section>

      {/* LISTAGEM */}
      <section className="mx-auto max-w-[72rem] px-5 py-8">

        {/* CARREGANDO */}
        {loading && (
          <div className="divide-y divide-neutral-900 border-y border-neutral-900">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="flex items-center gap-4 py-3"
                style={{ animation: 'pulse 2s infinite' }}
              >
                <div className="h-20 w-24 shrink-0 rounded-lg bg-neutral-900" />

                <div className="flex-1 space-y-2">
                  <div className="h-4 w-2/3 rounded bg-neutral-900" />
                  <div className="h-3 w-1/2 rounded bg-neutral-900/70" />
                </div>

                <div className="hidden h-9 w-36 rounded-full bg-neutral-900 sm:block" />
              </div>
            ))}
          </div>
        )}

        {/* SEM RESULTADOS */}
        {!loading && total === 0 && (
          <div className="rounded-xl border border-neutral-900 bg-neutral-950/70 p-10 text-center">
            <p className="text-neutral-400">
              Nenhum produto encontrado para essa busca.
            </p>

            <Link
              to="/"
              className="mt-4 inline-block text-sm text-[#D4AF37] underline underline-offset-4"
            >
              Voltar à busca
            </Link>
          </div>
        )}

        {/* RESULTADOS */}
        {!loading && total > 0 && (
          <>
            {searchMode ? (
              /* BUSCA ESPECÍFICA: lista única, sem separar por marca */
              <div className="divide-y divide-neutral-900 border-y border-neutral-900">
                {items.map((p) => {
                  const thumb = productImageUrl(
                    p,
                    p.images && p.images[0],
                  );

                  return (
                    <div
                      key={p.id}
                      className="group flex flex-col gap-3 py-3 transition sm:flex-row sm:items-center sm:gap-4"
                    >
                      <Link
                        to={`/produto/${p.id}`}
                        className="flex h-24 w-full shrink-0 items-center justify-center overflow-hidden rounded-lg border border-neutral-900 bg-neutral-950 transition group-hover:border-[#D4AF37]/40 sm:h-20 sm:w-28"
                      >
                        {thumb ? (
                          <img
                            src={thumb}
                            alt={p.nome}
                            className="h-full w-full object-contain"
                          />
                        ) : (
                          <div className="flex flex-col items-center gap-1.5 text-neutral-700">
                            <Package
                              className="h-6 w-6"
                              strokeWidth={1.25}
                            />
                            <span className="max-w-[90px] truncate text-[9px] uppercase tracking-widest">
                              {p.categoria || 'Produto'}
                            </span>
                          </div>
                        )}
                      </Link>

                      <div className="min-w-0 flex-1 lg:max-w-[520px]">
                        <Link
                          to={`/produto/${p.id}`}
                          className="text-base font-semibold leading-snug text-neutral-100 transition hover:text-[#D4AF37]"
                        >
                          {p.nome}
                        </Link>

                        {p.resumo && (
                          <p className="mt-1 line-clamp-1 text-sm text-neutral-500">
                            {p.resumo}
                          </p>
                        )}

                        <p className="mt-1 text-xs font-medium uppercase tracking-wider text-neutral-500 sm:hidden">
                          Venha conferir
                        </p>
                      </div>

                      <div className="flex shrink-0 items-center justify-between gap-3 sm:ml-auto sm:justify-end">
                        <span className="hidden text-xs font-medium uppercase tracking-wider text-neutral-500 md:block">
                          Venha conferir
                        </span>

                        <Link
                          to={`/produto/${p.id}`}
                          className="inline-flex min-h-[40px] items-center gap-2 rounded-full border border-[#D4AF37]/50 bg-[#D4AF37]/5 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-[#D4AF37] transition hover:bg-[#D4AF37] hover:text-black active:scale-[0.98]"
                        >
                          Ver ficha técnica
                          <ArrowRight
                            className="h-3.5 w-3.5"
                            strokeWidth={2}
                          />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* SEGMENTO / TODOS OS PRODUTOS: separados por marca */
              <div className="space-y-8">
                {grupos.map(([marca, itens]) => (
                  <div key={marca}>
                    <div className="mb-2 flex items-center gap-4">
                      <h2 className="text-lg font-bold uppercase tracking-wide text-[#D4AF37]">
                        {marca}
                      </h2>

                      <span className="h-px flex-1 bg-[#D4AF37]/20" />

                      <span className="text-xs text-neutral-500">
                        {itens.length} item(ns)
                      </span>
                    </div>

                    <div className="divide-y divide-neutral-900 border-y border-neutral-900">
                      {itens.map((p) => {
                        const thumb = productImageUrl(
                          p,
                          p.images && p.images[0],
                        );

                        return (
                          <div
                            key={p.id}
                            className="group flex flex-col gap-3 py-3 transition sm:flex-row sm:items-center sm:gap-4"
                          >
                            <Link
                              to={`/produto/${p.id}`}
                              className="flex h-24 w-full shrink-0 items-center justify-center overflow-hidden rounded-lg border border-neutral-900 bg-neutral-950 transition group-hover:border-[#D4AF37]/40 sm:h-20 sm:w-28"
                            >
                              {thumb ? (
                                <img
                                  src={thumb}
                                  alt={p.nome}
                                  className="h-full w-full object-contain"
                                />
                              ) : (
                                <div className="flex flex-col items-center gap-1.5 text-neutral-700">
                                  <Package
                                    className="h-6 w-6"
                                    strokeWidth={1.25}
                                  />
                                  <span className="max-w-[90px] truncate text-[9px] uppercase tracking-widest">
                                    {p.categoria || 'Produto'}
                                  </span>
                                </div>
                              )}
                            </Link>

                            <div className="min-w-0 flex-1 lg:max-w-[520px]">
                              <Link
                                to={`/produto/${p.id}`}
                                className="text-base font-semibold leading-snug text-neutral-100 transition hover:text-[#D4AF37]"
                              >
                                {p.nome}
                              </Link>

                              {p.resumo && (
                                <p className="mt-1 line-clamp-1 text-sm text-neutral-500">
                                  {p.resumo}
                                </p>
                              )}

                              <p className="mt-1 text-xs font-medium uppercase tracking-wider text-neutral-500 sm:hidden">
                                Venha conferir
                              </p>
                            </div>

                            <div className="flex shrink-0 items-center justify-between gap-3 sm:ml-auto sm:justify-end">
                              <span className="hidden text-xs font-medium uppercase tracking-wider text-neutral-500 md:block">
                                Venha conferir
                              </span>

                              <Link
                                to={`/produto/${p.id}`}
                                className="inline-flex min-h-[40px] items-center gap-2 rounded-full border border-[#D4AF37]/50 bg-[#D4AF37]/5 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-[#D4AF37] transition hover:bg-[#D4AF37] hover:text-black active:scale-[0.98]"
                              >
                                Ver ficha técnica
                                <ArrowRight
                                  className="h-3.5 w-3.5"
                                  strokeWidth={2}
                                />
                              </Link>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

      </section>
    </Layout>
  );
}