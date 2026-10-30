export const segments = [
  { id: 'eletrodomesticos', nome: 'Eletrodomésticos' },
  { id: 'informatica', nome: 'Informática' },
  { id: 'ferramentas', nome: 'Ferramentas' },
  { id: 'eletronicos', nome: 'Eletrônicos' },
  { id: 'climatizacao', nome: 'Climatização' },
  { id: 'cozinha', nome: 'Cozinha' },
];

export const products = [
  {
    id: 'geladeira-brastemp-frost-free-375',
    nome: 'Geladeira Frost Free Duplex 375L',
    categoria: 'Geladeira',
    segmento: 'eletrodomesticos',
    marca: 'Brastemp',
    preco: 'R$ 3.499',
    resumo: 'Duplex frost free com compartimento extrafrio e prateleiras removíveis.',
    fotos: 2,
    specs: {
      Tipo: 'Duplex Frost Free',
      Capacidade: '375 litros',
      Dimensões: '177 x 62 x 70 cm',
      Peso: '68 kg',
      'Consumo de energia': '38,7 kWh/mês',
      'Selo Procel': 'A',
      Voltagem: '110V / 220V',
      Garantia: '12 meses',
    },
    consideracoes:
      'Boa escolha para famílias de 3 a 5 pessoas. O consumo é competitivo na faixa dos 350L e o compartimento extrafrio ajuda a conservar carnes por mais tempo. Se você precisa de porta com dispenser de água, avalie modelos superiores da mesma linha.',
    links: [
      { loja: 'Amazon', url: 'https://www.amazon.com.br' },
      { loja: 'Magalu', url: 'https://www.magazineluiza.com.br' },
      { loja: 'Mercado Livre', url: 'https://www.mercadolivre.com.br' },
    ],
  },
  {
    id: 'geladeira-consul-inverse-397',
    nome: 'Geladeira Inverse 397L',
    categoria: 'Geladeira',
    segmento: 'eletrodomesticos',
    marca: 'Consul',
    preco: 'R$ 3.899',
    resumo: 'Freezer embaixo, gavetão de frios e iluminação interna em LED.',
    fotos: 3,
    specs: {
      Tipo: 'Inverse Frost Free',
      Capacidade: '397 litros',
      Dimensões: '185 x 60 x 71 cm',
      Peso: '74 kg',
      'Consumo de energia': '41,2 kWh/mês',
      'Selo Procel': 'A',
      Voltagem: '220V',
      Garantia: '12 meses',
    },
    consideracoes:
      'O formato inverse coloca o refrigerador na altura dos olhos, o que reduz o esforço no uso diário. Consome um pouco mais que a média, mas entrega mais espaço útil no refrigerador.',
    links: [
      { loja: 'Amazon', url: 'https://www.amazon.com.br' },
      { loja: 'Casas Bahia', url: 'https://www.casasbahia.com.br' },
    ],
  },
  {
    id: 'geladeira-electrolux-if55s',
    nome: 'Geladeira Inverter 431L Inox',
    categoria: 'Geladeira',
    segmento: 'eletrodomesticos',
    marca: 'Electrolux',
    preco: 'R$ 4.599',
    resumo: 'Compressor inverter silencioso e painel eletrônico externo.',
    fotos: 1,
    specs: {
      Tipo: 'Duplex Inverter',
      Capacidade: '431 litros',
      Dimensões: '186 x 70 x 74 cm',
      Peso: '81 kg',
      'Consumo de energia': '35,1 kWh/mês',
      'Selo Procel': 'A',
      Voltagem: '110V',
      Garantia: '12 meses',
    },
    consideracoes:
      'Melhor relação consumo x capacidade desta lista. O compressor inverter reduz ruído e oscilação de temperatura, indicado para cozinha integrada à sala.',
    links: [
      { loja: 'Amazon', url: 'https://www.amazon.com.br' },
      { loja: 'Shopee', url: 'https://shopee.com.br' },
    ],
  },
  {
    id: 'fogao-atlas-5b',
    nome: 'Fogão 5 Bocas com Mesa de Vidro',
    categoria: 'Fogão',
    segmento: 'cozinha',
    marca: 'Atlas',
    preco: 'R$ 1.799',
    resumo: 'Mesa de vidro temperado, acendimento automático e forno 80L.',
    fotos: 2,
    specs: {
      Tipo: 'Piso 5 bocas',
      'Capacidade do forno': '80 litros',
      Dimensões: '95 x 76 x 64 cm',
      Peso: '42 kg',
      'Consumo de gás': '0,42 kg/h',
      Acendimento: 'Automático',
      Garantia: '12 meses',
    },
    consideracoes:
      'Forno espaçoso para quem assa com frequência. A mesa de vidro facilita a limpeza, mas exige cuidado com panelas pesadas.',
    links: [
      { loja: 'Magalu', url: 'https://www.magazineluiza.com.br' },
      { loja: 'Mercado Livre', url: 'https://www.mercadolivre.com.br' },
    ],
  },
  {
    id: 'fogao-brastemp-4b',
    nome: 'Fogão 4 Bocas Inox Timer',
    categoria: 'Fogão',
    segmento: 'cozinha',
    marca: 'Brastemp',
    preco: 'R$ 2.149',
    resumo: 'Timer digital, grades de ferro fundido e forno autolimpante.',
    fotos: 1,
    specs: {
      Tipo: 'Piso 4 bocas',
      'Capacidade do forno': '68 litros',
      Dimensões: '93 x 60 x 63 cm',
      Peso: '38 kg',
      'Consumo de gás': '0,38 kg/h',
      Acendimento: 'Automático',
      Garantia: '12 meses',
    },
    consideracoes:
      'Indicado para cozinhas menores. As grades de ferro fundido dão estabilidade e o forno autolimpante reduz manutenção.',
    links: [{ loja: 'Amazon', url: 'https://www.amazon.com.br' }],
  },
  {
    id: 'ventilador-arno-turbo',
    nome: 'Ventilador de Coluna Turbo 40cm',
    categoria: 'Ventilador',
    segmento: 'climatizacao',
    marca: 'Arno',
    preco: 'R$ 329',
    resumo: 'Três velocidades, hélice de 6 pás e altura regulável.',
    fotos: 2,
    specs: {
      Tipo: 'Coluna',
      Diâmetro: '40 cm',
      Peso: '4,2 kg',
      Potência: '130 W',
      'Consumo de energia': '10,4 kWh/mês',
      Velocidades: '3',
      Voltagem: 'Bivolt',
      Garantia: '12 meses',
    },
    consideracoes:
      'Boa vazão de ar para quartos e salas de até 20 m². Bivolt real, útil para quem muda de casa com frequência.',
    links: [
      { loja: 'Amazon', url: 'https://www.amazon.com.br' },
      { loja: 'Shopee', url: 'https://shopee.com.br' },
    ],
  },
  {
    id: 'ventilador-mondial-maxi',
    nome: 'Ventilador de Mesa 30cm Silencioso',
    categoria: 'Ventilador',
    segmento: 'climatizacao',
    marca: 'Mondial',
    preco: 'R$ 189',
    resumo: 'Compacto, silencioso e com grade removível para limpeza.',
    fotos: 1,
    specs: {
      Tipo: 'Mesa',
      Diâmetro: '30 cm',
      Peso: '2,6 kg',
      Potência: '90 W',
      'Consumo de energia': '7,2 kWh/mês',
      'Ruído médio': '48 dB',
      Voltagem: '127V',
      Garantia: '12 meses',
    },
    consideracoes:
      'Melhor opção de custo-benefício para escritório e home office pelo baixo ruído.',
    links: [{ loja: 'Mercado Livre', url: 'https://www.mercadolivre.com.br' }],
  },
  {
    id: 'lavadora-lg-13kg',
    nome: 'Lavadora de Roupas 13kg Smart',
    categoria: 'Lavadora',
    segmento: 'eletrodomesticos',
    marca: 'LG',
    preco: 'R$ 2.899',
    resumo: 'Motor inverter direct drive, 12 programas e conexão Wi-Fi.',
    fotos: 3,
    specs: {
      Tipo: 'Automática superior',
      Capacidade: '13 kg',
      Dimensões: '104 x 60 x 68 cm',
      Peso: '39 kg',
      'Consumo de energia': '17,9 kWh/mês',
      'Consumo de água': '132 litros/ciclo',
      Voltagem: '127V',
      Garantia: '12 meses (motor 10 anos)',
    },
    consideracoes:
      'Motor com garantia estendida e boa eficiência hídrica. Vale para famílias que lavam roupa de cama com frequência.',
    links: [
      { loja: 'Amazon', url: 'https://www.amazon.com.br' },
      { loja: 'Magalu', url: 'https://www.magazineluiza.com.br' },
    ],
  },
  {
    id: 'lavadora-electrolux-11kg',
    nome: 'Lavadora Essential Care 11kg',
    categoria: 'Lavadora',
    segmento: 'eletrodomesticos',
    marca: 'Electrolux',
    preco: 'R$ 1.999',
    resumo: 'Dispenser automático, ciclo rápido e filtro pega-fiapos.',
    fotos: 2,
    specs: {
      Tipo: 'Automática superior',
      Capacidade: '11 kg',
      Dimensões: '103 x 60 x 66 cm',
      Peso: '34 kg',
      'Consumo de energia': '15,4 kWh/mês',
      'Consumo de água': '118 litros/ciclo',
      Voltagem: '220V',
      Garantia: '12 meses',
    },
    consideracoes:
      'Simples de operar e econômica. Sem inverter, o ruído na centrifugação é mais perceptível.',
    links: [{ loja: 'Casas Bahia', url: 'https://www.casasbahia.com.br' }],
  },
  {
    id: 'notebook-acer-nitro',
    nome: 'Notebook Gamer 15,6" RTX 4050',
    categoria: 'Notebook',
    segmento: 'informatica',
    marca: 'Acer',
    preco: 'R$ 5.499',
    resumo: 'Ryzen 7, 16GB RAM, SSD 512GB e tela 144Hz.',
    fotos: 2,
    specs: {
      Processador: 'Ryzen 7 7735HS',
      Memória: '16 GB DDR5',
      Armazenamento: 'SSD 512 GB NVMe',
      Tela: '15,6" Full HD 144Hz',
      Peso: '2,1 kg',
      Bateria: '57 Wh',
      Garantia: '12 meses',
    },
    consideracoes:
      'Configuração equilibrada para jogos em Full HD e edição de vídeo leve. Considere upgrade de SSD no primeiro ano.',
    links: [
      { loja: 'Amazon', url: 'https://www.amazon.com.br' },
      { loja: 'Kabum', url: 'https://www.kabum.com.br' },
    ],
  },
  {
    id: 'notebook-dell-inspiron',
    nome: 'Notebook 14" Core i5 8GB',
    categoria: 'Notebook',
    segmento: 'informatica',
    marca: 'Dell',
    preco: 'R$ 3.299',
    resumo: 'Leve, com teclado retroiluminado e leitor biométrico.',
    fotos: 1,
    specs: {
      Processador: 'Intel Core i5-1334U',
      Memória: '8 GB DDR4',
      Armazenamento: 'SSD 256 GB',
      Tela: '14" Full HD',
      Peso: '1,4 kg',
      Bateria: '54 Wh',
      Garantia: '12 meses',
    },
    consideracoes:
      'Ótimo para trabalho e estudos. A memória de 8GB é o principal limite; verifique se o modelo aceita expansão.',
    links: [{ loja: 'Amazon', url: 'https://www.amazon.com.br' }],
  },
  {
    id: 'furadeira-bosch-gsb',
    nome: 'Furadeira de Impacto 750W',
    categoria: 'Furadeira',
    segmento: 'ferramentas',
    marca: 'Bosch',
    preco: 'R$ 449',
    resumo: 'Mandril de 1/2", reversão e controle de velocidade no gatilho.',
    fotos: 2,
    specs: {
      Tipo: 'Impacto com fio',
      Potência: '750 W',
      Mandril: '13 mm (1/2")',
      Peso: '1,9 kg',
      Rotação: '3.000 rpm',
      Voltagem: '127V',
      Garantia: '12 meses',
    },
    consideracoes:
      'Cobre bem furos em alvenaria e madeira em uso doméstico intenso. Para concreto estrutural, prefira um martelete.',
    links: [
      { loja: 'Amazon', url: 'https://www.amazon.com.br' },
      { loja: 'Leroy Merlin', url: 'https://www.leroymerlin.com.br' },
    ],
  },
  {
    id: 'tv-samsung-55',
    nome: 'Smart TV 55" 4K Crystal',
    categoria: 'Smart TV',
    segmento: 'eletronicos',
    marca: 'Samsung',
    preco: 'R$ 2.699',
    resumo: 'Painel 4K, HDR10+, três HDMI e assistente por voz.',
    fotos: 3,
    specs: {
      Tipo: 'LED 4K',
      Tela: '55 polegadas',
      Resolução: '3840 x 2160',
      Peso: '13,8 kg',
      'Consumo de energia': '18 kWh/mês',
      Conexões: '3 HDMI / 2 USB',
      Garantia: '12 meses',
    },
    consideracoes:
      'Boa entrega de imagem em ambientes claros. Para jogos em 120Hz, avalie a linha superior.',
    links: [
      { loja: 'Amazon', url: 'https://www.amazon.com.br' },
      { loja: 'Magalu', url: 'https://www.magazineluiza.com.br' },
    ],
  },
];

export function searchProducts(term = '', segmento = '') {
  const t = term.trim().toLowerCase();
  return products.filter((p) => {
    const okSeg = !segmento || p.segmento === segmento;
    const okTerm =
      !t ||
      [p.nome, p.categoria, p.marca, p.resumo].join(' ').toLowerCase().includes(t);
    return okSeg && okTerm;
  });
}

export function groupByBrand(list) {
  const map = new Map();
  list.forEach((p) => {
    if (!map.has(p.marca)) map.set(p.marca, []);
    map.get(p.marca).push(p);
  });
  return [...map.entries()].sort((a, b) => a[0].localeCompare(b[0]));
}
