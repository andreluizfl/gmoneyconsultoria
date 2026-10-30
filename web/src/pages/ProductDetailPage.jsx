import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ExternalLink, Package } from 'lucide-react';
import Layout from '@/components/Layout';
import { fetchProduct, productImageUrls } from '@/lib/productStore';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [foto, setFoto] = useState(0);

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    setFoto(0);

    fetchProduct(id)
      .then((rec) => {
        setProduct(rec);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <section className="mx-auto max-w-[80rem] px-5 py-16">
          <p className="text-sm text-neutral-500">Carregando produto...</p>
        </section>
      </Layout>
    );
  }

  if (notFound || !product) {
    return (
      <Layout>
        <Helmet>
          <title>Produto não encontrado | GMONEY Consultoria</title>
        </Helmet>

        <section className="mx-auto max-w-[80rem] px-5 py-16">
          <h1 className="text-2xl font-bold text-[#D4AF37]">
            Produto não encontrado
          </h1>

          <Link
            to="/"
            className="mt-6 inline-flex min-h-[40px] items-center gap-2 rounded-lg border border-[#D4AF37]/50 px-4 py-2 text-sm font-semibold uppercase tracking-wide text-[#D4AF37] transition hover:bg-[#D4AF37] hover:text-black"
          >
            ← Voltar ao início
          </Link>
        </section>
      </Layout>
    );
  }

  const displayImages = productImageUrls(product);
  const activeFoto = Math.min(
    foto,
    Math.max(displayImages.length - 1, 0),
  );

  // specs e links são campos JSON no PocketBase.
  // Normalmente chegam como array, mas também aceita string JSON.
  const parseJsonArray = (value) => {
    if (Array.isArray(value)) return value;

    if (typeof value === 'string' && value.trim()) {
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }

    return [];
  };

  const specs = parseJsonArray(product.specs).filter(
    (s) => s && (s.nome || s.valor),
  );

  // Garante que cada link tenha nome da plataforma e URL separados.
  const links = parseJsonArray(product.links)
    .map((l) => {
      if (!l) return null;

      let loja = (l.loja || '').trim();
      let url = (l.url || '').trim();

      const isUrl = (value) =>
        value.startsWith('http://') || value.startsWith('https://');

      if (loja && !url && isUrl(loja)) {
        url = loja;
        loja = '';
      }

      if (loja && url && loja.includes(url)) {
        loja = loja.replace(url, '').trim();
      }

      if (!loja && url) {
        try {
          loja = new URL(url).hostname.replace(/^www\./, '');
        } catch {
          loja = 'Loja';
        }
      }

      return { loja, url };
    })
    .filter((l) => l && (l.loja || l.url));

  return (
    <Layout>
      <Helmet>
        <title>{`${product.nome} | GMONEY Consultoria`}</title>

        <meta
          name="description"
          content={`Especificações técnicas de ${product.nome}${
            product.marca ? ` da marca ${product.marca}` : ''
          }: ${product.resumo || ''}`}
        />
      </Helmet>

      {/* BOTÃO VOLTAR */}
      <section className="mx-auto max-w-[80rem] px-5 pt-10">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex min-h-[40px] items-center gap-2 rounded-lg border border-[#D4AF37]/50 px-4 py-2 text-sm font-semibold uppercase tracking-wide text-[#D4AF37] transition hover:bg-[#D4AF37] hover:text-black active:scale-[0.98]"
        >
          <span aria-hidden>←</span>
          Voltar
        </button>
      </section>

      {/* Produto -> Ficha -> Onde comprar */}
      <section className="mx-auto mt-8 grid max-w-[80rem] gap-8 px-5 lg:grid-cols-[3fr_4fr_3fr] lg:items-start">

        {/* COLUNA 1 — PRODUTO */}
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-neutral-500">
            Produto
          </p>

          <div className="mt-4 flex aspect-square w-full items-center justify-center overflow-hidden rounded-2xl border border-neutral-900 bg-neutral-950">
            {displayImages.length > 0 ? (
              <img
                src={displayImages[activeFoto]}
                alt={`${product.nome} foto ${activeFoto + 1}`}
                className="h-full w-full object-contain"
              />
            ) : (
              <div className="flex flex-col items-center gap-3 text-neutral-700">
                <Package className="h-12 w-12" strokeWidth={1} />

                <span className="text-center text-xs uppercase tracking-[0.3em]">
                  Sem imagem cadastrada
                </span>
              </div>
            )}
          </div>

          {displayImages.length > 1 && (
            <div className="mt-3 flex flex-wrap gap-3">
              {displayImages.map((url, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setFoto(i)}
                  className={`h-16 w-16 overflow-hidden rounded-lg border transition ${
                    i === activeFoto
                      ? 'border-[#D4AF37]'
                      : 'border-neutral-900 hover:border-neutral-700'
                  }`}
                >
                  <img
                    src={url}
                    alt={`Miniatura ${i + 1}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* COLUNA 2 — FICHA TÉCNICA */}
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-neutral-500">
            Ficha técnica
          </p>

          <p className="mt-4 text-xs uppercase tracking-[0.3em] text-neutral-500">
            {product.marca}
            {product.categoria ? ` · ${product.categoria}` : ''}
          </p>

          <h1 className="mt-2 text-3xl font-black text-[#D4AF37] sm:text-4xl">
            {product.nome}
          </h1>

          {product.resumo && (
            <p className="mt-4 text-base leading-relaxed text-neutral-300">
              {product.resumo}
            </p>
          )}

          <h2 className="mt-8 text-sm uppercase tracking-[0.3em] text-neutral-500">
            Especificações técnicas
          </h2>

          <dl className="mt-4 divide-y divide-neutral-900 border-y border-neutral-900">
            {specs.map((s, i) => (
              <div
                key={i}
                className="flex justify-between gap-6 py-3 text-sm"
              >
                <dt className="text-neutral-500">{s.nome}</dt>

                <dd className="text-right font-medium text-neutral-100">
                  {s.valor}
                </dd>
              </div>
            ))}

            {specs.length === 0 && (
              <div className="py-3 text-sm text-neutral-600">
                Sem especificações cadastradas.
              </div>
            )}
          </dl>
        </div>

        {/* COLUNA 3 — ONDE COMPRAR */}
        <aside>
          <p className="text-xs uppercase tracking-[0.35em] text-neutral-500">
            Onde comprar
          </p>

          <p className="mt-4 text-sm leading-relaxed text-neutral-500">
            Consulte o valor atualizado diretamente em cada loja.
          </p>

          <div className="mt-5 flex flex-col gap-3">
            {links.map((l, i) => (
              <a
                key={i}
                href={l.url || '#'}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="flex min-h-[48px] items-center justify-between gap-3 rounded-lg border border-[#D4AF37]/50 px-4 text-sm font-semibold text-[#D4AF37] transition hover:bg-[#D4AF37] hover:text-black active:scale-[0.98]"
              >
                <span className="truncate">{l.loja}</span>

                <ExternalLink
                  className="h-4 w-4 shrink-0"
                  strokeWidth={1.75}
                />
              </a>
            ))}

            {links.length === 0 && (
              <p className="text-sm text-neutral-600">
                Sem links de compra cadastrados.
              </p>
            )}
          </div>

          <p className="mt-4 text-[11px] leading-relaxed text-neutral-600">
            Valores e disponibilidade são informados pelas próprias lojas e podem variar. Links podem gerar comissão para a GMONEY Consultoria sem custo adicional para você.
          </p>
        </aside>
      </section>

      {/* CONSIDERAÇÕES FINAIS */}
      {product.consideracoes && (
        <section className="mx-auto mt-14 max-w-[80rem] px-5">
          <div className="rounded-2xl border border-neutral-900 bg-neutral-950/70 p-6 sm:p-8">
            <h2 className="text-sm uppercase tracking-[0.3em] text-neutral-500">
              Considerações finais:
            </h2>

            <p className="mt-4 max-w-3xl text-base leading-relaxed text-neutral-300">
              {product.consideracoes}
            </p>
          </div>
        </section>
      )}
    </Layout>
  );
}