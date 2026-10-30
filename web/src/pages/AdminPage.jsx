import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import pb from '@/lib/pocketbaseClient';
import { segments } from '@/data/products';
import { fetchAllProducts, createProduct, updateProduct, deleteProduct, productImageUrl } from '@/lib/productStore';

// O painel carrega produtos e sugestões ao mesmo tempo.
// Desativa o autocancelamento do PocketBase para que uma consulta não cancele a outra.
pb.autoCancellation(false);

const GIFT_CATEGORY = '__gift_banner__';
const GIFT_ACTIVE = '__gift_active__';

const inputCls = 'w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-yellow-500';
const labelCls = 'block text-xs text-neutral-400 mb-1';
const inputBase = 'bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-yellow-500';

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

// Normaliza o link no mesmo formato que a página pública espera:
// corrige loja ↔ url invertidos e completa o nome da plataforma.
function normalizeLink(l) {
  if (typeof l === 'string') l = { url: l };
  if (!l || typeof l !== 'object') return { loja: '', url: '' };

  let loja = String(l.loja || '').trim();
  let url = String(l.url || '').trim();

  const isUrl = (v) => /^https?:\/\//i.test(v);

  if (loja && !url && isUrl(loja)) {
    url = loja;
    loja = '';
  }

  if (loja && url && loja.includes(url)) {
    loja = loja.replace(url, '').trim();
  }

  if (isUrl(loja)) {
    loja = '';
  }

  if (!loja && url) {
    try {
      loja = new URL(url).hostname.replace(/^www\./, '');
    } catch {
      loja = '';
    }
  }

  return { loja, url };
}


// ── Helpers ──────────────────────────────────────────────────────────────
function getImageUrl(record, field) {
  if (!record || !record[field]) return null;
  const filename = Array.isArray(record[field]) ? record[field][0] : record[field];
  if (!filename) return null;
  return pb.files.getURL(record, filename);
}

const EMPTY_FORM = {
  nome: '',
  marca: '',
  segmento: '',
  categoria: '',
  keywords: '',
  resumo: '',
  preco: '',
  consideracoes: '',
  ativo: true,
  specs: [],
  links: []
};

