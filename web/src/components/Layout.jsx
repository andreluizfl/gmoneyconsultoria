import React, { createContext, useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Gift } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';

const WatermarkContext = createContext({ on: true, toggle: () => {} });
export const useWatermark = () => useContext(WatermarkContext);

const GIFT_CATEGORY = '__gift_banner__';
const GIFT_ACTIVE = '__gift_active__';

function parseJsonArray(value) {
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
}

function useLogo() {
  const [logoUrl, setLogoUrl] = useState(null);

  useEffect(() => {
    function load() {
      pb.collection('site_assets')
        .getFirstListItem('key = "logo"', {
          requestKey: 'layout-logo-load',
        })
        .then((rec) => setLogoUrl(pb.files.getURL(rec, rec.image)))
        .catch(() => setLogoUrl(null));
    }

    load();
    window.addEventListener('logo-updated', load);

    return () => window.removeEventListener('logo-updated', load);
  }, []);

  return logoUrl;
}

export function Logo({ className = '' }) {
  const logoUrl = useLogo();

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <Link
        to="/"
        className="inline-flex min-h-[220px] items-center gap-4 sm:min-h-[245px] sm:gap-6"
      >
        <img
          src={logoUrl || '/logo.png'}
          alt="Logomarca GMONEY Consultoria"
          className="h-80 w-auto max-w-[800px] shrink-0 object-contain sm:h-96 sm:max-w-[920px]"
        />

        <span className="inline-flex items-baseline gap-4 self-center">
          <span className="text-5xl font-black leading-none tracking-tight text-[#D4AF37] sm:text-7xl">
            GMONEY
          </span>

          <span className="text-sm uppercase tracking-[0.38em] text-neutral-400 sm:text-base">
            Consultoria
          </span>
        </span>
      </Link>
    </div>
  );
}

