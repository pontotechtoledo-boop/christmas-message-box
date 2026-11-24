import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Search, SlidersHorizontal, ChevronRight, ArrowUpDown, PackageOpen } from "lucide-react";
import { catalogCategories, getPublishedProducts, storeName } from "@/data/products";
import produtoImage from "@/assets/produto.jpg";

export const Route = createFileRoute("/produtos")({
  head: () => ({ meta: [
    { title: "Todos os produtos | " + storeName },
    { name: "description", content: "Explore os materiais digitais disponíveis na loja." },
  ]}),
  component: CatalogPage,
});

function CatalogPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todas");
  const [type, setType] = useState<"all" | "new" | "free">("all");
  const [sort, setSort] = useState("featured");
  const [page, setPage] = useState(1);
  const pageSize = 9;
  const publishedProducts = getPublishedProducts();

  const products = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("pt-BR");
    const filtered = getPublishedProducts().filter((product) => {
      const matchesCategory = category === "Todas" || product.category === category;
      const text = `${product.name} ${product.category} ${product.description} ${product.shortDescription}`.toLocaleLowerCase("pt-BR");
      const matchesType = type === "all" || (type === "new" ? Boolean(product.isNew) : product.price === 0);
      return matchesCategory && matchesType && (!query || text.includes(query));
    });
    return [...filtered].sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      if (sort === "name") return a.name.localeCompare(b.name, "pt-BR");
      if (sort === "popular") return (b.popularity ?? 0) - (a.popularity ?? 0);
      if (sort === "newest") return (b.publishedAt || "").localeCompare(a.publishedAt || "");
      return Number(Boolean(b.featured)) - Number(Boolean(a.featured));
    });
  }, [search, category, type, sort]);

  useEffect(() => setPage(1), [search, category, type, sort]);
  const pageCount = Math.max(1, Math.ceil(products.length / pageSize));
  const visibleProducts = products.slice((page - 1) * pageSize, page * pageSize);

  function clearFilters() {
    setSearch("");
    setCategory("Todas");
    setType("all");
    setSort("featured");
  }

  return <main className="min-h-screen bg-white text-slate-800">
    <section className="bg-[#f4f7f5] px-4 py-12 sm:py-16">
      <div className="mx-auto max-w-[1160px]">
        <div className="mb-3 flex items-center gap-2 text-xs text-slate-400"><a href="/">Início</a><ChevronRight size={13}/><span className="text-slate-600">Produtos</span></div>
        <p className="text-[10px] font-bold uppercase tracking-[.22em] text-[#b17b55]">Nossa coleção</p>
        <h1 className="mt-2 font-serif text-4xl font-bold text-[#173e43] sm:text-5xl">Todos os produtos</h1>
        <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600">Encontre materiais digitais preparados para imprimir, criar e tornar cada ocasião mais especial.</p>
      </div>
    </section>
    <section className="mx-auto max-w-[1160px] px-4 py-9">
      <div className="grid gap-8 lg:grid-cols-[230px_1fr]">
        <aside>
          <div className="mb-4 flex items-center gap-2 text-sm font-bold text-[#173e43]"><SlidersHorizontal size={17}/> Categorias</div>
          <div className="flex flex-wrap gap-2 lg:flex-col lg:gap-0 lg:divide-y lg:divide-slate-100">
            <button onClick={() => setCategory("Todas")} className={`rounded-full px-3 py-2 text-left text-xs lg:rounded-none lg:px-0 ${category === "Todas" ? "bg-[#edf4f1] font-bold text-[#173e43] lg:bg-transparent" : "text-slate-500"}`}>Todas as categorias</button>
            {catalogCategories.map((item) => { const count = publishedProducts.filter((product) => product.category === item).length; return <button key={item} onClick={() => setCategory(item)} className={`flex items-center justify-between gap-3 rounded-full px-3 py-2 text-left text-xs lg:rounded-none lg:px-0 ${category === item ? "bg-[#edf4f1] font-bold text-[#173e43] lg:bg-transparent" : "text-slate-500 hover:text-[#173e43]"}`}><span>{item}</span><span className="text-[10px] text-slate-400">{count}</span></button>; })}
          </div>
        </aside>
        <div>
          <div className="mb-4 flex flex-wrap gap-2" aria-label="Filtros rápidos">
            <button onClick={() => setType("all")} aria-pressed={type === "all"} className={`rounded-full px-4 py-2 text-xs font-bold ${type === "all" ? "bg-[#173e43] text-white" : "border border-slate-200 text-slate-600"}`}>Todos</button>
            <button onClick={() => setType("new")} aria-pressed={type === "new"} className={`rounded-full px-4 py-2 text-xs font-bold ${type === "new" ? "bg-[#173e43] text-white" : "border border-slate-200 text-slate-600"}`}>Lançamentos</button>
            <button onClick={() => setType("free")} aria-pressed={type === "free"} className={`rounded-full px-4 py-2 text-xs font-bold ${type === "free" ? "bg-[#173e43] text-white" : "border border-slate-200 text-slate-600"}`}>Gratuitos</button>
          </div>
          <div className="mb-6 flex flex-col gap-3 sm:flex-row">
            <label className="flex flex-1 items-center gap-2 rounded-lg border border-slate-200 px-4 py-3"><Search size={17} className="text-slate-400"/><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar no catálogo..." className="w-full bg-transparent text-sm outline-none"/></label>
            <label className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-500"><ArrowUpDown size={15}/><span>Ordenar:</span><select value={sort} onChange={(event) => setSort(event.target.value)} className="bg-transparent py-1 font-semibold text-slate-700 outline-none"><option value="featured">Destaques</option><option value="newest">Mais recentes</option><option value="popular">Mais populares</option><option value="name">Nome</option><option value="price-asc">Menor preço</option><option value="price-desc">Maior preço</option></select></label>
          </div>
          <p className="mb-5 text-xs text-slate-400">{products.length} {products.length === 1 ? "produto encontrado" : "produtos encontrados"}</p>
          {products.length ? <>
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {visibleProducts.map((product) => <article key={product.id} className="group overflow-hidden rounded-xl border border-slate-100 bg-white transition hover:-translate-y-1 hover:shadow-lg">
                <a href={`/produto/${product.slug}`} className="relative block overflow-hidden bg-[#f7f5ef]"><img src={product.image || produtoImage} alt={product.name} className="aspect-square w-full object-contain p-5 transition duration-500 group-hover:scale-[1.03]"/>{product.isNew && <span className="absolute left-3 top-3 rounded-full bg-[#b17b55] px-3 py-1 text-[9px] font-bold uppercase tracking-wider text-white">Lançamento</span>}{product.price === 0 && <span className="absolute right-3 top-3 rounded-full bg-[#315c55] px-3 py-1 text-[9px] font-bold uppercase tracking-wider text-white">Gratuito</span>}</a>
                <div className="p-5"><p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#b17b55]">{product.category}</p><a href={`/produto/${product.slug}`} className="mt-2 block font-serif text-xl font-bold text-[#173e43] hover:text-[#b17b55]">{product.name}</a><p className="mt-2 min-h-10 text-xs leading-5 text-slate-500">{product.shortDescription}</p><div className="mt-4 flex items-center justify-between"><strong className="text-lg text-[#173e43]">{product.price === 0 ? "Gratuito" : product.price.toLocaleString("pt-BR", {style:"currency",currency:"BRL"})}</strong><a href={`/produto/${product.slug}`} className="rounded-full bg-[#173e43] px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-white hover:bg-[#24565b]">Ver produto</a></div></div>
              </article>)}
            </div>
            {pageCount > 1 && <nav aria-label="Paginação do catálogo" className="mt-8 flex items-center justify-center gap-2">{Array.from({length: pageCount}, (_, index) => index + 1).map((pageNumber) => <button key={pageNumber} onClick={() => {setPage(pageNumber); window.scrollTo({top: 0, behavior: "smooth"});}} aria-current={page === pageNumber ? "page" : undefined} className={`h-9 min-w-9 rounded-full px-3 text-xs font-bold ${page === pageNumber ? "bg-[#173e43] text-white" : "border border-slate-200 text-slate-600 hover:border-[#b17b55]"}`}>{pageNumber}</button>)}</nav>}
          </> : <div className="rounded-xl border border-dashed border-slate-200 px-6 py-16 text-center"><PackageOpen className="mx-auto text-slate-300" size={32}/><h2 className="mt-4 font-serif text-xl font-bold text-[#173e43]">Nenhum produto encontrado</h2><p className="mt-2 text-sm text-slate-500">Tente outro termo ou selecione uma categoria diferente.</p><button onClick={clearFilters} className="mt-4 text-xs font-bold text-[#b17b55] underline">Limpar filtros</button></div>}
        </div>
      </div>
    </section>
  </main>;
}
