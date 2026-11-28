import { createFileRoute } from "@tanstack/react-router";
import { Download, Package, UserRound, ShieldCheck, MessageCircle, LockKeyhole } from "lucide-react";
import { storeName } from "@/data/products";
import { AccountPanel } from "@/components/account-panel";
import { StoreFooter, StoreHeader } from "@/components/store-layout";

export const Route = createFileRoute("/minha-conta")({
  head: () => ({ meta: [
    { title: "Minha conta | " + storeName },
    { name: "description", content: "Acesse seus pedidos e downloads digitais." },
    { property: "og:title", content: "Minha conta | " + storeName },
    { property: "og:description", content: "Seus pedidos e downloads." },
    { property: "og:type", content: "website" },
  ]}),
  component: CustomerAccountPage,
});

function CustomerAccountPage() {
  return <><StoreHeader/><main className="min-h-screen bg-[#fffaf0] text-[#34213a]">
    <section className="bg-[#3a2343] px-4 py-14 text-white sm:py-16"><div className="mx-auto max-w-[1120px]"><p className="text-[10px] font-black uppercase tracking-[.22em] text-[#ffd76d]">Área do cliente</p><h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">Sua conta, seus produtos.</h1><p className="mt-4 max-w-xl text-sm leading-7 text-white/65">O cadastro é opcional. Você pode comprar sem criar uma conta e receber seus produtos diretamente no e-mail informado no pagamento.</p></div></section>
    <AccountPanel/>
    <section className="mx-auto grid max-w-[1120px] gap-7 px-4 py-10 lg:grid-cols-[.85fr_1.15fr]">
      <div className="rounded-[1.5rem] border border-[#f0dca1] bg-white p-6 shadow-sm sm:p-8"><span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#ffe0eb] text-[#b51d64]"><UserRound size={22}/></span><h2 className="mt-5 text-2xl font-black">Acesso opcional</h2><p className="mt-2 text-sm leading-6 text-[#827985]">Você não precisa criar uma conta para comprar. Ao finalizar o pagamento pela Stripe, informe seu melhor e-mail: é por lá que enviaremos os detalhes e o acesso aos seus produtos digitais.</p><div className="mt-6 rounded-2xl bg-[#fff0b5] p-4"><div className="flex gap-3"><LockKeyhole className="mt-0.5 shrink-0 text-[#c72570]" size={18}/><div><p className="text-sm font-bold">Compra sem cadastro obrigatório</p><p className="mt-1 text-xs leading-5 text-[#827985]">O e-mail informado durante o pagamento será usado para enviar a confirmação e a entrega digital. Guarde essa mensagem para acessar seu produto.</p></div></div></div><a href="https://wa.me/5545988018222?text=Ol%C3%A1%21%20Preciso%20de%20ajuda%20para%20acessar%20minha%20conta." target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#c72570] hover:underline"><MessageCircle size={16}/> Precisa de ajuda?</a></div>
      <div className="rounded-[1.5rem] border border-[#eee7e2] bg-white p-6 shadow-sm sm:p-8"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-[10px] font-black uppercase tracking-[.2em] text-[#c72570]">Biblioteca digital</p><h2 className="mt-2 text-2xl font-black">Receba por e-mail</h2></div><span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#ffe0eb] text-[#b51d64]"><Download size={22}/></span></div><div className="mt-7 rounded-2xl border border-dashed border-[#f0dca1] bg-[#fffaf0] px-5 py-10 text-center"><Package className="mx-auto text-[#e4b83f]" size={30}/><h3 className="mt-4 text-lg font-black">Seu produto vai até você</h3><p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#827985]">Após a confirmação do pagamento, enviaremos um e-mail especial com as informações da compra e o acesso ao arquivo digital. Não é necessário criar uma conta.</p><span className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#ffe0eb] px-4 py-2 text-[10px] font-black uppercase tracking-wider text-[#b51d64]"><ShieldCheck size={14}/> Entrega digital por e-mail</span></div><p className="mt-5 text-xs leading-5 text-[#9a9098]">Esta página é opcional. A compra e o recebimento do produto serão feitos pelo e-mail informado no checkout da Stripe.</p></div>
    </section>
  </main><StoreFooter/></>;
}