function GiftBanner() {
  const logoUrl = useLogo();
  const [gifts, setGifts] = useState([]);
  const [slideIndex, setSlideIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadGifts() {
      setLoading(true);

      try {
        const list = await pb.collection('products').getFullList({
          filter: `categoria = "${GIFT_CATEGORY}"`,
          sort: '-created',
          requestKey: 'footer-gift-banners-load',
        });

        if (!mounted) return;

        const activeGifts = list.filter((item) =>
          (item.keywords || '').includes(GIFT_ACTIVE),
        );

        setGifts(activeGifts);
        setSlideIndex(0);
      } catch {
        if (mounted) {
          setGifts([]);
          setSlideIndex(0);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadGifts();

    return () => {
      mounted = false;
    };
  }, []);

  /*
   * CICLO:
   *
   * 1 - LOGOMARCA
   * 2 - SUGESTÃO DE PRESENTE
   * 3 - FOTO + NOME + DESCRIÇÃO
   * 4 - SEGUNDA FOTO
   *
   * Depois volta para a LOGOMARCA.
   */

  const slides = [];

  if (gifts.length > 0) {
    gifts.forEach((gift) => {
      slides.push({
        type: 'logo',
        id: `logo-${gift.id}`,
      });

      slides.push({
        type: 'message',
        id: `message-${gift.id}`,
      });

      slides.push({
        type: 'product',
        id: `product-${gift.id}`,
        gift,
      });

      slides.push({
        type: 'image',
        id: `image-2-${gift.id}`,
        gift,
      });
    });
  } else {
    slides.push({
      type: 'message',
      id: 'message-empty',
    });
  }

  /*
   * TEMPOS:
   *
   * Logo: 4 segundos
   * Sugestão: 2 segundos
   * Produto + informações: 6 segundos
   * Segunda imagem: 4 segundos
   */

  useEffect(() => {
    if (slides.length <= 1) return undefined;

    const currentSlide = slides[slideIndex];

    let duration = 2000;

    if (currentSlide?.type === 'message') {
      duration = 2000;
    }

    if (currentSlide?.type === 'product') {
      duration = 6000;
    }

    const timer = window.setTimeout(() => {
      setSlideIndex((current) => (current + 1) % slides.length);
    }, duration);

    return () => window.clearTimeout(timer);
  }, [slideIndex, slides.length]);

  const current = slides[slideIndex] || slides[0];

  if (loading) {
    return (
      <div className="flex min-h-[210px] w-full max-w-[360px] items-center justify-center rounded-2xl border border-[#D4AF37]/25 bg-neutral-950/80 p-6">
        <span className="text-xs uppercase tracking-[0.3em] text-neutral-600">
          Carregando sugestão...
        </span>
      </div>
    );
  }

  /*
   * 1 - LOGOMARCA
   */

  if (current?.type === 'logo') {
    return (
      <div className="h-[230px] w-full max-w-[360px] overflow-hidden rounded-2xl border border-[#D4AF37]/25 bg-black">
        <img
          src={logoUrl || '/logo.png'}
          alt="GMONEY Consultoria"
          className="h-full w-full object-cover"
        />
      </div>
    );
  }

  /*
   * 2 - SUGESTÃO DE PRESENTE
   *
   * Mantida igual.
   * Tempo: 2 segundos.
   */

  if (current?.type === 'message') {
    return (
      <div className="flex h-[230px] w-full max-w-[360px] flex-col items-center justify-center rounded-2xl border border-[#D4AF37]/25 bg-neutral-950/80 p-6 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#D4AF37]/40 bg-[#D4AF37]/5 text-[#D4AF37]">
          <Gift className="h-5 w-5" strokeWidth={1.7} />
        </div>

        <p className="mt-5 text-xs uppercase tracking-[0.38em] text-neutral-500">
          Sugestão de
        </p>

        <p className="mt-1 text-3xl font-black uppercase text-[#D4AF37]">
          Presente
        </p>
      </div>
    );
  }

  const gift = current?.gift;

  const imageFiles = Array.isArray(gift?.images)
    ? gift.images
    : [];

  /*
   * LINKS
   */

  const firstLink = parseJsonArray(gift?.links)[0] || {};

  const affiliateUrl = firstLink.url || '#';

  /*
   * BOTÃO
   *
   * Usa somente o nome da loja ou "Saiba mais".
   */

  const buttonText = firstLink.loja || 'Saiba mais';

  /*
   * PRIMEIRA IMAGEM
   */

  const firstImageFilename = imageFiles[0];

  const firstImageUrl =
    gift && firstImageFilename
      ? pb.files.getURL(gift, firstImageFilename)
      : null;

  /*
   * SEGUNDA IMAGEM
   *
   * Se existir uma segunda imagem, usa ela.
   * Caso contrário, repete a primeira.
   */

  const secondImageFilename =
    imageFiles[1] || imageFiles[0];

  const secondImageUrl =
    gift && secondImageFilename
      ? pb.files.getURL(gift, secondImageFilename)
      : null;

  /*
   * SEPARAÇÃO DO NOME E DESCRIÇÃO
   *
   * Se o cadastro estiver:
   *
   * ORGANIC LISS - Alinha os fios...
   *
   * será mostrado:
   *
   * ORGANIC LISS
   * Alinha os fios...
   */

  const rawName = gift?.nome || 'Sugestão de presente';

  const nameParts = rawName.split(' - ');

  const productName = nameParts[0].trim();

  const productDescription =
    gift?.resumo?.trim() ||
    nameParts.slice(1).join(' - ').trim();

  /*
   * 3 - FOTO GRANDE + NOME + DESCRIÇÃO
   */

  if (current?.type === 'product') {
    return (
      <a
        href={affiliateUrl}
        target="_blank"
        rel="noopener noreferrer sponsored"
        className="group flex h-[230px] w-full max-w-[360px] flex-col overflow-hidden rounded-2xl border border-[#D4AF37]/30 bg-neutral-950/90 transition hover:border-[#D4AF37]/70"
        aria-label={`${productName}: ${buttonText}`}
      >
        {/* FOTO GRANDE */}

        <div className="flex h-[160px] w-full items-center justify-center overflow-hidden bg-black">
          {firstImageUrl ? (
            <img
              src={firstImageUrl}
              alt={productName}
              className="h-full w-full object-contain p-1 transition duration-300 group-hover:scale-[1.02]"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center">
              <Gift
                className="h-8 w-8 text-[#D4AF37]"
                strokeWidth={1.5}
              />

              <p className="mt-2 text-sm font-semibold text-[#D4AF37]">
                Sugestão de presente
              </p>
            </div>
          )}
        </div>

        {/* INFORMAÇÕES */}

        <div className="flex min-h-0 flex-1 flex-col justify-center border-t border-[#D4AF37]/20 px-3 py-2 text-center">

          {/* NOME */}

          <h3 className="text-sm font-bold leading-tight text-[#D4AF37]">
            {productName}
          </h3>

          {/* DESCRIÇÃO */}

          {productDescription && (
            <p className="mt-1 line-clamp-2 text-[10px] leading-[1.3] text-neutral-300">
              {productDescription}
            </p>
          )}

          {/* BOTÃO ÚNICO */}

          <span className="mt-1 inline-flex items-center justify-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-[#D4AF37]">
            {buttonText}

            <ExternalLink
              className="h-3 w-3"
              strokeWidth={1.7}
            />
          </span>
        </div>
      </a>
    );
  }

  /*
   * 4 - SEGUNDA FOTO
   *
   * Foto grande, sem cortar.
   */

  if (current?.type === 'image') {
    return (
      <a
        href={affiliateUrl}
        target="_blank"
        rel="noopener noreferrer sponsored"
        className="group flex h-[230px] w-full max-w-[360px] flex-col overflow-hidden rounded-2xl border border-[#D4AF37]/30 bg-neutral-950/90 transition hover:border-[#D4AF37]/70"
        aria-label={`${productName}: ${buttonText}`}
      >
        <div className="flex h-full w-full items-center justify-center overflow-hidden bg-black">
          {secondImageUrl ? (
            <img
              src={secondImageUrl}
              alt={productName}
              className="h-full w-full object-contain p-1 transition duration-300 group-hover:scale-[1.02]"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center">
              <Gift
                className="h-8 w-8 text-[#D4AF37]"
                strokeWidth={1.5}
              />

              <p className="mt-2 text-sm font-semibold text-[#D4AF37]">
                Sugestão de presente
              </p>
            </div>
          )}
        </div>
      </a>
    );
  }

  return null;
}

export default function Layout({ children }) {
  const [on, setOn] = useState(true);

  return (
    <WatermarkContext.Provider
      value={{
        on,
        toggle: () => setOn((v) => !v),
      }}
    >
      <div className="relative min-h-screen overflow-x-clip bg-black text-neutral-300">

        {on && (
          <div
            aria-hidden
            className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center"
          >
            <span className="select-none -rotate-12 text-[22vw] font-black leading-none text-[#D4AF37] opacity-[0.05]">
              GMONEY
            </span>
          </div>
        )}

        <header className="relative z-10 border-b border-[#D4AF37]/20">
          <div className="mx-auto flex max-w-[72rem] items-center px-5 py-2 sm:py-3">
            <Logo />
          </div>
        </header>

        <main className="relative z-10">
          {children}
        </main>

        <footer className="relative z-10 mt-24 border-t border-[#D4AF37]/20">

          <div className="mx-auto grid max-w-[72rem] gap-8 px-5 py-8 lg:grid-cols-[1fr_360px] lg:items-end">

            <div className="flex flex-col gap-2 text-xs text-neutral-500">

              <span className="text-[#D4AF37]">
                GMONEY CONSULTORIA
              </span>

              <span>
                Conteúdo informativo sobre especificações técnicas. Alguns links são de afiliados.
              </span>
              <span>
              Importante : esta é uma página informativa, feita para facilitar sua busca e decisão, porém antes de comprar, confira com o vendedor  se todas as especificações estão de acordo com o descrito em nossa página, pois podem haver discrepâncias.
              </span>
              <span>
                &copy; {new Date().getFullYear()} GMONEY Consultoria. Todos os direitos reservados.
              </span>

            </div>

            <div className="flex justify-start lg:justify-end">
              <GiftBanner />
            </div>

          </div>

        </footer>

      </div>
    </WatermarkContext.Provider>
  );
}