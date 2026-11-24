import { ArrowUpRight, Instagram, Mail, MessageCircle, Sparkles, UserRound, ShieldCheck, FileText } from "lucide-react";
import { catalogCategories, slugify, storeName } from "@/data/products";

export function StoreHeader() {
  return <header className="sticky top-0 z-40 border-b border-[#eee9e5] bg-[#fffdfb]/95 backdrop-blur-xl">
    <div className="mx-auto flex max-w-[1240px] items-center justify-between gap-4 px-4 py-4 sm:px-6">
      <a href="/" className="group flex min-w-fit items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#ff5b69] text-white shadow-lg shadow-[#ff5b69]/20"><Sparkles size={20}/></span>
        <span><span className="block text-xl font-black leading-none tracking-tight text-[#251d2d]">{storeName}</span><span className="mt-1 block text-[9px] font-extrabold uppercase tracking-[.2em] text-[#ff5b69]">ideias que surpreendem</span></span>
      </a>
      <nav aria-label="Navegação principal" className="hidden items-center gap-7 text-[11px] font-extrabold uppercase tracking-[.12em] text-[#5e5663] lg:flex">
        <a href="/" className="transition hover:text-[#ff5b69]">Início</a>
        <a href="/produtos" className="transition hover:text-[#ff5b69]">Produtos</a>
        <details className="group relative"><summary className="cursor-pointer list-none transition hover:text-[#ff5b69]">Categorias <span className="ml-1">⌄</span></summary><div className="absolute left-0 top-full z-30 mt-4 max-h-96 w-72 overflow-auto rounded-2xl border border-[#eee9e5] bg-white p-2 normal-case shadow-2xl">{catalogCategories.map((category) => <a key={category} href={"/categoria/" + slugify(category)} className="block rounded-xl px-4 py-3 text-xs font-bold text-[#514958] hover:bg-[#fff1f0] hover:text-[#e84959]">{category}</a>)}</div></details>
        <a href="/#sobre" className="transition hover:text-[#ff5b69]">Sobre</a>
        <a href="/minha-conta" className="inline-flex items-center gap-1 transition hover:text-[#ff5b69]"><UserRound size={14}/> Minha conta</a>
      </nav>
      <div className="flex items-center gap-2"><a href="/minha-conta" aria-label="Minha conta" className="flex h-10 w-10 items-center justify-center rounded-full border border-[#eee9e5] text-[#251d2d] hover:border-[#ff5b69] hover:text-[#ff5b69] lg:hidden"><UserRound size={17}/></a><a href="/produtos" className="inline-flex items-center gap-2 rounded-full bg-[#251d2d] px-5 py-3 text-[10px] font-black uppercase tracking-[.12em] text-white transition hover:bg-[#ff5b69]">Explorar loja <ArrowUpRight size={14}/></a></div>
    </div>
    <nav aria-label="Navegação mobile" className="flex gap-5 overflow-x-auto border-t border-[#eee9e5] px-4 py-3 text-[10px] font-extrabold uppercase tracking-wider text-[#625a67] lg:hidden"><a href="/">Início</a><a href="/produtos">Produtos</a><a href="/#categorias">Categorias</a><a href="/#sobre">Sobre</a><a href="/minha-conta">Minha conta</a></nav>
  </header>;
}

export function StoreFooter() {
  return <footer className="mt-20 bg-[#251d2d] text-white">
    <div className="mx-auto grid max-w-[1240px] gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_.8fr_1fr]">
      <div><a href="/" className="text-2xl font-black tracking-tight">{storeName}</a><p className="mt-4 max-w-sm text-sm leading-7 text-white/60">Produtos digitais, ideias criativas e experiências para transformar momentos comuns em momentos especiais.</p><div className="mt-5 flex flex-wrap gap-3 text-white/70"><a href="https://wa.me/5545988018222" target="_blank" rel="noreferrer" aria-label="Falar pelo WhatsApp" className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-2 text-xs font-bold text-white hover:bg-[#1fb85a]"><MessageCircle size={16}/> WhatsApp suporte</a></div></div>
      <div><h2 className="text-[10px] font-black uppercase tracking-[.2em] text-[#ff8b91]">Explore</h2><ul className="mt-5 space-y-3 text-sm text-white/65"><li><a href="/" className="hover:text-white">Início</a></li><li><a href="/produtos" className="hover:text-white">Todos os produtos</a></li><li><a href="/#categorias" className="hover:text-white">Categorias</a></li><li><a href="/minha-conta" className="hover:text-white">Minha conta e downloads</a></li></ul></div>
      <div><h2 className="text-[10px] font-black uppercase tracking-[.2em] text-[#ff8b91]">Atendimento</h2><p className="mt-5 text-sm leading-6 text-white/65">Precisa de ajuda com um produto ou download?</p><a href="https://wa.me/5545988018222?text=Ol%C3%A1%21%20Preciso%20de%20suporte%20com%20um%20produto%20digital." target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-[#8ff0b1] hover:text-white"><MessageCircle size={16}/> Chamar no WhatsApp</a><div className="mt-5 space-y-2 text-xs text-white/55"><a className="block hover:text-white" href="/politica-de-privacidade">Política de privacidade</a><a className="block hover:text-white" href="/termos-de-uso">Termos de uso</a></div></div>
    </div>
    <div className="border-t border-white/10 px-4 py-5 text-center text-[10px] text-white/40">© {new Date().getFullYear()} {storeName}. Todos os direitos reservados.</div>
  </footer>;
}
