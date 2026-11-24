import { ArrowUpRight, MessageCircle, ShoppingCart, Sparkles, UserRound, Menu, X, ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { getCartCount, readCart } from "@/lib/cart";
import { catalogCategories, slugify, storeName } from "@/data/products";

export function StoreHeader() {
  const [cartCount, setCartCount] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => {
    const refresh = () => setCartCount(getCartCount(readCart()));
    refresh();
    window.addEventListener("store-cart-updated", refresh);
    window.addEventListener("storage", refresh);
    return () => { window.removeEventListener("store-cart-updated", refresh); window.removeEventListener("storage", refresh); };
  }, []);
  return <header className="sticky top-0 z-40 border-b border-white bg-[#fff0ad] shadow-sm">
    <style>{`@media (max-width: 767px) { html, body { max-width: 100%; overflow-x: hidden; } body { -webkit-text-size-adjust: 100%; } } @media (max-width: 767px) { .mobile-menu-panel { animation: mobile-menu-in .18s ease-out both; } @keyframes mobile-menu-in { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } } }`}</style>
    <div className="mx-auto flex max-w-[1240px] items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4">
      <a href="/" className="group flex min-w-0 items-center gap-2.5 sm:gap-3"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#d92f78] text-white shadow-md shadow-[#d92f78]/15 sm:h-10 sm:w-10 sm:rounded-2xl"><Sparkles size={18}/></span><span className="min-w-0"><span className="block truncate text-lg font-black leading-none tracking-tight text-[#34213a] sm:text-xl">{storeName}</span><span className="mt-1 block text-[8px] font-extrabold uppercase tracking-[.16em] text-[#a94d72] sm:text-[9px] sm:tracking-[.2em]">ideias que surpreendem</span></span></a>
      <nav aria-label="Navegação principal" className="hidden items-center gap-7 text-[11px] font-extrabold uppercase tracking-[.12em] text-[#5e5663] lg:flex">
        <a href="/" className="transition hover:text-[#c72570]">Início</a><a href="/produtos" className="transition hover:text-[#c72570]">Produtos</a>
        <details className="group relative"><summary className="cursor-pointer list-none transition hover:text-[#c72570]">Categorias <span className="ml-1">⌄</span></summary><div className="absolute left-0 top-full z-30 mt-4 max-h-96 w-72 overflow-auto rounded-2xl border border-[#e8d47e] bg-white p-2 normal-case shadow-2xl">{catalogCategories.map((category) => <a key={category} href={"/categoria/" + slugify(category)} className="block rounded-xl px-4 py-3 text-xs font-bold text-[#514958] hover:bg-[#ffe0eb] hover:text-[#b51d64]">{category}</a>)}</div></details>
        <a href="/#sobre" className="transition hover:text-[#c72570]">Sobre</a><a href="/minha-conta" className="inline-flex items-center gap-1 transition hover:text-[#c72570]"><UserRound size={14}/> Minha conta</a>
        <a href="/carrinho" className="relative inline-flex items-center gap-1 transition hover:text-[#c72570]"><ShoppingCart size={15}/> Carrinho{cartCount > 0 && <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[#d92f78] px-1 text-[9px] text-white">{cartCount}</span>}</a>
        <a href="https://wa.me/5545988018222" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[#159b50] transition hover:text-[#d92f78]"><MessageCircle size={14}/> Suporte</a>
      </nav>
      <div className="flex shrink-0 items-center gap-2"><a href="/minha-conta" aria-label="Minha conta" className="flex h-10 w-10 items-center justify-center rounded-full border border-[#e8d47e] text-[#34213a] hover:border-[#d92f78] hover:text-[#b51d64] lg:hidden"><UserRound size={18}/></a><a href="/carrinho" aria-label="Carrinho" className="relative flex h-10 w-10 items-center justify-center rounded-full border border-[#e8d47e] text-[#34213a] hover:border-[#d92f78] hover:text-[#b51d64]"><ShoppingCart size={17}/>{cartCount > 0 && <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#d92f78] px-1 text-[9px] font-black text-white">{cartCount}</span>}</a>
        <a href="/produtos" className="hidden items-center gap-2 rounded-full bg-[#d92f78] px-5 py-3 text-[10px] font-black uppercase tracking-[.12em] text-white transition hover:bg-[#b51d64] sm:inline-flex">Explorar loja <ArrowUpRight size={14}/></a>
        <button type="button" onClick={() => setMobileOpen(!mobileOpen)} aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"} aria-expanded={mobileOpen} aria-controls="mobile-navigation" className="flex h-10 w-10 items-center justify-center rounded-full border border-[#e8d47e] bg-white/60 text-[#34213a] transition hover:border-[#d92f78] lg:hidden">{mobileOpen ? <X size={20}/> : <Menu size={20}/>}</button>
      </div>
    </div>
    {mobileOpen && <nav id="mobile-navigation" aria-label="Navegação mobile" className="mobile-menu-panel border-t border-[#eadfae] bg-[#fff9e9] px-4 pb-4 pt-3 lg:hidden"><div className="mx-auto grid max-w-[1240px] gap-1">
      <a href="/" onClick={() => setMobileOpen(false)} className="rounded-xl px-4 py-3 text-sm font-bold text-[#514958] transition hover:bg-[#fce8ef] hover:text-[#a94d72]">Início</a>
      <a href="/produtos" onClick={() => setMobileOpen(false)} className="rounded-xl px-4 py-3 text-sm font-bold text-[#514958] transition hover:bg-[#fce8ef] hover:text-[#a94d72]">Produtos</a>
      <details className="group rounded-xl px-4 py-2 text-sm font-bold text-[#514958]">
        <summary className="flex cursor-pointer list-none items-center justify-between py-1">Categorias <ChevronDown size={17} className="transition group-open:rotate-180"/></summary>
        <div className="mt-2 grid gap-1 border-l-2 border-[#f0c9d9] pl-3">
          {catalogCategories.map((category) => <a key={category} href={"/categoria/" + slugify(category)} onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2.5 text-[13px] font-semibold text-[#665766] transition hover:bg-white hover:text-[#b51d64]">{category}</a>)}
        </div>
      </details>
      <a href="https://wa.me/5545988018222" target="_blank" rel="noreferrer" className="mt-1 flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-bold text-[#26834c]"><MessageCircle size={16}/> Suporte pelo WhatsApp</a>
    </div></nav>}
  </header>;
}

export function StoreFooter() {
  return <footer className="relative mt-20 overflow-hidden border-t-4 border-white bg-[#fff0ad] text-[#34213a]">
    <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-[#f28ab8]/45 blur-3xl"/><div className="pointer-events-none absolute -bottom-28 left-[28%] h-64 w-64 rounded-full bg-[#ffe58a]/80 blur-3xl"/><div className="relative mx-auto grid max-w-[1240px] gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_.8fr_1fr]">
      <div><a href="/" className="text-2xl font-black tracking-tight">{storeName}</a><p className="mt-4 max-w-sm text-sm leading-7 text-[#695565]/85">Produtos digitais, ideias criativas e experiências para transformar momentos comuns em momentos especiais.</p><div className="mt-5 flex flex-wrap gap-3 text-[#695565]"><a href="https://wa.me/5545988018222" target="_blank" rel="noreferrer" aria-label="Falar pelo WhatsApp" className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-2 text-xs font-bold text-white hover:bg-[#1fb85a]"><MessageCircle size={16}/> WhatsApp suporte</a></div></div>
      <div><h2 className="text-[10px] font-black uppercase tracking-[.2em] text-[#c72570]">Explore</h2><ul className="mt-5 space-y-3 text-sm text-[#695565]"><li><a href="/" className="hover:text-[#c72570]">Início</a></li><li><a href="/produtos" className="hover:text-white">Todos os produtos</a></li><li><a href="/#categorias" className="hover:text-white">Categorias</a></li><li><a href="/minha-conta" className="hover:text-white">Minha conta e downloads</a></li><li><a href="/carrinho" className="hover:text-white">Meu carrinho</a></li></ul></div>
      <div><h2 className="text-[10px] font-black uppercase tracking-[.2em] text-[#ffd76d]">Atendimento</h2><p className="mt-5 text-sm leading-6 text-[#5f4b5d]">Precisa de ajuda com um produto ou download?</p><a href="https://wa.me/5545988018222?text=Ol%C3%A1%21%20Preciso%20de%20suporte%20com%20um%20produto%20digital." target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-[#ffd76d] hover:text-white"><MessageCircle size={16}/> Chamar no WhatsApp</a><div className="mt-5 space-y-2 text-xs text-[#806c7d]"><a className="block hover:text-[#c72570]" href="/politica-de-privacidade">Política de privacidade</a><a className="block hover:text-white" href="/termos-de-uso">Termos de uso</a></div></div>
    </div>
    <div className="relative border-t border-[#e8c9a8] bg-[#f28ab8]/35 px-4 py-5 text-center text-[10px] font-medium text-[#695565]">© {new Date().getFullYear()} {storeName}. Todos os direitos reservados.</div>
  <a href="https://wa.me/5545988018222?text=Ol%C3%A1%21%20Preciso%20de%20suporte." target="_blank" rel="noreferrer" aria-label="Falar com o suporte pelo WhatsApp" className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl shadow-black/20 transition hover:scale-105 hover:bg-[#1fb85a]"><MessageCircle size={25}/></a>
  </footer>;
}