// ── Login Form ───────────────────────────────────────────────────────────
function LoginForm({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await pb.collection('users').authWithPassword(email, password);
      onLogin();
    } catch {
      setError('E-mail ou senha incorretos.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-neutral-900 border border-neutral-800 rounded-xl p-8">
        <div className="mb-8 text-center">
          <div className="text-2xl font-bold text-yellow-400 tracking-wide mb-1">GMONEY</div>
          <div className="text-sm text-neutral-400">Painel Administrativo</div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-neutral-400 mb-1">E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-yellow-500"
              placeholder="admin@gmoney.com"
            />
          </div>
          <div>
            <label className="block text-xs text-neutral-400 mb-1">Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-yellow-500"
              placeholder="••••••••"
            />
          </div>
          {error && <p className="text-red-400 text-xs">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-semibold py-2 rounded-lg text-sm transition-colors disabled:opacity-60"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}

// ── Logo Section ─────────────────────────────────────────────────────────
function LogoSection() {
  const [logoRecord, setLogoRecord] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState('');
  const fileRef = useRef();
  
  useEffect(() => {
    pb.collection('site_assets')
      .getFirstListItem('key = "logo"')
      .then(setLogoRecord)
      .catch(() => setLogoRecord(null));
  }, []);

  async function handleUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setMsg('');
    try {
      const fd = new FormData();
      fd.append('key', 'logo');
      fd.append('image', file);
      if (logoRecord) {
        const updated = await pb.collection('site_assets').update(logoRecord.id, fd);
        setLogoRecord(updated);
      } else {
        const created = await pb.collection('site_assets').create(fd);
        setLogoRecord(created);
      }
      setMsg('Logomarca atualizada com sucesso!');
      window.dispatchEvent(new CustomEvent('logo-updated'));
    } catch (err) {
      setMsg('Erro ao enviar imagem: ' + (err.message || ''));
    } finally {
      setUploading(false);
    }
  }

  const logoUrl = logoRecord ? getImageUrl(logoRecord, 'image') : null;

  return (
    <section className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
      <h2 className="text-lg font-semibold text-white mb-4">Logomarca do Cabeçalho</h2>
      <div className="flex items-center gap-6 flex-wrap">
        <div className="w-32 h-16 bg-neutral-800 border border-neutral-700 rounded-lg flex items-center justify-center overflow-hidden shrink-0">
          {logoUrl ? (
            <img src={logoUrl} alt="Logo atual" className="max-w-full max-h-full object-contain" />
          ) : (
            <span className="text-neutral-500 text-xs text-center px-2">Sem logomarca</span>
          )}
        </div>
        <div className="space-y-2">
          <p className="text-sm text-neutral-400">
            {logoUrl ? 'Clique para trocar a logomarca.' : 'Faça upload da logomarca.'}
          </p>
          <button
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="bg-yellow-400 hover:bg-yellow-300 text-black font-semibold text-sm px-4 py-2 rounded-lg transition-colors disabled:opacity-60"
          >
            {uploading ? 'Enviando...' : logoUrl ? 'Trocar Logomarca' : 'Fazer Upload'}
          </button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
          {msg && <p className="text-xs text-green-400">{msg}</p>}
        </div>
      </div>
    </section>
  );
}

// ── Sugestões de presente ────────────────────────────────────────────────
function GiftBannersManager({ refreshKey = 0 }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [msg, setMsg] = useState('');

  async function load() {
    setLoading(true);
    try {
      const list = await fetchAllProducts();
      setItems(list.filter((p) => p.categoria === GIFT_CATEGORY));
    } catch (err) {
      setMsg('Erro ao carregar sugestões: ' + (err.message || ''));
    } finally {
      setLoading(false);
    }
  }

  // Recarrega quando o import termina (refreshKey muda)
  useEffect(() => {
    load();
  }, [refreshKey]);

  async function handleDelete(item) {
    if (!window.confirm(`Excluir a sugestão "${item.nome}"?`)) return;
    try {
      await deleteProduct(item.id);
      setItems((prev) => prev.filter((p) => p.id !== item.id));
      setMsg('Sugestão excluída.');
      setTimeout(() => setMsg(''), 3000);
    } catch (err) {
      setMsg('Erro ao excluir: ' + (err.message || ''));
    }
  }

  async function toggleGift(item) {
    const active = (item.keywords || '').includes(GIFT_ACTIVE);
    const fd = new FormData();
    fd.append('keywords', active ? '' : GIFT_ACTIVE);
    try {
      await updateProduct(item.id, fd);
      await load();
    } catch (err) {
      setMsg('Erro ao alterar status: ' + (err.message || ''));
    }
  }

  return (
    <section className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
      <div className="flex items-center justify-between gap-4 flex-wrap mb-4">
        <div>
          <h2 className="text-lg font-semibold text-white">🎁 Sugestões de presente</h2>
          <p className="mt-1 text-xs text-neutral-500">
            Banners exibidos no rodapé. Eles não aparecem no catálogo normal de produtos.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setEditing(null);
            setShowForm(true);
          }}
          className="bg-yellow-400 hover:bg-yellow-300 text-black font-semibold text-sm px-4 py-2 rounded-lg transition-colors"
        >
          + Nova sugestão
        </button>
      </div>

      {msg && <p className="text-xs text-green-400 mb-3">{msg}</p>}

      {showForm && (
        <GiftBannerForm
          initial={editing}
          onCancel={() => {
            setShowForm(false);
            setEditing(null);
          }}
          onSaved={async () => {
            await load();
            setShowForm(false);
            setEditing(null);
            setMsg('Sugestão salva com sucesso!');
            setTimeout(() => setMsg(''), 3000);
          }}
        />
      )}

      {!showForm && (
        loading ? (
          <p className="text-sm text-neutral-500">Carregando sugestões...</p>
        ) : items.length === 0 ? (
          <p className="text-sm text-neutral-500">Nenhuma sugestão cadastrada.</p>
        ) : (
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {items.map((item) => {
              const image = productImageUrl(item, item.images && item.images[0]);
              const firstLink = parseJsonArray(item.links)[0] || {};
              const active = (item.keywords || '').includes(GIFT_ACTIVE);
              return (
                <div key={item.id} className="rounded-xl border border-neutral-800 bg-neutral-950/60 p-4">
                  <div className="h-32 overflow-hidden rounded-lg border border-neutral-800 bg-black flex items-center justify-center">
                    {image ? (
                      <img src={image} alt={item.nome} className="h-full w-full object-contain" />
                    ) : (
                      <span className="text-xs text-neutral-600">Sem imagem</span>
                    )}
                  </div>
                  <p className="mt-3 font-semibold text-white line-clamp-1">{item.nome || 'Sugestão de presente'}</p>
                  <p className="mt-1 text-xs text-neutral-500 line-clamp-1">{firstLink.url || 'Sem link'}</p>
                  <div className="mt-4 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => toggleGift(item)}
                      className={`text-xs px-2 py-1 rounded-full border ${
                        active
                          ? 'border-green-700 text-green-400 bg-green-950/30'
                          : 'border-neutral-700 text-neutral-500'
                      }`}
                    >
                      {active ? 'Ativo' : 'Inativo'}
                    </button>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setEditing(item);
                          setShowForm(true);
                        }}
                        className="text-xs text-yellow-400 hover:text-yellow-300"
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(item)}
                        className="text-xs text-red-400 hover:text-red-300"
                      >
                        Excluir
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )
      )}
    </section>
  );
}

function GiftBannerForm({ initial, onSaved, onCancel }) {
  const editing = !!initial;
  const initialLink = parseJsonArray(initial?.links)[0] || {};
  const [titulo, setTitulo] = useState(initial?.nome || 'Sugestão de presente');
  const [link, setLink] = useState(initialLink.url || '');
  const [botao, setBotao] = useState(initial?.resumo || initialLink.loja || 'Saiba mais');
  const [active, setActive] = useState(initial ? (initial.keywords || '').includes(GIFT_ACTIVE) : true);
  const [newFile, setNewFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef();

  const existingImage =
    initial && initial.images && initial.images[0] ? productImageUrl(initial, initial.images[0]) : null;

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!titulo.trim()) {
      setError('Digite um título para a sugestão.');
      return;
    }
    if (!link.trim()) {
      setError('Cole o link de afiliado.');
      return;
    }
    if (!editing && !newFile) {
      setError('Escolha uma imagem/banner.');
      return;
    }
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('nome', titulo.trim());
      fd.append('marca', 'GMONEY');
      fd.append('segmento', '');
      fd.append('categoria', GIFT_CATEGORY);
      fd.append('keywords', active ? GIFT_ACTIVE : '');
      fd.append('resumo', botao.trim() || 'Saiba mais');
      fd.append('preco', '');
      fd.append('consideracoes', '');
      fd.append('ativo', 'false');
      fd.append('specs', JSON.stringify([]));
      fd.append('links', JSON.stringify([{ loja: botao.trim() || 'Saiba mais', url: link.trim() }]));
      if (newFile) {
        if (editing && Array.isArray(initial.images) && initial.images.length) {
          fd.append('images-', initial.images.join(','));
        }
        fd.append('images', newFile);
      }
      if (editing) {
        await updateProduct(initial.id, fd);
      } else {
        await createProduct(fd);
      }
      await onSaved();
    } catch (err) {
      setError('Erro ao salvar sugestão: ' + (err.message || JSON.stringify(err.response?.data || '')));
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-5 rounded-xl border border-yellow-900/50 bg-neutral-950/70 p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-white">{editing ? 'Editar sugestão' : 'Nova sugestão'}</h3>
        <button type="button" onClick={onCancel} className="text-xs text-neutral-400 hover:text-white">Cancelar ✕</button>
      </div>
      {error && <div className="rounded-lg border border-red-800 bg-red-950/40 px-3 py-2 text-xs text-red-300">{error}</div>}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className={labelCls}>Frase promocional *</label>
          <input
            className={inputCls}
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Ex.: O presente perfeito para quem ama cozinhar!"
          />
          <p className="mt-1 text-xs text-neutral-500">
            Esta frase aparecerá no carrossel antes da imagem do produto.
          </p>
        </div>
        <div className="sm:col-span-2">
          <label className={labelCls}>Link de afiliado *</label>
          <input className={inputCls} value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://..." />
        </div>
        <div>
          <label className={labelCls}>Texto do botão</label>
          <input className={inputCls} value={botao} onChange={(e) => setBotao(e.target.value)} placeholder="Saiba mais" />
        </div>
        <div className="flex items-end pb-2">
          <label className="flex items-center gap-2 text-sm text-neutral-300 cursor-pointer">
            <input
              type="checkbox"
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
              className="h-4 w-4 accent-yellow-400"
            />
            Exibir no rodapé
          </label>
        </div>
      </div>
      <div>
        <label className={labelCls}>Imagem/banner *</label>
        <div className="flex items-center gap-4 flex-wrap">
          <div className="h-28 w-44 overflow-hidden rounded-lg border border-neutral-700 bg-black flex items-center justify-center">
            {newFile ? (
              <img src={URL.createObjectURL(newFile)} alt="novo banner" className="h-full w-full object-contain" />
            ) : existingImage ? (
              <img src={existingImage} alt="banner atual" className="h-full w-full object-contain" />
            ) : (
              <span className="text-xs text-neutral-600">Sem imagem</span>
            )}
          </div>
          <div>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="bg-yellow-400 hover:bg-yellow-300 text-black font-semibold text-sm px-4 py-2 rounded-lg"
            >
              {existingImage || newFile ? 'Trocar imagem' : 'Escolher imagem'}
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => setNewFile(e.target.files?.[0] || null)}
            />
          </div>
        </div>
      </div>
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={saving} className="bg-yellow-400 hover:bg-yellow-300 text-black font-semibold text-sm px-5 py-2 rounded-lg disabled:opacity-60">
          {saving ? 'Salvando...' : 'Salvar sugestão'}
        </button>
        <button type="button" onClick={onCancel} className="text-sm text-neutral-400 hover:text-white px-4 py-2">Cancelar</button>
      </div>
    </form>
  );
}

