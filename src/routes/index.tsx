import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { featuredProduct, slugify } from "@/data/products";
import {
  Search, ShoppingBag, Menu, ChevronDown, ChevronRight, Minus, Plus, X,
  UserRound, Headphones, Mail, Download, ShieldCheck, Clock3, Instagram,
  Facebook, Heart, Share2, Check, PackageCheck, CreditCard, MessageCircle,
} from "lucide-react";
import produto from "@/assets/produto.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Caixa de Mensagens Natal Cristão | Loja" },
      { name: "description", content: "Material digital de Natal para imprimir. Confira os detalhes e adquira seu arquivo." },
      { property: "og:title", content: "Caixa de Mensagens Natal Cristão" },
      { property: "og:description", content: "Material digital para imprimir e compartilhar mensagens especiais." },
      { property: "og:type", content: "product" },
    ],
  }),
  component: StorePage,
});

const categories = [
  "Novidades", "Natal", "Datas comemorativas", "Alfabetização", "Apostilas",
  "Avaliações e sondagens", "Calendários", "Educação infantil", "Lembrancinhas",
  "Kits e combos", "Painéis", "Leitura e escrita", "Matemática", "Formatura",
];
const CART_STORAGE_KEY = "sua-loja-cart-v1";
const FAVORITES_STORAGE_KEY = "sua-loja-favorites-v1";

const details = [
  { title: "O que está incluso?", body: "O arquivo acompanha o molde da caixa em PDF e 54 cartões com mensagens diferentes, organizados para impressão." },
  { title: "Como recebo meu arquivo?", body: "Após a confirmação do pagamento, o acesso ao material digital será enviado ao e-mail informado na compra." },
  { title: "Posso editar o material?", body: "Este produto é disponibilizado em PDF não editável. Confira as características antes de concluir seu pedido." },
  { title: "Por quanto tempo tenho acesso?", body: "O prazo de acesso e as condições de download serão informados na finalização do pedido." },
];

