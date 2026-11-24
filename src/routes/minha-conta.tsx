import { createFileRoute } from "@tanstack/react-router";
import { Download, Package, UserRound, ShieldCheck, MessageCircle, LockKeyhole } from "lucide-react";
import { storeName } from "@/data/products";
import { StoreFooter, StoreHeader } from "@/components/store-layout";

export const Route = createFileRoute("/minha-conta")({
  head: () => ({ meta: [
    { title: "Minha conta | " + storeName },
    { name: "description", content: "Acesse seus pedidos e downloads digitais." },
  ]}),
  component: CustomerAccountPage,
});

function CustomerAccountPage() {
  return <><StoreHeader/><main className="min-h-screen bg-[#fffdfb] text-[#251d2d]">
    <section className="bg-[#251d2d] px-4 py-14 text-white sm:py-16"><div className="mx-auto max-w-[1120px]"><p className="text-[10px] font-black uppercase tracking-[.22em] text-[#ff9da2]">Área do cliente</p><h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">Sua conta, seus produtos.</h1><p className="mt-4 max-w-xl text-sm leading-7 text-white/65">Consulte seus pedidos e encontre os arquivos digitais das suas compras em um só lugar.</p></div></section>
    <section className="mx-auto grid max-w-[1120px] gap-7 px-4 py-10 lg:grid-cols-[.85fr_1.15fr]">
      <div className="rounded-[1.5rem] border border-[#eee7e2] bg-white p-6 shadow-sm sm:p-8"><span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fff0ed] text-[#ed5965]"><UserRound size={22}/></span><h2 className="mt-5 text-2xl font-black">Entrar na minha conta</h2><p className="mt-2 text-sm leading-6 text-[#827985]">A área de login será conectada à autenticação da loja na próxima etapa de configuração.</p><div className="mt-6 rounded-2xl bg-[#fff7f4] p-4"><div className="flex gap-3"><LockKeyhole className="mt-0.5 shrink-0 text-[#ed5965]" size={18}/><div><p className="text-sm font-bold">Acesso protegido</p><p className="mt-1 text-xs leading-5 text-[#827985]">Seus pedidos e links de download deverão ficar disponíveis somente após a identificação da sua conta.</p></div></div></div><a href="https://wa.me/5545988018222?text=Ol%C3%A1%21%20Preciso%20de%20ajuda%20para%20acessar%20minha%20conta." target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#ed5965] hover:underline"><MessageCircle size={16}/> Precisa de ajuda?</a></div>
      <div className="rounded-[1.5rem] border border-[#eee7e2] bg-white p-6 shadow-sm sm:p-8"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-[10px] font-black uppercase tracking-[.2em] text-[#ed5965]">Biblioteca digital</p><h2 className="mt-2 text-2xl font-black">Meus downloads</h2></div><span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f2edff] text-[#8063c7]"><Download size={22}/></span></div><div className="mt-7 rounded-2xl border border-dashed border-[#e9e1dc] bg-[#fffdfb] px-5 py-10 text-center"><Package className="mx-auto text-[#c9bdc4]" size={30}/><h3 className="mt-4 text-lg font-black">Seus arquivos aparecerão aqui</h3><p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#827985]">Depois que a autenticação, os pedidos e a entrega digital forem conectados, você poderá acessar novamente os produtos adquiridos.</p><span className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#f5f0ff] px-4 py-2 text-[10px] font-black uppercase tracking-wider text-[#8063c7]"><ShieldCheck size={14}/> Área preparada para integração</span></div><p className="mt-5 text-xs leading-5 text-[#9a9098]">Ainda não conectamos esta tela ao histórico real de compras. Não há pedidos ou downloads fictícios sendo exibidos.</p></div>
    </section>
  </main><StoreFooter/></>;
}