// ── Templates de especificações ──────────────────────────────────────────
const SPEC_TEMPLATES_COLLECTION = 'spec_templates';

// Lê o campo `chaves` aceitando array já parseado (campo JSON do PocketBase)
// ou string JSON (campo texto), e devolve sempre um array de strings limpas.
function parseTemplateChaves(value) {
  return parseJsonArray(value).map((k) => String(k || '').trim()).filter(Boolean);
}

async function fetchAllSpecTemplates() {
  const list = await pb.collection(SPEC_TEMPLATES_COLLECTION).getFullList({ sort: 'nome' });
  return list.map((r) => ({
    id: r.id,
    nome: String(r.nome || '').trim(),
    chaves: parseTemplateChaves(r.chaves),
  }));
}

// Janela dedicada para cadastrar/editar/excluir templates de especificações.
// Aberta por cima do ProductForm (z-[60]) ou pela barra de Produtos.
function SpecTemplatesModal({ onClose }) {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // template em edição (null = novo)
  const [nome, setNome] = useState('');
  const [chaves, setChaves] = useState(['']);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  async function load() {
    setLoading(true);
    try {
      setTemplates(await fetchAllSpecTemplates());
    } catch (err) {
      setError('Erro ao carregar templates: ' + (err.message || ''));
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    load();
  }, []);

  function startNew() {
    setEditing(null);
    setNome('');
    setChaves(['']);
    setError('');
  }
  function startEdit(t) {
    setEditing(t);
    setNome(t.nome);
    setChaves(t.chaves.length ? [...t.chaves] : ['']);
    setError('');
  }
  function setChave(i, v) {
    setChaves((prev) => prev.map((c, idx) => (idx === i ? v : c)));
  }
  function addChave() {
    setChaves((prev) => [...prev, '']);
  }
  function removeChave(i) {
    setChaves((prev) => prev.filter((_, idx) => idx !== i));
  }

  async function handleSave(e) {
    e.preventDefault();
    setError('');
    const nomeLimpo = nome.trim();
    if (!nomeLimpo) {
      setError('Dê um nome ao template (ex.: o nome da categoria).');
      return;
    }
    const chavesLimpa = chaves.map((c) => c.trim()).filter(Boolean);
    if (chavesLimpa.length === 0) {
      setError('Adicione pelo menos uma chave de especificação.');
      return;
    }
    setSaving(true);
    try {
      const payload = { nome: nomeLimpo, chaves: JSON.stringify(chavesLimpa) };
      if (editing) {
        await pb.collection(SPEC_TEMPLATES_COLLECTION).update(editing.id, payload);
        setMsg('Template atualizado.');
      } else {
        await pb.collection(SPEC_TEMPLATES_COLLECTION).create(payload);
        setMsg('Template criado com sucesso!');
      }
      setTimeout(() => setMsg(''), 3000);
      startNew();
      await load();
    } catch (err) {
      setError('Erro ao salvar template: ' + (err.message || JSON.stringify(err.response?.data || '')));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(t) {
    if (!window.confirm(`Excluir o template "${t.nome}"?`)) return;
    try {
      await pb.collection(SPEC_TEMPLATES_COLLECTION).delete(t.id);
      if (editing && editing.id === t.id) startNew();
      await load();
      setMsg('Template excluído.');
      setTimeout(() => setMsg(''), 3000);
    } catch (err) {
      setError('Erro ao excluir: ' + (err.message || ''));
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl bg-neutral-900 border border-neutral-700 p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">📋 Templates de especificações</h2>
          <button type="button" onClick={onClose} className="text-xs text-neutral-400 hover:text-white">Fechar ✕</button>
        </div>
        <p className="text-xs text-neutral-400 leading-relaxed">
          Um template guarda a lista de chaves (nomes das especificações) típicas de uma categoria.
          Ao criar ou editar um produto, selecione o template e as chaves entram de uma vez,
          prontas para você preencher só os valores.
        </p>

        {msg && <p className="text-xs text-green-400">{msg}</p>}
        {error && <div className="rounded-lg border border-red-800 bg-red-950/40 px-3 py-2 text-xs text-red-300">{error}</div>}

        {/* Formulário de criar/editar template */}
        <form onSubmit={handleSave} className="rounded-xl border border-yellow-900/50 bg-neutral-950/70 p-5 space-y-4">
          <h3 className="font-semibold text-white text-sm">{editing ? `Editando: ${editing.nome}` : 'Novo template'}</h3>
          <div>
            <label className={labelCls}>Nome do template (referente à categoria) *</label>
            <input
              className={inputCls}
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex.: Geladeiras, TVs, Ar-condicionado..."
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className={labelCls + ' mb-0'}>Chaves de especificação *</label>
              <button type="button" onClick={addChave} className="text-xs text-yellow-400 hover:text-yellow-300">
                + Adicionar chave
              </button>
            </div>
            <div className="space-y-2">
              {chaves.map((c, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    className={inputCls + ' flex-1'}
                    placeholder={`Chave ${i + 1} (ex.: Capacidade)`}
                    value={c}
                    onChange={(e) => setChave(i, e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => removeChave(i)}
                    disabled={chaves.length === 1}
                    className="bg-neutral-800 border border-neutral-700 text-neutral-400 hover:text-red-400 px-3 rounded-lg text-sm disabled:opacity-40"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <p className="mt-2 text-xs text-neutral-500">
              Só os nomes das especificações. Os valores são preenchidos em cada produto.
            </p>
          </div>
          <div className="flex gap-3 pt-1">
            <button
              type="submit"
              disabled={saving}
              className="bg-yellow-400 hover:bg-yellow-300 text-black font-semibold text-sm px-5 py-2 rounded-lg transition-colors disabled:opacity-60"
            >
              {saving ? 'Salvando...' : editing ? 'Salvar alterações' : 'Criar template'}
            </button>
            {editing && (
              <button type="button" onClick={startNew} className="text-sm text-neutral-400 hover:text-white px-4 py-2">
                Cancelar edição
              </button>
            )}
          </div>
        </form>

        {/* Lista de templates existentes */}
        <div>
          <h3 className="text-sm font-semibold text-white mb-3">Templates cadastrados</h3>
          {loading ? (
            <p className="text-sm text-neutral-500">Carregando templates...</p>
          ) : templates.length === 0 ? (
            <p className="text-sm text-neutral-500">Nenhum template cadastrado ainda.</p>
          ) : (
            <div className="space-y-2">
              {templates.map((t) => (
                <div key={t.id} className="rounded-lg border border-neutral-800 bg-neutral-950/60 p-3">
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white">{t.nome}</p>
                      <p className="text-xs text-neutral-500">
                        {t.chaves.length} chave(s): {t.chaves.join(', ')}
                      </p>
                    </div>
                    <div className="flex gap-3 shrink-0">
                      <button type="button" onClick={() => startEdit(t)} className="text-xs text-yellow-400 hover:text-yellow-300">
                        Editar
                      </button>
                      <button type="button" onClick={() => handleDelete(t)} className="text-xs text-red-400 hover:text-red-300">
                        Excluir
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Product Form (modal) ─────────────────────────────────────────────────
function ProductForm({ initial, onSave, onCancel }) {
  const editing = !!initial;
  const [form, setForm] = useState(() => ({
    ...EMPTY_FORM,
    ...(initial
      ? {
          nome: initial.nome || '',
          marca: initial.marca || '',
          segmento: initial.segmento || '',
          categoria: initial.categoria || '',
          keywords: initial.keywords || '',
          resumo: initial.resumo || '',
          preco: initial.preco || '',
          consideracoes: initial.consideracoes || '',
          ativo: initial.ativo !== false,
          specs: parseJsonArray(initial.specs).map((s) => ({
            nome: String(s?.nome || ''),
            valor: String(s?.valor || ''),
          })),
          links: parseJsonArray(initial.links).map(normalizeLink),
        }
      : {})
  }));
  const [existingImages, setExistingImages] = useState(initial && Array.isArray(initial.images) ? [...initial.images] : []);
  const [newFiles, setNewFiles] = useState([]);
  const [removedImages, setRemovedImages] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef();

  // Templates de especificações
  const [templates, setTemplates] = useState([]);
  const [templatesError, setTemplatesError] = useState('');
  const [showTemplates, setShowTemplates] = useState(false);
  function reloadTemplates() {
    setTemplatesError('');
    fetchAllSpecTemplates()
      .then(setTemplates)
      .catch((err) => {
        setTemplates([]);
        setTemplatesError('Não foi possível carregar os templates: ' + (err.message || ''));
      });
  }
  useEffect(() => {
    reloadTemplates();
  }, []);
  // Aplica o template: entra com todas as chaves de uma vez, valores em branco
  function applyTemplate(t) {
    const temConteudo = form.specs.some((s) => s.nome.trim() || s.valor.trim());
    if (temConteudo && !window.confirm('Aplicar o template substitui as especificações já preenchidas. Continuar?')) {
      return;
    }
    setForm((f) => ({ ...f, specs: t.chaves.map((nome) => ({ nome, valor: '' })) }));
  }

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  // specs helpers
  const addSpec = () => setForm((f) => ({ ...f, specs: [...f.specs, { nome: '', valor: '' }] }));
  const setSpec = (i, k, v) =>
    setForm((f) => ({ ...f, specs: f.specs.map((s, idx) => (idx === i ? { ...s, [k]: v } : s)) }));
  const removeSpec = (i) => setForm((f) => ({ ...f, specs: f.specs.filter((_, idx) => idx !== i) }));

  // links helpers (máx 10)
  const addLink = () =>
    setForm((f) => (f.links.length >= 10 ? f : { ...f, links: [...f.links, { loja: '', url: '' }] }));
  const setLink = (i, k, v) =>
    setForm((f) => ({ ...f, links: f.links.map((l, idx) => (idx === i ? { ...l, [k]: v } : l)) }));
  const removeLink = (i) => setForm((f) => ({ ...f, links: f.links.filter((_, idx) => idx !== i) }));

  function onPickFiles(e) {
    const files = Array.from(e.target.files);
    setNewFiles((prev) => {
      const next = [...prev, ...files];
      const room = Math.max(0, 4 - (existingImages.length - removedImages.length));
      return next.slice(0, room);
    });
    e.target.value = '';
  }

  function removeNewFile(i) {
    setNewFiles((prev) => prev.filter((_, idx) => idx !== i));
  }
  function removeExisting(filename) {
    setRemovedImages((prev) => [...prev, filename]);
  }
  function undoRemove(filename) {
    setRemovedImages((prev) => prev.filter((f) => f !== filename));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!form.nome.trim()) {
      setError('O nome do produto é obrigatório.');
      return;
    }
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('nome', form.nome);
      fd.append('marca', form.marca);
      fd.append('segmento', form.segmento);
      fd.append('categoria', form.categoria);
      fd.append('keywords', form.keywords);
      fd.append('resumo', form.resumo);
      fd.append('preco', form.preco);
      fd.append('consideracoes', form.consideracoes);
      fd.append('ativo', form.ativo ? 'true' : 'false');
      fd.append('specs', JSON.stringify(form.specs.filter((s) => s.nome.trim() || s.valor.trim())));
      fd.append('links', JSON.stringify(form.links.filter((l) => l.loja.trim() || l.url.trim())));
      if (editing && removedImages.length) {
        fd.append('images-', removedImages.join(','));
      }
      newFiles.forEach((f) => fd.append('images', f));
      if (editing) {
        const updated = await updateProduct(initial.id, fd);
        onSave(updated);
      } else {
        const created = await createProduct(fd);
        onSave(created);
      }
    } catch (err) {
      setError('Erro ao salvar: ' + (err.message || JSON.stringify(err.response?.data || '')));
    } finally {
      setSaving(false);
    }
  }

  const totalImages = existingImages.length - removedImages.length + newFiles.length;
  const canAddImages = totalImages < 4;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl bg-neutral-900 border border-neutral-700">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">{editing ? 'Editar produto' : 'Novo produto'}</h2>
            <button type="button" onClick={onCancel} className="text-xs text-neutral-400 hover:text-white">Fechar ✕</button>
          </div>
          {error && (
            <div className="bg-red-950/40 border border-red-800 rounded-lg px-3 py-2 text-red-300 text-xs">
              {error}
            </div>
          )}

          {/* Dados básicos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className={labelCls}>Nome oficial *</label>
              <input className={inputCls} value={form.nome} onChange={(e) => set('nome', e.target.value)} required />
            </div>
            <div>
              <label className={labelCls}>Marca</label>
              <input className={inputCls} value={form.marca} onChange={(e) => set('marca', e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Segmento</label>
              <select className={inputCls} value={form.segmento} onChange={(e) => set('segmento', e.target.value)}>
                <option value="">- Selecione -</option>
                {segments.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.nome}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls}>Categoria</label>
              <input className={inputCls} value={form.categoria} onChange={(e) => set('categoria', e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Valor/Frase/Em branco</label>
              <input className={inputCls} value={form.preco} onChange={(e) => set('preco', e.target.value)} placeholder="R$ 0.000" />
            </div>
            <div className="sm:col-span-2">
              <label className={labelCls}>Palavras-chave (separadas por vírgula)</label>
              <input
                className={inputCls}
                value={form.keywords}
                onChange={(e) => set('keywords', e.target.value)}
                placeholder="geladeira, frost free, duplex"
              />
            </div>
            <div className="sm:col-span-2">
              <label className={labelCls}>Descrição / Resumo</label>
              <textarea className={inputCls} rows={2} value={form.resumo} onChange={(e) => set('resumo', e.target.value)} />
            </div>
            <div className="sm:col-span-2">
              <label className={labelCls}>Considerações finais</label>
              <textarea
                className={inputCls}
                rows={3}
                value={form.consideracoes}
                onChange={(e) => set('consideracoes', e.target.value)}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="flex items-center gap-2 text-sm text-neutral-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.ativo}
                  onChange={(e) => set('ativo', e.target.checked)}
                  className="h-4 w-4 accent-yellow-400"
                />
                Produto ativo (visível no site)
              </label>
            </div>
          </div>

          {/* Imagens */}
          <div>
            <label className={labelCls}>Imagens do produto (até 4)</label>
            <div className="flex gap-2 flex-wrap mb-3">
              {existingImages.map((filename) => {
                const removed = removedImages.includes(filename);
                return (
                  <div
                    key={filename}
                    className={`relative w-20 h-20 bg-neutral-800 border rounded-lg overflow-hidden ${
                      removed ? 'border-red-700 opacity-40' : 'border-neutral-700'
                    }`}
                  >
                    <img src={productImageUrl(initial, filename)} alt="produto" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => (removed ? undoRemove(filename) : removeExisting(filename))}
                      className="absolute top-0.5 right-0.5 bg-red-600 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center leading-none"
                      title={removed ? 'Restaurar' : 'Remover'}
                    >
                      {removed ? '↺' : '×'}
                    </button>
                  </div>
                );
              })}
              {newFiles.map((file, i) => (
                <div key={i} className="relative w-20 h-20 bg-neutral-800 border border-yellow-700 rounded-lg overflow-hidden">
                  <img src={URL.createObjectURL(file)} alt="nova" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeNewFile(i)}
                    className="absolute top-0.5 right-0.5 bg-red-600 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center leading-none"
                    title="Remover"
                  >
                    ×
                  </button>
                </div>
              ))}
              {canAddImages && (
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="w-20 h-20 border border-dashed border-neutral-600 rounded-lg flex items-center justify-center text-neutral-500 text-2xl hover:border-yellow-500 hover:text-yellow-400"
                >
                  +
                </button>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={onPickFiles} />
            <p className="text-xs text-neutral-500">{totalImages}/4 imagens.</p>
          </div>

          {/* Especificações */}
          <div className="flex items-center justify-between mb-2 gap-2 flex-wrap">
            <label className={labelCls + ' mb-0'}>Especificações técnicas</label>
            <div className="flex items-center gap-3 flex-wrap">
              <select
                className={inputBase + ' text-xs py-1.5'}
                value=""
                onChange={(e) => {
                  const t = templates.find((x) => x.id === e.target.value);
                  if (t) applyTemplate(t);
                  e.target.value = '';
                }}
              >
                <option value="">{templates.length ? 'Selecionar template...' : 'Nenhum template cadastrado'}</option>
                {templates.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.nome} ({t.chaves.length} chave(s))
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => setShowTemplates(true)}
                className="text-xs text-yellow-400 hover:text-yellow-300"
              >
                ⚙ Gerenciar templates
              </button>
              <button type="button" onClick={addSpec} className="text-xs text-yellow-400 hover:text-yellow-300">
                + Adicionar especificação
              </button>
            </div>
          </div>
          {templatesError && <p className="text-xs text-red-400 mb-2">{templatesError}</p>}

          {/* Links de compra */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className={labelCls + ' mb-0'}>Links de compra (até 10)</label>
              <button
                type="button"
                onClick={addLink}
                disabled={form.links.length >= 10}
                className="text-xs text-yellow-400 hover:text-yellow-300 disabled:opacity-40"
              >
                + Adicionar link
              </button>
            </div>
            <div className="space-y-2">
              {form.links.map((l, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    className={inputBase + ' w-40 shrink-0'}
                    placeholder="Plataforma (ex.: Amazon)"
                    value={l.loja}
                    onChange={(e) => setLink(i, 'loja', e.target.value)}
                  />
                  <input
                    className={inputBase + ' min-w-0 flex-1'}
                    placeholder="URL de afiliado (https://...)"
                    value={l.url}
                    onChange={(e) => setLink(i, 'url', e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => removeLink(i)}
                    className="bg-neutral-800 border border-neutral-700 text-neutral-400 hover:text-red-400 px-3 rounded-lg text-sm"
                  >
                    ×
                  </button>
                </div>
              ))}
              {form.links.length === 0 && <p className="text-xs text-neutral-500">Nenhum link adicionado.</p>}
            </div>
          </div>

          {/* Ações fixas no rodapé do modal */}
          <div className="sticky bottom-0 -mx-6 px-6 py-4 border-t border-neutral-800 bg-neutral-900 flex items-center gap-3">
            <button
              type="submit"
              disabled={saving}
              className="bg-yellow-400 hover:bg-yellow-300 text-black font-semibold text-sm px-5 py-2 rounded-lg transition-colors disabled:opacity-60"
            >
              {saving ? 'Salvando...' : editing ? 'Salvar alterações' : 'Criar produto'}
            </button>
            <button type="button" onClick={onCancel} className="text-sm text-neutral-400 hover:text-white px-4 py-2">
              Cancelar
            </button>
          </div>
        </form>
      </div>
      {showTemplates && (
        <SpecTemplatesModal
          onClose={() => {
            setShowTemplates(false);
            reloadTemplates();
          }}
        />
      )}
    </div>
  );
}

// ── Products Manager ─────────────────────────────────────────────────────
function ProductsManager({ refreshKey = 0, onImported }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [msg, setMsg] = useState('');
  const [templatesOpen, setTemplatesOpen] = useState(false);


  async function load() {
    setLoading(true);
    try {
      const list = await fetchAllProducts();
      setItems(list.filter((p) => p.categoria !== GIFT_CATEGORY));
    } catch (err) {
      setMsg('Erro ao carregar produtos: ' + (err.message || ''));
    } finally {
      setLoading(false);
    }
  }

  // Recarrega quando o import termina (refreshKey muda)
  useEffect(() => {
    load();
  }, [refreshKey]);

  function openNew() {
    setEditing(null);
    setShowForm(true);
  }
  function openEdit(product) {
    setEditing(product);
    setShowForm(true);
  }
  function closeForm() {
    setShowForm(false);
    setEditing(null);
  }

  function handleImported() {
    if (typeof onImported === 'function') {
      onImported(); // muda o refreshKey no AdminPage, os dois managers recarregam
    } else {
      load();
    }
  }

  async function handleSaved() {
    await load();
    closeForm();
    setMsg('Produto salvo com sucesso!');
    setTimeout(() => setMsg(''), 3000);
  }

  async function handleDelete(product) {
    if (!window.confirm(`Excluir "${product.nome}"? Esta ação não pode ser desfeita.`)) return;
    try {
      await deleteProduct(product.id);
      setItems((prev) => prev.filter((p) => p.id !== product.id));
      setMsg('Produto excluído.');
      setTimeout(() => setMsg(''), 3000);
    } catch (err) {
      setMsg('Erro ao excluir: ' + (err.message || ''));
    }
  }

  async function toggleAtivo(product) {
    try {
      const updated = await updateProduct(product.id, {
        ativo: !product.ativo
      });
      setItems((prev) => prev.map((p) => (p.id === product.id ? updated : p)));
    } catch (err) {
      setMsg('Erro ao alterar status: ' + (err.message || ''));
    }
  }

  const filtered = items.filter(
    (p) =>
      (p.nome || '').toLowerCase().includes(search.toLowerCase()) ||
      (p.marca || '').toLowerCase().includes(search.toLowerCase()) ||
      (p.categoria || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section>
      <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
        {/* Esquerda: label + botão de importar, com espaçamento entre eles */}
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold text-white">Produtos ({items.length})</h2>
          <button
            type="button"
            onClick={() => setTemplatesOpen(true)}
            className="bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-neutral-200 text-sm px-4 py-1.5 rounded-lg transition-colors"
          >
            📋 Templates de specs
          </button>
        </div>
        
        {/* Direita: busca + novo produto */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Buscar produto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-yellow-500 w-48"
          />
          <button
            onClick={openNew}
            className="bg-yellow-400 hover:bg-yellow-300 text-black font-semibold text-sm px-4 py-1.5 rounded-lg transition-colors"
          >
            + Novo produto
          </button>
        </div>
      </div>

      {msg && <p className="text-xs text-green-400 mb-3">{msg}</p>}

      {loading ? (
        <p className="text-sm text-neutral-500">Carregando produtos...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-neutral-500 border-b border-neutral-800">
                <th className="py-2 pr-3">Produto</th>
                <th className="py-2 pr-3">Marca</th>
                <th className="py-2 pr-3">Segmento</th>
                <th className="py-2 pr-3">Imagens</th>
                <th className="py-2 pr-3">Status</th>
                <th className="py-2 pr-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => {
                const thumb = productImageUrl(p, p.images && p.images[0]);
                const segNome = segments.find((s) => s.id === p.segmento)?.nome || p.segmento;
                return (
                  <tr key={p.id} className="border-b border-neutral-900 hover:bg-neutral-900/40">
                    <td className="py-3 pr-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-neutral-800 border border-neutral-700 rounded overflow-hidden shrink-0">
                          {thumb ? <img src={thumb} alt="" className="w-full h-full object-cover" /> : null}
                        </div>
                        <div className="min-w-0">
                          <p className="text-white truncate max-w-[220px]">{p.nome}</p>
                          <p className="text-xs text-neutral-500">{p.preco}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 pr-3 text-neutral-300">{p.marca}</td>
                    <td className="py-3 pr-3 text-neutral-400">{segNome}</td>
                    <td className="py-3 pr-3 text-neutral-400">{(p.images || []).length}/4</td>
                    <td className="py-3 pr-3">
                      <button
                        onClick={() => toggleAtivo(p)}
                        className={`text-xs px-2 py-1 rounded-full border ${
                          p.ativo !== false
                            ? 'border-green-700 text-green-400 bg-green-950/30'
                            : 'border-neutral-700 text-neutral-500'
                        }`}
                      >
                        {p.ativo !== false ? 'Ativo' : 'Inativo'}
                      </button>
                    </td>
                    <td className="py-3 pr-3 text-right whitespace-nowrap">
                      <button onClick={() => openEdit(p)} className="text-xs text-yellow-400 hover:text-yellow-300 mr-3">
                        Editar
                      </button>
                      <button onClick={() => handleDelete(p)} className="text-xs text-red-400 hover:text-red-300">
                        Excluir
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-neutral-500">
                    Nenhum produto cadastrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal de produto (novo/editar) */}
      {showForm && (
        <ProductForm initial={editing} onSave={handleSaved} onCancel={closeForm} />
      )}

      {/* Modal de importação */}
      {importOpen && (
        <ImportProductsModal onClose={() => setImportOpen(false)} onImported={handleImported} />
      )}

      {templatesOpen && (
        <SpecTemplatesModal onClose={() => setTemplatesOpen(false)} />
      )}
    </section>
  );
}

// ── Importação de produtos (JSON) ────────────────────────────────────────
function ImportProductsModal({ onClose, onImported }) {
  const [items, setItems] = useState(null);        // registros lidos do arquivo
  const [fixLinks, setFixLinks] = useState(true);  // corrige loja ↔ url trocados
  const [status, setStatus] = useState('idle');    // idle | importing | done
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [ignoredGifts, setIgnoredGifts] = useState(0); // sugestões ignoradas (__gift_banner__)
  const fileRef = useRef();

  // Chave primária usada para comparar se o produto já existe.
  // O campo escolhido é o `id` (chave natural do export do PocketBase).
  // Troque aqui se o seu JSON usar outra chave (ex.: "codigo", "sku").
  const PRODUCT_ID_FIELD = 'id';

  function normalizeRecord(raw) {
    const nome = String(raw?.nome || '').trim();
    if (!nome) return null; // registro sem nome não é importado

    // Regra da chave primária:
    // - ausente no JSON           -> pk = '' -> cria nova tupla
    // - presente com valor null   -> pk = '' -> cria nova tupla
    // - presente vazio "" ou "  " -> pk = '' -> cria nova tupla
    // - presente e preenchido     -> pk = "abc123..." -> compara com o banco
    const pkValue = raw?.[PRODUCT_ID_FIELD];
    const pk = pkValue == null ? '' : String(pkValue).trim();

    const normalizeLinks = (links) => {
      if (!Array.isArray(links)) return [];
      return links
        .map((l) => ({ loja: String(l?.loja || '').trim(), url: String(l?.url || '').trim() }))
        .filter((l) => l.loja || l.url)
        .map((l) => {
          const lojaEhUrl = /^https?:\/\//i.test(l.loja);
          const urlVazia = !/^https?:\/\//i.test(l.url);
          // export antigo veio com loja = URL e url vazio, normaliza
          if (fixLinks && lojaEhUrl && urlVazia) return { loja: '', url: l.loja };
          return l;
        });
    };

    return {
      pk,               // valor da chave primária ('' = sem chave válida)
      hasPk: pk.length > 0,
      nome,
      ativo: raw.ativo !== false,
      marca: String(raw?.marca || '').trim(),
      segmento: String(raw?.segmento || '').trim(),
      categoria: String(raw?.categoria || '').trim(),
      keywords: String(raw?.keywords || '').trim(),
      resumo: String(raw?.resumo || '').trim(),
      consideracoes: String(raw?.consideracoes || '').trim(),
      preco: String(raw?.preco ?? '').trim(),
      specs: Array.isArray(raw?.specs)
        ? raw.specs
            .filter((s) => s && (String(s.nome || '').trim() || String(s.valor || '').trim()))
            .map((s) => ({ nome: String(s.nome || '').trim(), valor: String(s.valor || '').trim() }))
        : [],
      links: normalizeLinks(raw?.links)
      // images não são importadas: o export guarda só nomes de arquivo,
      // e os arquivos ficam no armazenamento do PocketBase (não vêm no JSON).
    };
  }
  

  function onPickFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError('');
    setResult(null);
    setStatus('idle');
    setIgnoredGifts(0); // zera ao trocar de arquivo
    const reader = new FileReader();
    reader.onload = () => {
      try {
        let parsed = JSON.parse(reader.result);
        if (!Array.isArray(parsed)) {
          if (parsed && Array.isArray(parsed.items)) parsed = parsed.items;
          else throw new Error('O arquivo deve conter um array JSON de produtos.');
        }
        const rawRecords = parsed.filter(
          (r) => !r.collectionName || r.collectionName === 'products'
        );
        // NÃO importa sugestões de presente (categoria __gift_banner__)
        const giftCount = rawRecords.filter(
          (r) => String(r?.categoria || '').trim() === GIFT_CATEGORY
        ).length;
        setIgnoredGifts(giftCount);
        const valid = rawRecords
          .filter((r) => String(r?.categoria || '').trim() !== GIFT_CATEGORY)
          .map(normalizeRecord)
          .filter(Boolean);
        if (valid.length === 0) {
          setError('Nenhum produto válido encontrado no arquivo.');
          setItems([]);
          return;
        }
        setItems(valid);
      } catch (err) {
        setError('Não foi possível ler o JSON: ' + (err.message || ''));
        setItems(null);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  }

  async function handleImport() {
    if (!items || items.length === 0) return;
    setStatus('importing');
    setError('');
    setResult(null);

    // Base de produtos existentes: compara por id E por nome.
    // O nome é a proteção para registros que já entraram sem preservar
    // o id do JSON (inseridos antes da correção de duplicidade).
    let existing = [];
    try {
      existing = await fetchAllProducts();
    } catch {
      // sem referência, segue em frente
    }
    const seen = new Set();
    existing.forEach((p) => {
      if (p.id) seen.add('id:' + p.id);
      const n = String(p.nome || '').trim().toLowerCase();
      if (n) seen.add('n:' + n);
    });

    let imported = 0, skipped = 0, errors = 0, noPk = 0;
    const errorSamples = [];
    const queue = items.slice();
    const total = queue.length;

    async function worker() {
      while (queue.length) {
        const rec = queue.shift();
        const nomeLower = rec.nome.toLowerCase();

        // Regra da chave primária:
        // 1) sem chave (ausente, null ou vazia) -> SEMPRE cria nova tupla
        // 2) com chave e já existe (por id ou por nome) -> pula
        // 3) com chave e não existe -> cria, preservando o id do JSON
        const payload = {
          nome: rec.nome,
          ativo: rec.ativo,
          marca: rec.marca,
          segmento: rec.segmento,
          categoria: rec.categoria,
          keywords: rec.keywords,
          resumo: rec.resumo,
          consideracoes: rec.consideracoes,
          preco: rec.preco,
          specs: rec.specs,
          links: rec.links
        };

        if (!rec.hasPk) {
          noPk++;
          try {
            await pb.collection('products').create(payload);
            imported++;
          } catch (err) {
            errors++;
            if (errorSamples.length < 5) {
              errorSamples.push(rec.nome + ': ' + (err.message || 'erro ao criar'));
            }
          }
        } else if (seen.has('id:' + rec.pk) || seen.has('n:' + nomeLower)) {
          skipped++;
        } else {
          seen.add('id:' + rec.pk);
          seen.add('n:' + nomeLower);
          try {
            // envia o id do JSON para o PocketBase guardar a mesma chave;
            // assim o próximo import encontra o registro e pula
            await pb.collection('products').create({ ...payload, id: rec.pk });
            imported++;
          } catch (err) {
            // se o PocketBase recusar o id customizado (formato ou permissão),
            // cria sem id; a checagem por nome continua protegendo
            try {
              await pb.collection('products').create(payload);
              imported++;
            } catch (err2) {
              errors++;
              if (errorSamples.length < 5) {
                errorSamples.push(rec.nome + ': ' + (err2.message || 'erro ao criar'));
              }
            }
          }
        }
        setProgress({ done: total - queue.length, total });
      }
    }

    // lotes paralelos pequenos (autoCancellation já está desativado no topo do arquivo)
    await Promise.all(Array.from({ length: 5 }, worker));
    setStatus('done');
    setResult({ imported, skipped, errors, noPk, errorSamples });
    if (onImported) onImported(); // avisa o admin para recarregar as listas
  }

  const pct = progress.total > 0 ? Math.round((progress.done / progress.total) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-lg bg-neutral-900 border border-neutral-700 rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">📥 Importar produtos</h2>
          <button type="button" onClick={onClose} className="text-xs text-neutral-400 hover:text-white">Fechar ✕</button>
        </div>
        <p className="text-xs text-neutral-400 leading-relaxed">
          Importa produtos em lote a partir de um arquivo <code className="text-yellow-400">.json</code>.
          Regra da chave primária (<code className="text-yellow-400">id</code>): se o campo existir preenchido,
          o produto é comparado com os já cadastrados por <code className="text-yellow-400">id</code> e por
          nome; se já existir, é pulado; se não existir, é criado preservando o id do arquivo.
          Se o campo estiver ausente, <code className="text-yellow-400">null</code> ou vazio, o produto é
          sempre criado como novo. Sugestões de presente (categoria <code className="text-yellow-400">__gift_banner__</code>)
          não são importadas.
        </p>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="bg-yellow-400 hover:bg-yellow-300 text-black font-semibold text-sm px-4 py-2 rounded-lg transition-colors"
          >
            {items ? 'Trocar arquivo' : 'Escolher arquivo JSON'}
          </button>
          <input ref={fileRef} type="file" accept=".json,application/json" className="hidden" onChange={onPickFile} />
          {items && <span className="text-sm text-neutral-300">{items.length} produto(s) prontos para importar</span>}
          {ignoredGifts > 0 && (
            <span className="text-xs text-neutral-500">
              ({ignoredGifts} sugestão(ões) de presente ignorada(s) - categoria __gift_banner__)
            </span>
          )}
        </div>

        <label className="flex items-center gap-2 text-sm text-neutral-300 cursor-pointer">
          <input
            type="checkbox"
            checked={fixLinks}
            onChange={(e) => setFixLinks(e.target.checked)}
            className="h-4 w-4 accent-yellow-400"
          />
          Corrigir links invertidos (loja ↔ url)
        </label>

        {error && <div className="rounded-lg border border-red-800 bg-red-950/40 px-3 py-2 text-xs text-red-300">{error}</div>}

        {status === 'importing' && (
          <div className="space-y-2">
            <div className="h-2 rounded-full bg-neutral-800 overflow-hidden">
              <div className="h-full bg-yellow-400 transition-all" style={{ width: pct + '%' }} />
            </div>
            <p className="text-xs text-neutral-400">Importando {progress.done} de {progress.total}...</p>
          </div>
        )}

        {status === 'done' && result && (
          <div className="rounded-lg border border-green-800 bg-green-950/20 px-3 py-2 text-xs text-green-300 space-y-1">
            <p>
              ✅ Importados: <b>{result.imported}</b> | Já existentes (pulados): <b>{result.skipped}</b> | Erros: <b>{result.errors}</b>
            </p>
            {result.noPk > 0 && (
              <p className="text-neutral-400">
                ↳ {result.noPk} registro(s) entraram como novos por não terem chave primária válida no JSON.
              </p>
            )}
            {result.errorSamples.length > 0 && (
              <ul className="list-disc pl-4 text-red-300">
                {result.errorSamples.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            )}
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={handleImport}
            disabled={!items || items.length === 0 || status === 'importing'}
            className="bg-yellow-400 hover:bg-yellow-300 text-black font-semibold text-sm px-5 py-2 rounded-lg transition-colors disabled:opacity-50"
          >
            {status === 'importing' ? 'Importando...' : `Importar ${items ? items.length : 0} produto(s)`}
          </button>
          <button type="button" onClick={onClose} className="text-sm text-neutral-400 hover:text-white px-4 py-2">Cancelar</button>
        </div>
      </div>
    </div>
  );
}

// ── Main Admin Panel ─────────────────────────────────────────────────────
export default function AdminPage() {
  const [authed, setAuthed] = useState(pb.authStore.isValid);
  const [refreshKey, setRefreshKey] = useState(0); // +1 forca reload das listas após import

  useEffect(() => {
    const unsub = pb.authStore.onChange((_token, record) => setAuthed(!!record));
    return unsub;
  }, []);

  if (!authed) {
    return <LoginForm onLogin={() => setAuthed(true)} />;
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <Helmet>
        <title>Admin - GMONEY Consultoria</title>
        <meta name="description" content="Painel administrativo GMONEY." />
      </Helmet>

      <header className="bg-neutral-900 border-b border-neutral-800 px-6 py-4 flex items-center justify-between">
        <div>
          <span className="text-yellow-400 font-bold text-lg tracking-wide">GMONEY</span>
          <span className="text-neutral-400 text-sm ml-2">Painel Admin</span>
        </div>
        <div className="flex items-center gap-4">
          <a href="/" className="text-sm text-neutral-400 hover:text-white transition-colors">
            Ver site →
          </a>
          <button
            onClick={() => {
              pb.authStore.clear();
              setAuthed(false);
            }}
            className="text-xs bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 px-3 py-1.5 rounded-lg transition-colors text-neutral-300"
          >
            Sair
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        <LogoSection />
        <GiftBannersManager refreshKey={refreshKey} />
        <ProductsManager refreshKey={refreshKey} onImported={() => setRefreshKey((k) => k + 1)} />
      </main>
    </div>
  );
}