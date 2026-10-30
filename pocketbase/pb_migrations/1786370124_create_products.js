/// <reference path="../pb_data/types.d.ts" />

migrate(
  (app) => {
    let collection;
    try {
      collection = app.findCollectionByNameOrId("products");
    } catch (_) {
      collection = new Collection({
        type: "base",
        name: "products",
        // Catálogo público: leitura aberta, escrita só autenticado (admin)
        listRule: "",
        viewRule: "",
        createRule: "@request.auth.id != ''",
        updateRule: "@request.auth.id != ''",
        deleteRule: "@request.auth.id != ''",
        fields: [
          { name: "nome", type: "text", required: true, max: 200 },
          { name: "marca", type: "text", max: 100 },
          {
            name: "segmento",
            type: "select",
            maxSelect: 1,
            values: [
              "eletrodomesticos",
              "informatica",
              "ferramentas",
              "eletronicos",
              "climatizacao",
              "cozinha",
            ],
          },
          { name: "categoria", type: "text", max: 100 },
          { name: "keywords", type: "text", max: 500 },
          { name: "resumo", type: "text", max: 1000 },
          { name: "preco", type: "text", max: 50 },
          {
            name: "images",
            type: "file",
            maxSelect: 4,
            maxSize: 5242880,
            mimeTypes: ["image/jpeg", "image/png", "image/gif", "image/webp"],
          },
          { name: "specs", type: "json", maxSize: 2000000 },
          { name: "links", type: "json", maxSize: 1000000 },
          { name: "ativo", type: "bool" },
          { name: "consideracoes", type: "text", max: 3000 },
          { name: "created", type: "autodate", onCreate: true, onUpdate: false },
          { name: "updated", type: "autodate", onCreate: true, onUpdate: true },
        ],
      });
      app.save(collection);
    }

    // ── Seed com os produtos já existentes no catálogo ────────────────
    const seed = [
      {
        nome: "Geladeira Frost Free Duplex 375L",
        marca: "Brastemp",
        segmento: "eletrodomesticos",
        categoria: "Geladeira",
        keywords: "geladeira frost free duplex 375 brastemp refrigerador",
        resumo: "Duplex frost free com compartimento extrafrio e prateleiras removíveis.",
        preco: "R$ 3.499",
        specs: [
          { nome: "Tipo", valor: "Duplex Frost Free" },
          { nome: "Capacidade", valor: "375 litros" },
          { nome: "Dimensões", valor: "177 x 62 x 70 cm" },
          { nome: "Peso", valor: "68 kg" },
          { nome: "Consumo de energia", valor: "38,7 kWh/mês" },
          { nome: "Selo Procel", valor: "A" },
          { nome: "Voltagem", valor: "110V / 220V" },
          { nome: "Garantia", valor: "12 meses" },
        ],
        links: [
          { loja: "Amazon", url: "https://www.amazon.com.br" },
          { loja: "Magalu", url: "https://www.magazineluiza.com.br" },
          { loja: "Mercado Livre", url: "https://www.mercadolivre.com.br" },
        ],
        consideracoes:
          "Boa escolha para famílias de 3 a 5 pessoas. O consumo é competitivo na faixa dos 350L e o compartimento extrafrio ajuda a conservar carnes por mais tempo. Se você precisa de porta com dispenser de água, avalie modelos superiores da mesma linha.",
      },
      {
        nome: "Geladeira Inverse 397L",
        marca: "Consul",
        segmento: "eletrodomesticos",
        categoria: "Geladeira",
        keywords: "geladeira inverse 397 consul freezer embaixo refrigerador",
        resumo: "Freezer embaixo, gavetão de frios e iluminação interna em LED.",
        preco: "R$ 3.899",
        specs: [
          { nome: "Tipo", valor: "Inverse Frost Free" },
          { nome: "Capacidade", valor: "397 litros" },
          { nome: "Dimensões", valor: "185 x 60 x 71 cm" },
          { nome: "Peso", valor: "74 kg" },
          { nome: "Consumo de energia", valor: "41,2 kWh/mês" },
          { nome: "Selo Procel", valor: "A" },
          { nome: "Voltagem", valor: "220V" },
          { nome: "Garantia", valor: "12 meses" },
        ],
        links: [
          { loja: "Amazon", url: "https://www.amazon.com.br" },
          { loja: "Casas Bahia", url: "https://www.casasbahia.com.br" },
        ],
        consideracoes:
          "O formato inverse coloca o refrigerador na altura dos olhos, o que reduz o esforço no uso diário. Consome um pouco mais que a média, mas entrega mais espaço útil no refrigerador.",
      },
      {
        nome: "Geladeira Inverter 431L Inox",
        marca: "Electrolux",
        segmento: "eletrodomesticos",
        categoria: "Geladeira",
        keywords: "geladeira inverter 431 inox electrolux silenciosa refrigerador",
        resumo: "Compressor inverter silencioso e painel eletrônico externo.",
        preco: "R$ 4.599",
        specs: [
          { nome: "Tipo", valor: "Duplex Inverter" },
          { nome: "Capacidade", valor: "431 litros" },
          { nome: "Dimensões", valor: "186 x 70 x 74 cm" },
          { nome: "Peso", valor: "81 kg" },
          { nome: "Consumo de energia", valor: "35,1 kWh/mês" },
          { nome: "Selo Procel", valor: "A" },
          { nome: "Voltagem", valor: "110V" },
          { nome: "Garantia", valor: "12 meses" },
        ],
        links: [
          { loja: "Amazon", url: "https://www.amazon.com.br" },
          { loja: "Shopee", url: "https://shopee.com.br" },
        ],
        consideracoes:
          "Melhor relação consumo x capacidade desta lista. O compressor inverter reduz ruído e oscilação de temperatura, indicado para cozinha integrada à sala.",
      },
      {
        nome: "Fogão 5 Bocas com Mesa de Vidro",
        marca: "Atlas",
        segmento: "cozinha",
        categoria: "Fogão",
        keywords: "fogao 5 bocas vidro atlas forno acendimento automatico",
        resumo: "Mesa de vidro temperado, acendimento automático e forno 80L.",
        preco: "R$ 1.799",
        specs: [
          { nome: "Tipo", valor: "Piso 5 bocas" },
          { nome: "Capacidade do forno", valor: "80 litros" },
          { nome: "Dimensões", valor: "95 x 76 x 64 cm" },
          { nome: "Peso", valor: "42 kg" },
          { nome: "Consumo de gás", valor: "0,42 kg/h" },
          { nome: "Acendimento", valor: "Automático" },
          { nome: "Garantia", valor: "12 meses" },
        ],
        links: [
          { loja: "Magalu", url: "https://www.magazineluiza.com.br" },
          { loja: "Mercado Livre", url: "https://www.mercadolivre.com.br" },
        ],
        consideracoes:
          "Forno espaçoso para quem assa com frequência. A mesa de vidro facilita a limpeza, mas exige cuidado com panelas pesadas.",
      },
      {
        nome: "Fogão 4 Bocas Inox Timer",
        marca: "Brastemp",
        segmento: "cozinha",
        categoria: "Fogão",
        keywords: "fogao 4 bocas inox timer brastemp autolimpante",
        resumo: "Timer digital, grades de ferro fundido e forno autolimpante.",
        preco: "R$ 2.149",
        specs: [
          { nome: "Tipo", valor: "Piso 4 bocas" },
          { nome: "Capacidade do forno", valor: "68 litros" },
          { nome: "Dimensões", valor: "93 x 60 x 63 cm" },
          { nome: "Peso", valor: "38 kg" },
          { nome: "Consumo de gás", valor: "0,38 kg/h" },
          { nome: "Acendimento", valor: "Automático" },
          { nome: "Garantia", valor: "12 meses" },
        ],
        links: [{ loja: "Amazon", url: "https://www.amazon.com.br" }],
        consideracoes:
          "Indicado para cozinhas menores. As grades de ferro fundido dão estabilidade e o forno autolimpante reduz manutenção.",
      },
      {
        nome: "Ventilador de Coluna Turbo 40cm",
        marca: "Arno",
        segmento: "climatizacao",
        categoria: "Ventilador",
        keywords: "ventilador coluna turbo 40 arno bivolt",
        resumo: "Três velocidades, hélice de 6 pás e altura regulável.",
        preco: "R$ 329",
        specs: [
          { nome: "Tipo", valor: "Coluna" },
          { nome: "Diâmetro", valor: "40 cm" },
          { nome: "Peso", valor: "4,2 kg" },
          { nome: "Potência", valor: "130 W" },
          { nome: "Consumo de energia", valor: "10,4 kWh/mês" },
          { nome: "Velocidades", valor: "3" },
          { nome: "Voltagem", valor: "Bivolt" },
          { nome: "Garantia", valor: "12 meses" },
        ],
        links: [
          { loja: "Amazon", url: "https://www.amazon.com.br" },
          { loja: "Shopee", url: "https://shopee.com.br" },
        ],
        consideracoes:
          "Boa vazão de ar para quartos e salas de até 20 m². Bivolt real, útil para quem muda de casa com frequência.",
      },
      {
        nome: "Ventilador de Mesa 30cm Silencioso",
        marca: "Mondial",
        segmento: "climatizacao",
        categoria: "Ventilador",
        keywords: "ventilador mesa 30 silencioso mundial escritorio",
        resumo: "Compacto, silencioso e com grade removível para limpeza.",
        preco: "R$ 189",
        specs: [
          { nome: "Tipo", valor: "Mesa" },
          { nome: "Diâmetro", valor: "30 cm" },
          { nome: "Peso", valor: "2,6 kg" },
          { nome: "Potência", valor: "90 W" },
          { nome: "Consumo de energia", valor: "7,2 kWh/mês" },
          { nome: "Ruído médio", valor: "48 dB" },
          { nome: "Voltagem", valor: "127V" },
          { nome: "Garantia", valor: "12 meses" },
        ],
        links: [{ loja: "Mercado Livre", url: "https://www.mercadolivre.com.br" }],
        consideracoes:
          "Melhor opção de custo-benefício para escritório e home office pelo baixo ruído.",
      },
      {
        nome: "Lavadora de Roupas 13kg Smart",
        marca: "LG",
        segmento: "eletrodomesticos",
        categoria: "Lavadora",
        keywords: "lavadora roupas 13kg smart lg inverter direct drive wifi",
        resumo: "Motor inverter direct drive, 12 programas e conexão Wi-Fi.",
        preco: "R$ 2.899",
        specs: [
          { nome: "Tipo", valor: "Automática superior" },
          { nome: "Capacidade", valor: "13 kg" },
          { nome: "Dimensões", valor: "104 x 60 x 68 cm" },
          { nome: "Peso", valor: "39 kg" },
          { nome: "Consumo de energia", valor: "17,9 kWh/mês" },
          { nome: "Consumo de água", valor: "132 litros/ciclo" },
          { nome: "Voltagem", valor: "127V" },
          { nome: "Garantia", valor: "12 meses (motor 10 anos)" },
        ],
        links: [
          { loja: "Amazon", url: "https://www.amazon.com.br" },
          { loja: "Magalu", url: "https://www.magazineluiza.com.br" },
        ],
        consideracoes:
          "Motor com garantia estendida e boa eficiência hídrica. Vale para famílias que lavam roupa de cama com frequência.",
      },
      {
        nome: "Lavadora Essential Care 11kg",
        marca: "Electrolux",
        segmento: "eletrodomesticos",
        categoria: "Lavadora",
        keywords: "lavadora essential care 11kg electrolux ciclo rapido",
        resumo: "Dispenser automático, ciclo rápido e filtro pega-fiapos.",
        preco: "R$ 1.999",
        specs: [
          { nome: "Tipo", valor: "Automática superior" },
          { nome: "Capacidade", valor: "11 kg" },
          { nome: "Dimensões", valor: "103 x 60 x 66 cm" },
          { nome: "Peso", valor: "34 kg" },
          { nome: "Consumo de energia", valor: "15,4 kWh/mês" },
          { nome: "Consumo de água", valor: "118 litros/ciclo" },
          { nome: "Voltagem", valor: "220V" },
          { nome: "Garantia", valor: "12 meses" },
        ],
        links: [{ loja: "Casas Bahia", url: "https://www.casasbahia.com.br" }],
        consideracoes:
          "Simples de operar e econômica. Sem inverter, o ruído na centrifugação é mais perceptível.",
      },
      {
        nome: 'Notebook Gamer 15,6" RTX 4050',
        marca: "Acer",
        segmento: "informatica",
        categoria: "Notebook",
        keywords: "notebook gamer 15 rtx 4050 acer ryzen 144hz",
        resumo: "Ryzen 7, 16GB RAM, SSD 512GB e tela 144Hz.",
        preco: "R$ 5.499",
        specs: [
          { nome: "Processador", valor: "Ryzen 7 7735HS" },
          { nome: "Memória", valor: "16 GB DDR5" },
          { nome: "Armazenamento", valor: "SSD 512 GB NVMe" },
          { nome: "Tela", valor: '15,6" Full HD 144Hz' },
          { nome: "Peso", valor: "2,1 kg" },
          { nome: "Bateria", valor: "57 Wh" },
          { nome: "Garantia", valor: "12 meses" },
        ],
        links: [
          { loja: "Amazon", url: "https://www.amazon.com.br" },
          { loja: "Kabum", url: "https://www.kabum.com.br" },
        ],
        consideracoes:
          "Configuração equilibrada para jogos em Full HD e edição de vídeo leve. Considere upgrade de SSD no primeiro ano.",
      },
      {
        nome: 'Notebook 14" Core i5 8GB',
        marca: "Dell",
        segmento: "informatica",
        categoria: "Notebook",
        keywords: "notebook 14 core i5 dell inspiron leve",
        resumo: "Leve, com teclado retroiluminado e leitor biométrico.",
        preco: "R$ 3.299",
        specs: [
          { nome: "Processador", valor: "Intel Core i5-1334U" },
          { nome: "Memória", valor: "8 GB DDR4" },
          { nome: "Armazenamento", valor: "SSD 256 GB" },
          { nome: "Tela", valor: '14" Full HD' },
          { nome: "Peso", valor: "1,4 kg" },
          { nome: "Bateria", valor: "54 Wh" },
          { nome: "Garantia", valor: "12 meses" },
        ],
        links: [{ loja: "Amazon", url: "https://www.amazon.com.br" }],
        consideracoes:
          "Ótimo para trabalho e estudos. A memória de 8GB é o principal limite; verifique se o modelo aceita expansão.",
      },
      {
        nome: "Furadeira de Impacto 750W",
        marca: "Bosch",
        segmento: "ferramentas",
        categoria: "Furadeira",
        keywords: "furadeira impacto 750w bosch mandril alvenaria",
        resumo: 'Mandril de 1/2", reversão e controle de velocidade no gatilho.',
        preco: "R$ 449",
        specs: [
          { nome: "Tipo", valor: "Impacto com fio" },
          { nome: "Potência", valor: "750 W" },
          { nome: "Mandril", valor: '13 mm (1/2")' },
          { nome: "Peso", valor: "1,9 kg" },
          { nome: "Rotação", valor: "3.000 rpm" },
          { nome: "Voltagem", valor: "127V" },
          { nome: "Garantia", valor: "12 meses" },
        ],
        links: [
          { loja: "Amazon", url: "https://www.amazon.com.br" },
          { loja: "Leroy Merlin", url: "https://www.leroymerlin.com.br" },
        ],
        consideracoes:
          "Cobre bem furos em alvenaria e madeira em uso doméstico intenso. Para concreto estrutural, prefira um martelete.",
      },
      {
        nome: 'Smart TV 55" 4K Crystal',
        marca: "Samsung",
        segmento: "eletronicos",
        categoria: "Smart TV",
        keywords: "smart tv 55 4k samsung crystal hdr",
        resumo: "Painel 4K, HDR10+, três HDMI e assistente por voz.",
        preco: "R$ 2.699",
        specs: [
          { nome: "Tipo", valor: "LED 4K" },
          { nome: "Tela", valor: "55 polegadas" },
          { nome: "Resolução", valor: "3840 x 2160" },
          { nome: "Peso", valor: "13,8 kg" },
          { nome: "Consumo de energia", valor: "18 kWh/mês" },
          { nome: "Conexões", valor: "3 HDMI / 2 USB" },
          { nome: "Garantia", valor: "12 meses" },
        ],
        links: [
          { loja: "Amazon", url: "https://www.amazon.com.br" },
          { loja: "Magalu", url: "https://www.magazineluiza.com.br" },
        ],
        consideracoes:
          "Boa entrega de imagem em ambientes claros. Para jogos em 120Hz, avalie a linha superior.",
      },
    ];

    seed.forEach((s) => {
      const r = new Record(collection);
      r.set("nome", s.nome);
      r.set("marca", s.marca || "");
      r.set("segmento", s.segmento || "");
      r.set("categoria", s.categoria || "");
      r.set("keywords", s.keywords || "");
      r.set("resumo", s.resumo || "");
      r.set("preco", s.preco || "");
      r.set("specs", s.specs || []);
      r.set("links", s.links || []);
      r.set("ativo", true);
      r.set("consideracoes", s.consideracoes || "");
      app.save(r);
    });
  },
  (app) => {
    try {
      const collection = app.findCollectionByNameOrId("products");
      app.delete(collection);
    } catch (e) {
      if (e.message.includes("no rows in result set")) {
        console.log("products collection not found, skipping revert");
        return;
      }
      throw e;
    }
  },
);
