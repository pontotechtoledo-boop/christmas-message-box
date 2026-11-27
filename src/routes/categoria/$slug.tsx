import { createFileRoute } from "@tanstack/react-router";
import { ChevronRight, PackageOpen } from "lucide-react";
import { storeName } from "@/data/products";
import { getCatalog } from "@/lib/catalog.functions";
import produtoImage from "@/assets/produto.jpg";
import { StoreFooter, StoreHeader } from "@/components/store-layout";

export const Route = createFileRoute("/categoria/$slug")({
  loader: async ({ params }) => {
    const { categories, products } = await getCatalog();
    const category = categories.find((item) => item.slug === params.slug)?.name ?? null;
    return { category, products: category ? products.filter((p) => p.category === category) : [] };
  },
  errorComponent: ({ error }) => <div role="alert" className="p-10 text-center">Não foi possível carregar: {error.message}</div>,
  head: ({ loaderData }) => ({ meta: [
    { title: `${loaderData?.category || "Categoria"} | ${storeName}` },
    { name: "description", content: "Explore os materiais digitais desta categoria." },
  ]}),
  component: CategoryPage,
});

function CategoryPage() {
  const { category, products } = Route.useLoaderData();
  if (!category) return <><StoreHeader/><main className="mx-auto max-w-4xl px-4 py-20 text-center"><h1 className="font-sans text-3xl font-bold text-[#34213a]">Categoria não encontrada</h1><a className="mt-5 inline-block text-sm text-[#c72570] underline" href="/produtos">Ver todos os produtos</a></main><StoreFooter/></>;
  return <><StoreHeader/><main className="mx-auto min-h-screen max-w-[1160px] px-4 py-7 sm:py-10">
    <div className="mb-7 flex items-center gap-2 text-[11px] text-slate-400"><a href="/">Início</a><ChevronRight size={12}/><a href="/produtos">Produtos</a><ChevronRight size={12}/><span className="text-slate-600">{category}</span></div>
    <p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#c72570]">Explore por categoria</p><h1 className="mt-2 font-sans text-3xl font-bold text-[#34213a] sm:text-4xl">{category}</h1><p className="mt-3 text-sm text-slate-500">{products.length} {products.length === 1 ? "produto disponível" : "produtos disponíveis"}</p>
    {products.length ? <div className="mt-6 grid grid-cols-2 gap-3 sm:mt-8 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3">{products.map((product) => <article key={product.id} className="overflow-hidden rounded-xl border border-[#edcf76]"><a href={`/produto/${product.slug}`}><img src={product.image || produtoImage} alt={product.name} className="aspect-square w-full bg-[#fff0b5] object-contain p-5"/></a><div className="p-3 sm:p-5"><a href={`/produto/${product.slug}`} className="line-clamp-2 font-sans text-sm font-bold sm:text-xl text-[#34213a]">{product.name}</a><p className="mt-2 line-clamp-2 text-[10px] leading-4 text-slate-500 sm:text-sm sm:leading-normal">{product.shortDescription}</p><div className="mt-3 flex flex-col items-start justify-between gap-2 sm:mt-4 sm:flex-row sm:items-center"><b className="text-sm sm:text-lg text-[#34213a]">{product.price === 0 ? "Gratuito" : product.price.toLocaleString("pt-BR",{style:"currency",currency:"BRL"})}</b><a href={`/produto/${product.slug}`} className="w-full rounded-full bg-[#34213a] px-3 py-2.5 text-center text-[9px] font-bold uppercase text-white sm:w-auto sm:bg-transparent sm:px-0 sm:py-0 sm:text-xs sm:normal-case sm:text-[#b51d64] sm:underline">Ver produto</a></div></div></article>)}</div> : <div className="mt-8 rounded-xl border border-dashed border-[#eadcae] py-16 text-center"><PackageOpen className="mx-auto text-slate-300" size={32}/><h2 className="mt-4 font-sans text-xl font-bold text-[#34213a]">Novidades em breve</h2><p className="mt-2 text-sm text-slate-500">Ainda não há produtos publicados nesta categoria.</p><a href="/produtos" className="mt-4 inline-block text-xs font-bold text-[#c72570] underline">Explorar catálogo</a></div>}
  </main><StoreFooter/></>;
}
