import { useState } from "react";
import { Gift, Sparkles, Copy, Check, ArrowRight, Tag } from "lucide-react";

export type PromoCampaign = {
  id: string;
  title: string;
  message: string;
  discountLabel: string;
  couponCode: string;
  buttonLabel?: string;
};

export function SurpriseOffer({ campaign }: { campaign?: PromoCampaign | null }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  if (!campaign) return null;

  async function copyCoupon() {
    if (!campaign) return;
    try {
      await navigator.clipboard.writeText(campaign.couponCode);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return <>
    <button onClick={() => setOpen(true)} className="fixed bottom-24 right-5 z-40 flex items-center gap-2 rounded-full border-2 border-white bg-[#d92f78] px-4 py-3 text-xs font-black text-white shadow-xl shadow-[#d92f78]/25 transition hover:-translate-y-1 hover:bg-[#b51d64]" aria-label="Abrir presente surpresa">
      <Gift size={17}/> Você ganhou um presente!
    </button>
    {open && <div role="dialog" aria-modal="true" aria-labelledby="surprise-title" className="fixed inset-0 z-[70] flex items-center justify-center bg-[#34213a]/65 p-4" onClick={() => setOpen(false)}>
      <div className="relative w-full max-w-md overflow-hidden rounded-[2rem] bg-[#fffaf0] p-7 text-center shadow-2xl sm:p-9" onClick={(event) => event.stopPropagation()}>
        <button onClick={() => setOpen(false)} aria-label="Fechar" className="absolute right-4 top-4 rounded-full p-2 text-[#827985] hover:bg-[#ffe0eb]">✕</button>
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#ffe0eb] text-[#c72570]"><Gift size={30}/></span>
        <p className="mt-5 text-[10px] font-black uppercase tracking-[.2em] text-[#c72570]">Uma surpresa da Lírio Doce</p>
        <h2 id="surprise-title" className="mt-2 text-2xl font-black text-[#34213a]">{campaign.title}</h2>
        <p className="mt-3 text-sm leading-6 text-[#827985]">{campaign.message}</p>
        <div className="mt-6 rounded-2xl border-2 border-dashed border-[#e8c9a8] bg-white p-5">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#9b8d9b]">Seu presente</span>
          <strong className="mt-1 block text-4xl font-black text-[#c72570]">{campaign.discountLabel}</strong>
          <span className="mt-3 inline-flex items-center gap-2 rounded-lg bg-[#fff0b5] px-4 py-2 font-mono text-sm font-black tracking-widest text-[#34213a]">{campaign.couponCode}</span>
        </div>
        <button onClick={copyCoupon} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#d92f78] px-6 py-4 text-xs font-black uppercase tracking-wider text-white hover:bg-[#b51d64]">{copied ? <Check size={16}/> : <Copy size={16}/>} {copied ? "Cupom copiado" : "Copiar meu cupom"}</button>
        <p className="mt-3 text-[10px] text-[#9b8d9b]">Consulte as condições e a validade da campanha no checkout.</p>
      </div>
    </div>}
  </>;
}

export function CampaignBanner({ campaign, href = "/produtos" }: { campaign?: { eyebrow: string; title: string; description: string; buttonLabel: string }; href?: string }) {
  if (!campaign) return null;
  return <section className="mx-auto my-10 max-w-[1240px] px-4 sm:px-6">
    <div className="relative overflow-hidden rounded-[1.75rem] bg-gradient-to-r from-[#c72570] via-[#d92f78] to-[#ff9a48] px-6 py-8 text-white shadow-lg sm:px-10 sm:py-10">
      <Sparkles className="absolute -right-3 -top-4 h-36 w-36 text-white/15"/>
      <p className="text-[10px] font-black uppercase tracking-[.2em] text-white/80">{campaign.eyebrow}</p>
      <h2 className="mt-2 max-w-2xl text-2xl font-black sm:text-3xl">{campaign.title}</h2>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-white/85">{campaign.description}</p>
      <a href={href} className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-xs font-black uppercase tracking-wider text-[#b51d64] hover:bg-[#fff0b5]">{campaign.buttonLabel} <ArrowRight size={15}/></a>
    </div>
  </section>;
}

export function DiscountProgress({ subtotal, goal, label }: { subtotal: number; goal?: number | null; label?: string }) {
  if (!goal || goal <= 0) return null;
  const progress = Math.min(100, (subtotal / goal) * 100);
  const remaining = Math.max(0, goal - subtotal);
  const money = (value: number) => value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  return <div className="mt-5 rounded-2xl border border-[#f0dca1] bg-[#fffaf0] p-4">
    <div className="flex items-start gap-3"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#ffe0eb] text-[#c72570]"><Tag size={17}/></span><div className="min-w-0 flex-1"><p className="text-xs font-black text-[#34213a]">{remaining > 0 ? `Faltam ${money(remaining)} para liberar sua vantagem` : (label || "Você desbloqueou sua vantagem!")}</p><p className="mt-1 text-[11px] text-[#827985]">{label || "Continue adicionando produtos para alcançar a oferta."}</p></div></div>
    <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#f0e7df]"><div className="h-full rounded-full bg-gradient-to-r from-[#c72570] to-[#ff9a48] transition-all" style={{ width: `${progress}%` }}/></div>
    <div className="mt-2 flex justify-between text-[10px] font-bold text-[#9b8d9b]"><span>{money(subtotal)}</span><span>{money(goal)}</span></div>
  </div>;
}
