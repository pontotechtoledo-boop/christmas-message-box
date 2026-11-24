import { createFileRoute, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronRight, Download, Mail, Heart, ShoppingBag, Check, ShieldCheck } from "lucide-react";
import { addToCart } from "@/lib/cart";
import { getProductBySlug, getRelatedProducts, slugify, storeName } from "@/data/products";
import produtoImage from "@/assets/produto.jpg";
import { StoreFooter, StoreHeader } from "@/components/store-layout";

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
  const [favorite, setFavorite] = useState(false);
  const [added, setAdded] = useState(false);
  const relatedProducts = getRelatedProducts(product);
  return <><StoreHeader/><main className="mx-auto min-h-screen max-w-[1160px] px-4 py-8 sm:py-12">
    <div className="mb-8 flex items-center gap-2 text-[11px] text-slate-400"><a href="/">Início</a><ChevronRight size={12}/><a href="/produtos">Produtos</a><ChevronRight size={12}/><span className="text-slate-600">{product.name}</span></div>
    <div className="grid gap-9 lg:grid-cols-2 lg:gap-14">
      <div className="overflow-hidden rounded-2xl bg-[#fff9f5]"><img src={product.image || produtoImage} alt={product.name} className="aspect-square w-full object-contain p-6"/></div>
      <div className="flex flex-col">
        <p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#ed5965]"><a href={`/categoria/${slugify(product.category)}`} className="hover:underline">{product.category}</a> · Material digital</p>
        <h1 className="mt-3 font-sans text-3xl font-bold leading-tight text-[#251d2d] sm:text-4xl">{product.name}</h1>
        <p className="mt-5 text-sm leading-7 text-slate-600">{product.description}</p>
        <div className="mt-6 border-y border-slate-100 py-5"><strong className="text-3xl text-[#251d2d]">{product.price === 0 ? "Gratuito" : product.price.toLocaleString("pt-BR",{style:"currency",currency:"BRL"})}</strong><p className="mt-1 text-xs text-slate-500">Pagamento único · Arquivo {product.format}</p></div>
        <div className="mt-5 flex flex-wrap gap-3"><button onClick={() => { addToCart({ productId: product.id, slug: product.slug, name: product.name, price: product.price, format: product.format, image: product.image }); setAdded(true); }} className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#ff5b69] px-5 py-3.5 text-xs font-black uppercase tracking-wider text-white transition hover:bg-[#e84959]"><ShoppingBag size={17}/>{added ? "Adicionar mais uma unidade" : "Adicionar ao carrinho"}</button><button onClick={() => setFavorite(!favorite)} aria-pressed={favorite} aria-label="Favoritar produto" className={`rounded-lg border px-4 ${favorite ? "border-rose-200 bg-rose-50 text-rose-600" : "border-slate-200 text-slate-500"}`}><Heart size={19} fill={favorite ? "currentColor" : "none"}/></button></div>
        {added && <a href="/carrinho" className="mt-3 inline-flex items-center gap-2 text-xs font-bold text-[#159b50] hover:underline"><Check size={15}/> Produto adicionado. Ver carrinho</a>}
        <div className="mt-8 grid gap-4 border-t border-slate-100 pt-6 text-xs text-slate-600 sm:grid-cols-2"><div className="flex gap-3"><Download size={18} className="text-[#ed5965]"/><span><b className="block text-slate-800">Produto digital</b>Sem envio físico</span></div><div className="flex gap-3"><Mail size={18} className="text-[#ed5965]"/><span><b className="block text-slate-800">Entrega digital</b>Conforme condições da loja</span></div></div>
      </div>
    </div>
    <section className="mt-14 grid gap-8 border-t border-slate-100 pt-9 md:grid-cols-[1.2fr_.8fr]"><div><p className="text-[10px] font-black uppercase tracking-[.2em] text-[#ed5965]">Detalhes do produto</p><h2 className="mt-2 font-sans text-2xl font-bold text-[#251d2d]">O que você vai receber</h2><p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">{product.description}</p>{product.details?.length ? <ul className="mt-5 space-y-3">{product.details.map((detail) => <li key={detail} className="flex items-start gap-3 text-sm text-slate-600"><span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#eaf8ef] text-[#159b50]"><Check size={12}/></span>{detail}</li>)}</ul> : <p className="mt-4 text-sm text-slate-600">Consulte a descrição acima para conferir o conteúdo incluído neste produto.</p>}</div><aside className="h-fit rounded-2xl bg-[#fff5f1] p-6"><div className="flex items-center gap-2 text-[#ed5965]"><Download size={18}/><h3 className="text-sm font-black">Produto digital</h3></div><p className="mt-3 text-xs leading-6 text-slate-600">Este produto não possui envio físico. As instruções e o acesso ao arquivo serão apresentados após a ativação do checkout e da entrega digital.</p><div className="mt-5 flex items-start gap-2 border-t border-[#f0ded8] pt-4 text-xs leading-5 text-slate-500"><ShieldCheck size={16} className="mt-0.5 shrink-0 text-[#ed5965]"/>Confira formato, conteúdo e requisitos antes de finalizar a compra.</div></aside></section>
    {relatedProducts.length > 0 && <section className="mt-14 border-t border-slate-100 pt-9"><div className="flex items-end justify-between gap-4"><div><p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#ed5965]">Continue explorando</p><h2 className="mt-2 font-sans text-2xl font-bold text-[#251d2d]">Produtos relacionados</h2></div><a href={`/categoria/${slugify(product.category)}`} className="text-xs font-bold text-[#ed5965] hover:underline">Ver categoria</a></div><div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{relatedProducts.map((item) => <article key={item.id} className="overflow-hidden rounded-xl border border-slate-100"><a href={`/produto/${item.slug}`}><img src={item.image || produtoImage} alt={item.name} className="aspect-square w-full bg-[#fff9f5] object-contain p-4"/></a><div className="p-4"><a href={`/produto/${item.slug}`} className="font-sans font-bold text-[#251d2d] hover:text-[#ed5965]">{item.name}</a><p className="mt-2 text-sm font-bold text-[#251d2d]">{item.price === 0 ? "Gratuito" : item.price.toLocaleString("pt-BR",{style:"currency",currency:"BRL"})}</p></div></article>)}</div></section>}
  </main><StoreFooter/></>;
}
