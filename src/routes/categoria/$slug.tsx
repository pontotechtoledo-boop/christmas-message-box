import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { ChevronRight, PackageOpen } from "lucide-react";
import { catalogCategories, getPublishedProducts, slugify, storeName } from "@/data/products";
import produtoImage from "@/assets/produto.jpg";

export const Route = createFileRoute("/categoria/$slug")({
  loader: ({ params }) => {
    const category = catalogCategories.find((item) => slugify(item) === params.slug);
    return { category: category || null };
  },
  head: ({ loaderData }) => ({ meta: [
    { title: `${loaderData?.category || "Categoria"} | ${storeName}` },
    { name: "description", content: "Explore os materiais digitais desta categoria." },
  ]}),
  component: CategoryPage,
});

function CategoryPage() {
  const { category } = Route.useLoaderData();
  const products = useMemo(() => category ? getPublishedProducts().filter((product) => product.category === category) : [], [category]);
  if (!category) return <main className="mx-auto max-w-4xl px-4 py-20 text-center"><h1 className="font-serif text-3xl font-bold text-[#173e43]">Categoria não encontrada</h1><a className="mt-5 inline-block text-sm text-[#b17b55] underline" href="/produtos">Ver todos os produtos</a></main>;
  return <main className="mx-auto min-h-screen max-w-[1160px] px-4 py-10">
    <div className="mb-7 flex items-center gap-2 text-[11px] text-slate-400"><a href="/">Início</a><ChevronRight size={12}/><a href="/produtos">Produtos</a><ChevronRight size={12}/><span className="text-slate-600">{category}</span></div>
    <p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#b17b55]">Explore por categoria</p><h1 className="mt-2 font-serif text-4xl font-bold text-[#173e43]">{category}</h1><p className="mt-3 text-sm text-slate-500">{products.length} {products.length === 1 ? "produto disponível" : "produtos disponíveis"}</p>
    {products.length ? <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{products.map((product) => <article key={product.id} className="overflow-hidden rounded-xl border border-slate-100"><a href={`/produto/${product.slug}`}><img src={product.image || produtoImage} alt={product.name} className="aspect-square w-full bg-[#f7f5ef] object-contain p-5"/></a><div className="p-5"><a href={`/produto/${product.slug}`} className="font-serif text-xl font-bold text-[#173e43]">{product.name}</a><p className="mt-2 text-sm text-slate-500">{product.shortDescription}</p><div className="mt-4 flex items-center justify-between"><b className="text-lg text-[#173e43]">{product.price.toLocaleString("pt-BR",{style:"currency",currency:"BRL"})}</b><a href={`/produto/${product.slug}`} className="text-xs font-bold text-[#b17b55] underline">Ver produto</a></div></div></article>)}</div> : <div className="mt-8 rounded-xl border border-dashed border-slate-200 py-16 text-center"><PackageOpen className="mx-auto text-slate-300" size={32}/><h2 className="mt-4 font-serif text-xl font-bold text-[#173e43]">Novidades em breve</h2><p className="mt-2 text-sm text-slate-500">Ainda não há produtos publicados nesta categoria.</p><a href="/produtos" className="mt-4 inline-block text-xs font-bold text-[#b17b55] underline">Explorar catálogo</a></div>}
  </main>;
}
