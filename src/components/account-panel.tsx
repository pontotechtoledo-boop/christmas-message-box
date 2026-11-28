import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import type { User } from "@supabase/supabase-js";
import { Download, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { getDownloadUrl } from "@/lib/account.functions";

type Order = { id: string; status: string; total: number; created_at: string; order_items: { product_id: string | null; product_name: string; quantity: number }[] };
const statusLabel: Record<string, string> = { pending: "Aguardando pagamento", paid: "Pago", failed: "Falhou", canceled: "Cancelado", refunded: "Reembolsado" };

export function AccountPanel() {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const download = useServerFn(getDownloadUrl);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setUser(s?.user ?? null));
    return () => sub.subscription.unsubscribe();
  }, []);
  useEffect(() => {
    if (!user) return;
    supabase.from("orders").select("id,status,total,created_at,order_items(product_id,product_name,quantity)").order("created_at", { ascending: false })
      .then(({ data }) => setOrders((data as Order[]) ?? []));
    supabase.rpc("has_role", { _user_id: user.id, _role: "admin" }).then(({ data }) => setIsAdmin(Boolean(data)));
  }, [user]);

  async function get(orderId: string, productId: string) {
    setMsg(null);
    try { const { url } = await download({ data: { orderId, productId } }); window.location.href = url; }
    catch (e) { setMsg(e instanceof Error ? e.message : "Erro no download"); }
  }

  if (user === undefined) return null;
  if (!user) return <div className="mx-auto max-w-[1120px] px-4 pt-10"><div className="flex flex-wrap items-center justify-between gap-4 rounded-[1.5rem] border border-[#f0dca1] bg-white p-6"><p className="text-sm">Já comprou ou quer acompanhar seus pedidos? Entre na sua conta.</p><a href="/auth" className="rounded-full bg-[#d92f78] px-6 py-3 text-xs font-black uppercase text-white">Entrar / Cadastrar</a></div></div>;
  return <div className="mx-auto max-w-[1120px] px-4 pt-10"><div className="rounded-[1.5rem] border border-[#f0dca1] bg-white p-6 sm:p-8">
    <div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-[10px] font-black uppercase tracking-[.2em] text-[#c72570]">Olá</p><h2 className="text-xl font-black">{user.email}</h2></div>
      <div className="flex gap-2">{isAdmin && <a href="/admin" className="rounded-full bg-[#3a2343] px-5 py-2.5 text-xs font-black uppercase text-white">Painel admin</a>}<button onClick={async () => { await supabase.auth.signOut(); window.location.replace("/auth"); }} className="inline-flex items-center gap-1 rounded-full border px-5 py-2.5 text-xs font-bold"><LogOut size={14}/> Sair</button></div></div>
    <h3 className="mt-7 text-sm font-black">Meus pedidos</h3>
    {orders.length === 0 ? <p className="mt-2 text-sm text-[#827985]">Você ainda não tem pedidos.</p> : <ul className="mt-3 divide-y">{orders.map((o) => <li key={o.id} className="py-4">
      <div className="flex flex-wrap justify-between gap-2 text-sm"><span>{new Date(o.created_at).toLocaleDateString("pt-BR")} · <b>{statusLabel[o.status] ?? o.status}</b></span><b>{Number(o.total).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</b></div>
      <ul className="mt-2 space-y-1">{o.order_items.map((i) => <li key={i.product_name} className="flex items-center justify-between text-xs text-[#665766]"><span>{i.quantity}× {i.product_name}</span>{o.status === "paid" && i.product_id && <button onClick={() => get(o.id, i.product_id!)} className="inline-flex items-center gap-1 font-bold text-[#c72570]"><Download size={13}/> Baixar</button>}</li>)}</ul>
    </li>)}</ul>}
    {msg && <p className="mt-3 text-xs text-red-600">{msg}</p>}
  </div></div>;
}