function StorePage() {
  const [quantity, setQuantity] = useState(1);
  const [cartCount, setCartCount] = useState(0);
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("description");
  const [search, setSearch] = useState("");
  const [added, setAdded] = useState(false);
  const [searchMessage, setSearchMessage] = useState("");
  const [favorite, setFavorite] = useState(false);
  const [storageReady, setStorageReady] = useState(false);
  const unitPrice = featuredProduct.price;
  const total = useMemo(() => (cartCount * unitPrice).toLocaleString("pt-BR", { style: "currency", currency: "BRL" }), [cartCount, unitPrice]);

  useEffect(() => {
    try {
      const savedCart = window.localStorage.getItem(CART_STORAGE_KEY);
      const savedFavorites = window.localStorage.getItem(FAVORITES_STORAGE_KEY);
      if (savedCart) {
        const parsed = JSON.parse(savedCart) as { productId?: string; quantity?: number }[];
        const item = parsed.find((entry) => entry.productId === featuredProduct.id);
        if (item && Number.isFinite(item.quantity)) setCartCount(Math.max(0, Number(item.quantity)));
      }
      if (savedFavorites) {
        const parsed = JSON.parse(savedFavorites) as string[];
        setFavorite(parsed.includes(featuredProduct.id));
      }
    } catch {
      window.localStorage.removeItem(CART_STORAGE_KEY);
      window.localStorage.removeItem(FAVORITES_STORAGE_KEY);
    }
    setStorageReady(true);
  }, []);

  useEffect(() => {
    if (!storageReady) return;
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartCount > 0 ? [{ productId: featuredProduct.id, quantity: cartCount }] : []));
  }, [cartCount, storageReady]);

  useEffect(() => {
    if (!storageReady) return;
    window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorite ? [featuredProduct.id] : []));
  }, [favorite, storageReady]);

  async function shareProduct() {
    const shareData = {
      title: featuredProduct.name,
      text: featuredProduct.description,
      url: window.location.href,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareData.url);
        setSearchMessage("Link do produto copiado para compartilhar.");
      } else {
        setSearchMessage("Copie o endereço desta página para compartilhar o produto.");
      }
    } catch (error) {
      if (error instanceof Error && error.name !== "AbortError") {
        setSearchMessage("Não foi possível compartilhar automaticamente. Copie o link da página.");
      }
    }
  }

  function addToCart() {
    setCartCount((current) => current + quantity);
    setAdded(true);
    setCartOpen(true);
  }

  function submitSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const query = search.trim().toLocaleLowerCase("pt-BR");
    if (!query) {
      setSearchMessage("Digite o nome de um produto para buscar.");
      return;
    }
    const searchableText = `${featuredProduct.name} ${featuredProduct.category} ${featuredProduct.description}`.toLocaleLowerCase("pt-BR");
    if (searchableText.includes(query)) {
      setSearchMessage(`Encontramos: ${featuredProduct.name}`);
      document.getElementById("produto")?.scrollIntoView({ behavior: "smooth" });
    } else {
      setSearchMessage(`Nenhum produto encontrado para “${search.trim()}”.`);
    }
  }

  return (
    <div className="store-shell min-h-screen bg-white text-slate-800">
      <div className="bg-[#173e43] text-white">
        <div className="mx-auto flex max-w-[1240px] flex-wrap items-center justify-between gap-2 px-4 py-2 text-[11px] sm:text-xs">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
            <a href="mailto:contato@sualoja.com" className="inline-flex items-center gap-2 hover:text-[#c6dfd5]"><Mail size={13}/> contato@sualoja.com</a>
            <a href="#atendimento" className="hidden items-center gap-2 hover:text-[#c6dfd5] sm:inline-flex"><Headphones size={13}/> Atendimento</a>
          </div>
          <a href="#minha-conta" className="inline-flex items-center gap-2 hover:text-[#c6dfd5]"><UserRound size={13}/> Área do cliente</a>
        </div>
      </div>

      <header className="border-b border-slate-100 bg-white">
        <div className="mx-auto flex max-w-[1240px] items-center gap-4 px-4 py-5">
          <button className="rounded-lg p-2 lg:hidden" aria-label="Abrir menu" onClick={() => setMobileMenu(!mobileMenu)}><Menu size={23}/></button>
          <a href="#" className="min-w-fit">
            <span className="block font-serif text-[25px] font-bold tracking-tight text-[#173e43] sm:text-[30px]">{featuredProduct.storeName}</span>
            <span className="block text-[9px] font-semibold uppercase tracking-[.25em] text-[#b17b55]">materiais digitais</span>
          </a>
          <form onSubmit={submitSearch} className="mx-auto hidden w-full max-w-[510px] items-center rounded-full border border-slate-200 bg-[#f8faf9] px-4 py-2.5 md:flex">
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="O que você está procurando?" className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"/>
            <button aria-label="Buscar" type="submit" className="text-[#173e43]"><Search size={19}/></button>
          </form>
          <div className="ml-auto flex items-center gap-2 sm:gap-4">
            <a href="#minha-conta" className="hidden items-center gap-2 text-xs font-semibold text-slate-600 hover:text-[#173e43] sm:flex"><UserRound size={19}/> Minha conta</a>
            <button onClick={() => setCartOpen(true)} className="relative flex items-center gap-2 rounded-full bg-[#edf4f1] px-3 py-2.5 text-xs font-bold text-[#173e43] sm:px-4">
              <ShoppingBag size={18}/><span className="hidden sm:inline">Carrinho</span>
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#b17b55] px-1 text-[10px] text-white">{cartCount}</span>
            </button>
          </div>
        </div>
        <form onSubmit={submitSearch} className="mx-4 mb-4 flex items-center rounded-full border border-slate-200 bg-[#f8faf9] px-4 py-2 md:hidden">
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar produtos..." className="w-full bg-transparent text-sm outline-none"/>
          <button aria-label="Buscar" type="submit"><Search size={18}/></button>
        </form>
        <nav className="hidden border-t border-slate-100 lg:block">
          <div className="mx-auto flex max-w-[1240px] items-center justify-center gap-8 px-4 py-3 text-[12px] font-bold uppercase tracking-wide text-slate-600">
            <a href="#" className="hover:text-[#b17b55]">Início</a>
            <div className="relative" onMouseEnter={() => setCategoryOpen(true)} onMouseLeave={() => setCategoryOpen(false)}>
              <button onClick={() => setCategoryOpen(!categoryOpen)} className="inline-flex items-center gap-1 hover:text-[#b17b55]">Produtos <ChevronDown size={14}/></button>
              {categoryOpen && <div className="absolute left-0 top-full z-30 grid w-[460px] grid-cols-2 gap-x-6 gap-y-3 rounded-xl border border-slate-100 bg-white p-5 text-[11px] font-medium normal-case tracking-normal shadow-xl">
                {categories.map((category) => <a key={category} href={`/categoria/${slugify(category)}`} className="hover:text-[#b17b55]">{category}</a>)}
              </div>}
            </div>
            <a href="/produtos" className="hover:text-[#b17b55]">Todos os produtos</a><a href="#sobre" className="hover:text-[#b17b55]">Sobre</a>
            <a href="#blog" className="hover:text-[#b17b55]">Blog</a>
            <a href="#contato" className="hover:text-[#b17b55]">Contato</a>
            <a href="#atendimento" className="hover:text-[#b17b55]">Suporte</a>
          </div>
        </nav>
        {mobileMenu && <div className="border-t border-slate-100 bg-white px-5 py-4 lg:hidden">
          <div className="grid grid-cols-2 gap-3 text-sm">{["Início", "Produtos", "Sobre", "Blog", "Contato", ...categories].map((item) => <a key={item} href="/produtos" onClick={() => setMobileMenu(false)}>{item}</a>)}</div>
        </div>}
      </header>

      {searchMessage && <div role="status" className="mx-auto max-w-[1160px] px-4 pt-3 text-xs font-medium text-[#315c55]">{searchMessage}</div>}

      <div className="bg-[#f4f7f5] py-2.5 text-center text-[11px] font-semibold tracking-wide text-[#315c55] sm:text-xs">
        <PackageCheck className="mr-2 inline-block" size={15}/> PRODUTOS DIGITAIS • ACESSO APÓS A CONFIRMAÇÃO DO PAGAMENTO
      </div>

      <main className="mx-auto max-w-[1160px] px-4 pb-16 pt-7 sm:pt-10">
        <div className="mb-7 flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
          <a href="#" className="hover:text-[#173e43]">Início</a><ChevronRight size={12}/><a href="#categorias" className="hover:text-[#173e43]">Natal</a><ChevronRight size={12}/><span className="text-slate-600">Caixa de Mensagens Natal Cristão</span>
        </div>

        <section id="produto" className="grid gap-9 lg:grid-cols-[1.04fr_.96fr] lg:gap-14">
          <div>
            <div className="relative overflow-hidden rounded-2xl bg-[#f7f5ef]">
              <span className="absolute left-4 top-4 z-10 rounded-full bg-[#173e43] px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white">Arquivo digital</span>
              <img src={produto} alt="Prévia ilustrativa da Caixa de Mensagens Natal Cristão" className="aspect-square w-full object-contain mix-blend-multiply"/>
            </div>
            <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400"><span>Imagem ilustrativa do produto</span><button type="button" onClick={shareProduct} className="inline-flex items-center gap-1 hover:text-[#173e43]"><Share2 size={13}/> Compartilhar</button></div>
          </div>

          <div className="flex flex-col">
            <div className="mb-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.18em] text-[#b17b55]"><span>{featuredProduct.category}</span><span className="h-1 w-1 rounded-full bg-[#b17b55]"/><span>Material para imprimir</span></div>
            <h1 className="font-serif text-[32px] font-bold leading-[1.12] text-[#173e43] sm:text-[40px]">{featuredProduct.name}</h1>
            <div className="mt-4 flex items-center gap-2 text-xs text-amber-500"><span>★★★★★</span><span className="text-slate-400">(Avaliações em breve)</span></div>
            <p className="mt-5 text-[14px] leading-7 text-slate-600">{featuredProduct.description}</p>
            <div className="mt-5 border-y border-slate-100 py-5">
              <div className="flex items-end gap-3"><span className="text-[31px] font-bold tracking-tight text-[#173e43]">{unitPrice.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span><span className="pb-1 text-xs text-slate-400">pagamento único</span></div>
              <p className="mt-1 text-xs text-slate-500">Produto digital • arquivo em PDF</p>
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <div className="flex h-12 items-center rounded-lg border border-slate-200">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} aria-label="Diminuir quantidade" className="px-3 text-slate-500 hover:text-[#173e43]"><Minus size={15}/></button>
                <span className="w-7 text-center text-sm font-bold">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} aria-label="Aumentar quantidade" className="px-3 text-slate-500 hover:text-[#173e43]"><Plus size={15}/></button>
              </div>
              <button onClick={addToCart} className="flex h-12 flex-1 items-center justify-center gap-2 rounded-lg bg-[#173e43] px-5 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-[#24565b]"><ShoppingBag size={17}/> Adicionar ao carrinho</button>
              <button aria-label={favorite ? "Remover dos favoritos" : "Adicionar aos favoritos"} aria-pressed={favorite} onClick={() => setFavorite((value) => !value)} className={`flex h-12 w-12 items-center justify-center rounded-lg border transition ${favorite ? "border-rose-200 bg-rose-50 text-rose-600" : "border-slate-200 text-slate-500 hover:border-[#b17b55] hover:text-[#b17b55]"}`}><Heart size={19} fill={favorite ? "currentColor" : "none"}/></button>
            </div>
            {added && <p className="mt-3 text-xs font-semibold text-emerald-700"><Check className="mr-1 inline" size={14}/> Produto adicionado ao carrinho.</p>}
            <div className="mt-7 grid grid-cols-1 gap-3 border-t border-slate-100 pt-5 text-xs text-slate-600 sm:grid-cols-2">
              <div className="flex items-center gap-3"><Download className="text-[#b17b55]" size={19}/><span><b className="block text-slate-800">Download digital</b>Sem frete ou espera</span></div>
              <div className="flex items-center gap-3"><Mail className="text-[#b17b55]" size={19}/><span><b className="block text-slate-800">Entrega por e-mail</b>Após confirmação</span></div>
              <div className="flex items-center gap-3"><ShieldCheck className="text-[#b17b55]" size={19}/><span><b className="block text-slate-800">Compra protegida</b>Pagamento seguro</span></div>
              <div className="flex items-center gap-3"><Clock3 className="text-[#b17b55]" size={19}/><span><b className="block text-slate-800">Acesso ao arquivo</b>Consulte as condições</span></div>
            </div>
          </div>
        </section>

        <section className="mt-14 border-y border-slate-100">
          <div className="flex flex-wrap gap-7 border-b border-slate-100 text-xs font-bold uppercase tracking-wider">
            <button onClick={() => setActiveTab("description")} className={`border-b-2 py-4 ${activeTab === "description" ? "border-[#b17b55] text-[#173e43]" : "border-transparent text-slate-400"}`}>Descrição</button>
            <button onClick={() => setActiveTab("delivery")} className={`border-b-2 py-4 ${activeTab === "delivery" ? "border-[#b17b55] text-[#173e43]" : "border-transparent text-slate-400"}`}>Entrega e download</button>
            <button onClick={() => setActiveTab("info")} className={`border-b-2 py-4 ${activeTab === "info" ? "border-[#b17b55] text-[#173e43]" : "border-transparent text-slate-400"}`}>Informações</button>
          </div>
          <div className="max-w-3xl py-7 text-sm leading-7 text-slate-600">
            {activeTab === "description" && <><h2 className="mb-3 font-serif text-2xl font-bold text-[#173e43]">Sobre o material</h2><p>A Caixa de Mensagens Natal Cristão é uma proposta delicada para celebrar o Natal e compartilhar palavras de fé, acolhimento e esperança. Ideal para lembranças, confraternizações, atividades escolares e pequenos gestos de carinho.</p><h3 className="mb-2 mt-6 font-bold text-slate-800">O que está incluso:</h3><ul className="list-disc space-y-1 pl-5"><li>1 modelo de caixa para montar, em PDF.</li><li>54 cartões com mensagens diferentes, organizados para impressão.</li><li>Material digital não editável.</li></ul><p className="mt-4">Sugestão: coloque um doce junto ao cartão para deixar a lembrança ainda mais especial.</p></>}
            {activeTab === "delivery" && <><h2 className="mb-3 font-serif text-2xl font-bold text-[#173e43]">Receba sem sair de casa</h2><p>Por se tratar de um produto digital, não há envio físico. Após a confirmação do pagamento, as instruções para acessar o arquivo serão encaminhadas ao e-mail cadastrado. Verifique também a caixa de spam ou lixo eletrônico.</p></>}
            {activeTab === "info" && <><h2 className="mb-3 font-serif text-2xl font-bold text-[#173e43]">Informações importantes</h2><p>Confira atentamente a descrição, o formato e os requisitos do material antes da compra. O arquivo é digital e não editável. As condições de acesso, suporte e eventuais solicitações devem seguir a política da loja, apresentada no checkout.</p></>}
          </div>
        </section>

        <section className="mt-14 grid gap-10 lg:grid-cols-[.8fr_1.2fr]">
          <div><p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#b17b55]">Dúvidas frequentes</p><h2 className="mt-2 font-serif text-3xl font-bold text-[#173e43]">Antes de comprar</h2><p className="mt-3 text-sm leading-6 text-slate-500">Separamos algumas respostas para ajudar você a aproveitar seu material.</p></div>
          <div className="divide-y divide-slate-100 border-y border-slate-100">{details.map((item) => <details key={item.title} className="group py-4"><summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-bold text-slate-700">{item.title}<Plus size={17} className="shrink-0 text-[#b17b55] group-open:rotate-45"/></summary><p className="pt-3 text-sm leading-6 text-slate-500">{item.body}</p></details>)}</div>
        </section>

        <section id="categorias" className="mt-16 rounded-2xl bg-[#f4f7f5] px-5 py-9 sm:px-9">
          <p className="text-center text-[10px] font-bold uppercase tracking-[.2em] text-[#b17b55]">Explore a loja</p>
          <h2 className="mt-2 text-center font-serif text-3xl font-bold text-[#173e43]">Encontre seu próximo material</h2>
          <div className="mt-7 flex flex-wrap justify-center gap-2">{categories.map((category) => <a href="#produto" key={category} className="rounded-full border border-[#dce7e1] bg-white px-4 py-2 text-xs font-semibold text-[#315c55] transition hover:border-[#b17b55] hover:text-[#b17b55]">{category}</a>)}</div>
        </section>
      </main>

      <footer className="bg-[#173e43] text-white">
        <div className="mx-auto grid max-w-[1160px] gap-9 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
          <div><span className="font-serif text-2xl font-bold">Sua Loja</span><p className="mt-3 max-w-xs text-xs leading-6 text-white/65">Materiais digitais preparados com carinho para inspirar, ensinar e tornar cada ocasião especial.</p><div className="mt-4 flex gap-3"><a href="#instagram" aria-label="Instagram" className="rounded-full bg-white/10 p-2"><Instagram size={16}/></a><a href="#facebook" aria-label="Facebook" className="rounded-full bg-white/10 p-2"><Facebook size={16}/></a></div></div>
          <div><h3 className="text-xs font-bold uppercase tracking-widest">Links úteis</h3><ul className="mt-4 space-y-3 text-xs text-white/65"><li><a href="#sobre" className="hover:text-white">Sobre a loja</a></li><li><a href="#contato" className="hover:text-white">Contato</a></li><li><a href="#politicas" className="hover:text-white">Política de privacidade</a></li><li><a href="#termos" className="hover:text-white">Termos de uso</a></li></ul></div>
          <div id="atendimento"><h3 className="text-xs font-bold uppercase tracking-widest">Atendimento</h3><ul className="mt-4 space-y-3 text-xs text-white/65"><li className="flex items-center gap-2"><Mail size={14}/> contato@sualoja.com</li><li className="flex items-center gap-2"><MessageCircle size={14}/> Suporte via WhatsApp</li><li>Segunda a sexta, em horário comercial</li></ul></div>
          <div id="minha-conta"><h3 className="text-xs font-bold uppercase tracking-widest">Minha conta</h3><ul className="mt-4 space-y-3 text-xs text-white/65"><li><a href="#pedidos" className="hover:text-white">Meus pedidos</a></li><li><a href="#downloads" className="hover:text-white">Meus downloads</a></li><li><a href="#dados" className="hover:text-white">Dados da conta</a></li></ul></div>
        </div>
        <div className="border-t border-white/10 px-4 py-5 text-center text-[10px] text-white/45">© 2026 Sua Loja. Todos os direitos reservados.</div>
      </footer>

      {cartOpen && <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/40" onClick={() => setCartOpen(false)}>
        <aside className="flex h-full w-full max-w-[420px] flex-col bg-white shadow-2xl" onClick={(event) => event.stopPropagation()}>
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-5"><div><p className="font-serif text-xl font-bold text-[#173e43]">Seu carrinho</p><p className="mt-1 text-xs text-slate-400">{cartCount} {cartCount === 1 ? "item" : "itens"}</p></div><button onClick={() => setCartOpen(false)} aria-label="Fechar carrinho" className="rounded-full p-2 hover:bg-slate-100"><X size={20}/></button></div>
          {cartCount > 0 ? <><div className="flex flex-1 gap-4 p-5"><img src={produto} alt="" className="h-24 w-24 rounded-lg bg-[#f7f5ef] object-contain"/><div className="flex-1"><p className="text-sm font-bold text-[#173e43]">{featuredProduct.name}</p><p className="mt-1 text-xs text-slate-500">Produto digital • {featuredProduct.format}</p><p className="mt-3 text-sm font-bold">{unitPrice.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })} cada</p><div className="mt-3 flex items-center gap-3"><div className="flex h-9 items-center rounded-md border border-slate-200"><button type="button" aria-label="Diminuir quantidade no carrinho" onClick={() => setCartCount((value) => Math.max(0, value - 1))} className="px-2 text-slate-500"><Minus size={14}/></button><span className="w-6 text-center text-xs font-bold">{cartCount}</span><button type="button" aria-label="Aumentar quantidade no carrinho" onClick={() => setCartCount((value) => value + 1)} className="px-2 text-slate-500"><Plus size={14}/></button></div><button onClick={() => setCartCount(0)} className="text-[11px] text-rose-600 underline">Remover</button></div></div></div><div className="border-t border-slate-100 p-5"><div className="flex justify-between text-sm"><span className="text-slate-500">Subtotal</span><b className="text-[#173e43]">{total}</b></div><p className="mt-3 text-[11px] leading-5 text-slate-400">O pagamento e a entrega dos arquivos serão configurados na próxima etapa do projeto.</p><button onClick={() => setCartCount(0)} className="mt-3 w-full rounded-lg border border-slate-200 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50">Esvaziar carrinho</button><button disabled className="mt-3 w-full cursor-not-allowed rounded-lg bg-slate-200 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">Finalização de compra em configuração</button></div></> : <div className="flex flex-1 flex-col items-center justify-center px-8 text-center"><ShoppingBag size={38} className="text-slate-300"/><p className="mt-4 font-serif text-xl font-bold text-[#173e43]">Seu carrinho está vazio</p><p className="mt-2 text-xs text-slate-500">Adicione um material para continuar.</p><button onClick={() => setCartOpen(false)} className="mt-5 rounded-lg bg-[#173e43] px-5 py-3 text-xs font-bold uppercase tracking-wider text-white">Continuar comprando</button></div>}
        </aside>
      </div>}
    </div>
  );
}
