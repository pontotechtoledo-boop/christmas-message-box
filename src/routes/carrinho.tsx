import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2, ShieldCheck } from "lucide-react";
import { StoreFooter, StoreHeader } from "@/components/store-layout";
import { CartItem, clearCart, getCartSubtotal, readCart, removeFromCart, updateCartQuantity } from "@/lib/cart";
import produtoImage from "@/assets/produto.jpg";
import { storeName } from "@/data/products";

export const Route = createFileRoute("/carrinho")({
  head: () => ({ meta: [
    { title: "Meu carrinho | " + storeName },
    { name: "description", content: "Revise os produtos digitais adicionados ao carrinho." },
  ]}),
  component: CartPage,
});

function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  useEffect(() => {
    setItems(readCart());
    const refresh = () => setItems(readCart());
    window.addEventListener("store-cart-updated", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("store-cart-updated", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);
  const subtotal = useMemo(() => getCartSubtotal(items), [items]);
  const money = (value: number) => value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  function changeQuantity(item: CartItem, quantity: number) {
    setItems(updateCartQuantity(item.productId, quantity));
  }
  function remove(item: CartItem) {
    setItems(removeFromCart(item.productId));
  }

  return <><StoreHeader/><main className="min-h-screen bg-[#fffaf0] px-4 py-10 text-[#34213a] sm:py-14">
    <div className="mx-auto max-w-[1080px]">
      <p className="text-[10px] font-black uppercase tracking-[.22em] text-[#c72570]">Sua seleção</p>
      <h1 className="mt-2 text-4xl font-black tracking-tight sm:text-5xl">Meu carrinho</h1>
      <p className="mt-3 text-sm text-[#827985]">Confira os produtos digitais antes de continuar.</p>
      {items.length === 0 ? <section className="mt-9 rounded-[1.5rem] border border-dashed border-[#f0dca1] bg-white px-6 py-16 text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#ffe0eb] text-[#b51d64]"><ShoppingBag size={25}/></span>
        <h2 className="mt-5 text-xl font-black">Seu carrinho está vazio</h2>
        <p className="mt-2 text-sm text-[#827985]">Explore a loja e adicione os produtos que deseja adquirir.</p>
        <a href="/produtos" className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#d92f78] px-6 py-3.5 text-xs font-black uppercase tracking-wider text-white hover:bg-[#b51d64]">Explorar produtos <ArrowRight size={15}/></a>
      </section> : <div className="mt-9 grid gap-7 lg:grid-cols-[1fr_340px]">
        <section className="space-y-4">
          {items.map((item) => <article key={item.productId} className="flex flex-col gap-4 rounded-2xl border border-[#f0dca1] bg-white p-4 sm:flex-row sm:items-center">
            <img src={item.image || produtoImage} alt={item.name} className="h-28 w-full rounded-xl bg-[#fff0b5] object-contain p-2 sm:w-28"/>
            <div className="min-w-0 flex-1"><p className="text-[9px] font-black uppercase tracking-[.16em] text-[#c72570]">Arquivo digital · {item.format}</p><a href={"/produto/" + item.slug} className="mt-1 block text-lg font-black hover:text-[#b51d64]">{item.name}</a><p className="mt-2 text-sm font-bold">{money(item.price)}</p></div>
            <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end"><div className="flex items-center gap-3 rounded-full border border-[#eee7e2] px-2 py-1"><button onClick={() => changeQuantity(item, item.quantity - 1)} aria-label="Diminuir quantidade" className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-[#ffe0eb]"><Minus size={14}/></button><span className="min-w-5 text-center text-sm font-bold">{item.quantity}</span><button onClick={() => changeQuantity(item, item.quantity + 1)} aria-label="Aumentar quantidade" className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-[#fff0ed]"><Plus size={14}/></button></div><button onClick={() => remove(item)} className="inline-flex items-center gap-1 text-xs font-bold text-[#a49aa2] hover:text-red-600"><Trash2 size={14}/> Remover</button></div>
          </article>)}
          <button onClick={() => { clearCart(); setItems([]); }} className="text-xs font-bold text-[#9a9098] underline hover:text-red-600">Esvaziar carrinho</button>
        </section>
        <aside className="h-fit rounded-[1.5rem] border border-[#eee7e2] bg-white p-6 shadow-sm">
          <h2 className="text-xl font-black">Resumo do pedido</h2>
          <div className="mt-6 flex justify-between text-sm text-[#827985]"><span>Itens ({items.reduce((n, item) => n + item.quantity, 0)})</span><span>{money(subtotal)}</span></div>
          <div className="mt-4 flex justify-between border-t border-[#eee7e2] pt-4 text-lg font-black"><span>Subtotal</span><span>{money(subtotal)}</span></div>
          <button disabled className="mt-6 flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-full bg-[#e8e4e6] px-5 py-4 text-xs font-black uppercase tracking-wider text-[#8f858d]">Finalização em configuração</button>
          <div className="mt-5 flex gap-3 rounded-xl bg-[#fff0b5] p-4 text-xs leading-5 text-[#6c4d25]"><ShieldCheck size={18} className="mt-0.5 shrink-0"/><p>O carrinho já está funcionando neste navegador. O pagamento e a confirmação do pedido serão ativados quando o checkout seguro for integrado.</p></div>
          <a href="/produtos" className="mt-5 block text-center text-xs font-bold text-[#b51d64] hover:underline">Continuar comprando</a>
        </aside>
      </div>}
    </div>
  </main><StoreFooter/></>;
}
