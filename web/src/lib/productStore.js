import pb from '@/lib/pocketbaseClient';

// Busca produtos ativos, opcionalmente filtrados por texto e/ou segmento.
// requestKey: null evita que outra consulta simultânea à coleção "products"
// cancele esta busca automaticamente no PocketBase.
export async function fetchProducts({ q = '', segmento = '' } = {}) {
  const filters = ['ativo = true'];

  if (segmento) {
    const safeSegmento = String(segmento).replace(/"/g, '\\"');
    filters.push(`segmento = "${safeSegmento}"`);
  }

  const list = await pb.collection('products').getFullList({
    filter: filters.join(' && '),
    sort: '-created',
    requestKey: null,
  });

  const term = q.trim().toLowerCase();

  if (!term) {
    return list;
  }

  return list.filter((product) => {
    const searchableText = [
      product.nome,
      product.marca,
      product.segmento,
      product.categoria,
      product.keywords,
      product.resumo,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    return searchableText.includes(term);
  });
}

// Lista todos os produtos (admin) — inclui inativos.
export async function fetchAllProducts() {
  return pb.collection('products').getFullList({
    sort: '-created',
    requestKey: null,
  });
}

export async function fetchProduct(id) {
  return pb.collection('products').getOne(id, {
    requestKey: null,
  });
}

export async function createProduct(payload) {
  return pb.collection('products').create(payload, {
    requestKey: null,
  });
}

export async function updateProduct(id, payload) {
  return pb.collection('products').update(id, payload, {
    requestKey: null,
  });
}

export async function deleteProduct(id) {
  return pb.collection('products').delete(id, {
    requestKey: null,
  });
}

export function productImageUrl(record, filename) {
  if (!record || !filename) return null;

  return pb.files.getURL(record, filename);
}

export function productImageUrls(record) {
  if (!record || !record.images || !record.images.length) return [];

  return record.images.map((filename) =>
    pb.files.getURL(record, filename),
  );
}

// Mantido para compatibilidade com qualquer outra parte do projeto
// que ainda utilize agrupamento por marca.
export function groupByBrand(list) {
  const map = new Map();

  list.forEach((product) => {
    const key = product.marca || 'Outros';

    if (!map.has(key)) {
      map.set(key, []);
    }

    map.get(key).push(product);
  });

  return [...map.entries()].sort((a, b) =>
    a[0].localeCompare(b[0]),
  );
}