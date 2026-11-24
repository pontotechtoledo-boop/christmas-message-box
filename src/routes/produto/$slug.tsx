import { createFileRoute, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronRight, Download, Mail, Heart, ShoppingBag } from "lucide-react";
import { getProductBySlug, getRelatedProducts, slugify, storeName } from "@/data/products";
import produtoImage from "@/assets/produto.jpg";

export const Route = createFileRoute("/produto/$slug")({
  loader: ({ params }) => {
    const product = getProductBySlug(params.slug);
    if (!product) throw notFound();
    return product;
  },
  head: ({ loaderData }) => ({ meta: [
    { title: loaderData ? `${loaderData.name} | ${storeName}` : storeName },
    { name: "description", content: loaderData?.shortDescription || "Conheça nosso material digital." },
    { property: "og:type", content: "product" },
  ]}),
  component: ProductPage,
});

function ProductPage() {
  const product = Route.useLoaderData();
  const [favorite, setFavorite] = useState(false);\n  const relatedProducts = getRelatedProducts(product);
  return <main className="mx-auto min-h-screen max-w-[1160px] px-4 py-8 sm:py-12">
    <div className="mb-8 flex items-center gap-2 text-[11px] text-slate-400"><a href="/">Início</a><ChevronRight size={12}/><a href="/produtos">Produtos</a><ChevronRight size={12}/><span className="text-slate-600">{product.name}</span></div>
    <div className="grid gap-9 lg:grid-cols-2 lg:gap-14">
      <div className="overflow-hidden rounded-2xl bg-[#f7f5ef]"><img src={product.image || produtoImage} alt={product.name} className="aspect-square w-full object-contain p-6"/></div>
      <div className="flex flex-col">
        <p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#b17b55]"><a href={`/categoria/${slugify(product.category)}`} className="hover:underline">{product.category}</a> · Material digital</p>
        <h1 className="mt-3 font-serif text-3xl font-bold leading-tight text-[#173e43] sm:text-4xl">{product.name}</h1>
        <p className="mt-5 text-sm leading-7 text-slate-600">{product.description}</p>
        <div className="mt-6 border-y border-slate-100 py-5"><strong className="text-3xl text-[#173e43]">{product.price === 0 ? "Gratuito" : product.price.toLocaleString("pt-BR",{style:"currency",currency:"BRL"})}</strong><p className="mt-1 text-xs text-slate-500">Pagamento único · Arquivo {product.format}</p></div>
        <div className="mt-5 flex gap-3"><button disabled className="flex flex-1 cursor-not-allowed items-center justify-center gap-2 rounded-lg bg-slate-200 px-5 py-3 text-xs font-bold uppercase tracking-wider text-slate-500"><ShoppingBag size={17}/> Compra online em configuração</button><button onClick={() => setFavorite(!favorite)} aria-pressed={favorite} aria-label="Favoritar produto" className={`rounded-lg border px-4 ${favorite ? "border-rose-200 bg-rose-50 text-rose-600" : "border-slate-200 text-slate-500"}`}><Heart size={19} fill={favorite ? "currentColor" : "none"}/></button></div>
        
        <div className="mt-8 grid gap-4 border-t border-slate-100 pt-6 text-xs text-slate-600 sm:grid-cols-2"><div className="flex gap-3"><Download size={18} className="text-[#b17b55]"/><span><b className="block text-slate-800">Produto digital</b>Sem envio físico</span></div><div className="flex gap-3"><Mail size={18} className="text-[#b17b55]"/><span><b className="block text-slate-800">Entrega digital</b>Conforme condições da loja</span></div></div>
      </div>
    </div>
    <section className="mt-14 border-t border-slate-100 pt-8"><h2 className="font-serif text-2xl font-bold text-[#173e43]">Sobre este material</h2><p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">{product.description}</p><p className="mt-3 text-xs text-slate-500">Formato: {product.format}. Confira os detalhes e as condições de acesso antes de concluir sua compra.</p></section>\n    {relatedProducts.length > 0 && <section className="mt-14 border-t border-slate-100 pt-9"><div className="flex items-end justify-between gap-4"><div><p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#b17b55]">Continue explorando</p><h2 className="mt-2 font-serif text-2xl font-bold text-[#173e43]">Produtos relacionados</h2></div><a href={`/categoria/${slugify(product.category)}`} className="text-xs font-bold text-[#b17b55] hover:underline">Ver categoria</a></div><div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{relatedProducts.map((item) => <article key={item.id} className="overflow-hidden rounded-xl border border-slate-100"><a href={`/produto/${item.slug}`}><img src={item.image || produtoImage} alt={item.name} className="aspect-square w-full bg-[#f7f5ef] object-contain p-4"/></a><div className="p-4"><a href={`/produto/${item.slug}`} className="font-serif font-bold text-[#173e43] hover:text-[#b17b55]">{item.name}</a><p className="mt-2 text-sm font-bold text-[#173e43]">{item.price === 0 ? "Gratuito" : item.price.toLocaleString("pt-BR",{style:"currency",currency:"BRL"})}</p></div></article>)}</div></section>}
  </main>;
}
