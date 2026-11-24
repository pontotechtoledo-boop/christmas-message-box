import { ArrowRight, Mail } from "lucide-react";
import { catalogCategories, slugify, storeName } from "@/data/products";

export function StoreHeader() {
  return <header className="border-b border-slate-100 bg-white">
    <div className="mx-auto flex max-w-[1160px] items-center justify-between gap-4 px-4 py-5">
      <a href="/" className="min-w-fit"><span className="block font-serif text-2xl font-bold tracking-tight text-[#173e43]">{storeName}</span><span className="block text-[9px] font-semibold uppercase tracking-[.25em] text-[#b17b55]">materiais digitais</span></a>
      <nav aria-label="Navegação principal" className="hidden items-center gap-6 text-xs font-bold uppercase tracking-wide text-slate-600 md:flex">
        <a href="/" className="hover:text-[#b17b55]">Início</a>
        <a href="/produtos" className="hover:text-[#b17b55]">Todos os produtos</a>
        <details className="group relative"><summary className="cursor-pointer list-none hover:text-[#b17b55]">Categorias</summary><div className="absolute left-0 top-full z-30 mt-3 max-h-80 w-64 overflow-auto rounded-xl border border-slate-100 bg-white p-2 normal-case shadow-xl">{catalogCategories.map((category) => <a key={category} href={"/categoria/" + slugify(category)} className="block rounded-lg px-3 py-2 text-xs font-medium text-slate-600 hover:bg-[#f4f7f5] hover:text-[#173e43]">{category}</a>)}</div></details>
        <a href="/#sobre" className="hover:text-[#b17b55]">Sobre</a>
        <a href="/#contato" className="hover:text-[#b17b55]">Contato</a>
      </nav>
      <a href="/produtos" className="rounded-full bg-[#173e43] px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider text-white hover:bg-[#24565b]">Ver loja <ArrowRight className="ml-1 inline" size={13}/></a>
    </div>
    <nav aria-label="Navegação mobile" className="flex flex-wrap justify-center gap-x-5 gap-y-2 border-t border-slate-100 px-4 py-3 text-[10px] font-bold uppercase tracking-wide text-slate-600 md:hidden"><a href="/">Início</a><a href="/produtos">Produtos</a><a href="/#categorias">Categorias</a><a href="/#sobre">Sobre</a><a href="/#contato">Contato</a></nav>
  </header>;
}

export function StoreFooter() {
  return <footer className="mt-16 bg-[#173e43] text-white">
    <div className="mx-auto grid max-w-[1160px] gap-8 px-4 py-12 sm:grid-cols-3">
      <div><a href="/" className="font-serif text-2xl font-bold">{storeName}</a><p className="mt-3 max-w-xs text-xs leading-6 text-white/65">Materiais digitais preparados com carinho para inspirar e criar momentos especiais.</p></div>
      <div><h2 className="text-xs font-bold uppercase tracking-widest">Navegação</h2><ul className="mt-4 space-y-3 text-xs text-white/65"><li><a href="/" className="hover:text-white">Início</a></li><li><a href="/produtos" className="hover:text-white">Todos os produtos</a></li><li><a href="/#categorias" className="hover:text-white">Categorias</a></li><li><a href="/#sobre" className="hover:text-white">Sobre a loja</a></li></ul></div>
      <div><h2 className="text-xs font-bold uppercase tracking-widest">Atendimento</h2><p className="mt-4 flex items-center gap-2 text-xs text-white/65"><Mail size={14}/> Dados de atendimento a configurar</p></div>
    </div>
    <div className="border-t border-white/10 px-4 py-5 text-center text-[10px] text-white/45">© {new Date().getFullYear()} {storeName}. Todos os direitos reservados.</div>
  </footer>;
}
