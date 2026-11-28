import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { slugify, storeName } from "@/data/products";

type Product = Database["public"]["Tables"]["products"]["Row"];
type Category = Database["public"]["Tables"]["categories"]["Row"];
type Order = Database["public"]["Tables"]["orders"]["Row"];
type Coupon = Database["public"]["Tables"]["coupons"]["Row"];

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [
    { title: `Painel | ${storeName}` },
    { name: "description", content: "Painel administrativo da loja." },
    { property: "og:title", content: `Painel | ${storeName}` },
    { property: "og:description", content: "Gestão de produtos, pedidos e promoções." },
    { property: "og:type", content: "website" },
    { name: "robots", content: "noindex" },
  ]}),
  component: AdminPage,
});

const money = (v: number) => Number(v).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const inp = "w-full rounded-lg border border-[#e6dcd4] bg-white px-3 py-2 text-sm";
const btn = "rounded-full bg-[#d92f78] px-5 py-2 text-xs font-black uppercase text-white hover:bg-[#b51d64] disabled:opacity-50";
const statusLabel: Record<string, string> = { pending: "Aguardando", paid: "Pago", failed: "Falhou", canceled: "Cancelado", refunded: "Reembolsado" };

function AdminPage() {
  const [allowed, setAllowed] = useState<boolean | null>(null);
  const [tab, setTab] = useState<"resumo" | "produtos" | "categorias" | "pedidos" | "cupons">("resumo");
  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) return setAllowed(false);
      const { data: ok } = await supabase.rpc("has_role", { _user_id: data.user.id, _role: "admin" });
      setAllowed(Boolean(ok));
    });
  }, []);
  if (allowed === null) return <p className="p-10 text-center">Carregando…</p>;
  if (!allowed) return <div className="p-16 text-center"><h1 className="text-2xl font-black">Acesso restrito</h1><p className="mt-2 text-sm text-slate-500">Sua conta não é administradora.</p><a href="/" className="mt-4 inline-block underline">Voltar à loja</a></div>;
  return <div className="min-h-screen bg-[#fffaf0] text-[#34213a]">
    <header className="bg-[#3a2343] px-4 py-4 text-white"><div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3"><b>{storeName} · Painel</b><a href="/" className="text-xs underline">Ver loja</a></div></header>
    <nav className="mx-auto flex max-w-6xl flex-wrap gap-2 px-4 py-4">{(["resumo", "produtos", "categorias", "pedidos", "cupons"] as const).map((t) => <button key={t} onClick={() => setTab(t)} className={`rounded-full px-4 py-2 text-xs font-bold capitalize ${tab === t ? "bg-[#d92f78] text-white" : "bg-white"}`}>{t}</button>)}</nav>
    <main className="mx-auto max-w-6xl px-4 pb-16">
      {tab === "resumo" && <Dashboard/>}{tab === "produtos" && <Products/>}{tab === "categorias" && <Categories/>}{tab === "pedidos" && <Orders/>}{tab === "cupons" && <Coupons/>}
    </main>
  </div>;
}

function Dashboard() {
  const [days, setDays] = useState(30);
  const [orders, setOrders] = useState<Order[]>([]);
  const [counts, setCounts] = useState({ products: 0, customers: 0 });
  useEffect(() => {
    const since = new Date(Date.now() - days * 86400000).toISOString();
    supabase.from("orders").select("*").gte("created_at", since).then(({ data }) => setOrders(data ?? []));
    Promise.all([supabase.from("products").select("id", { count: "exact", head: true }), supabase.from("profiles").select("id", { count: "exact", head: true })])
      .then(([p, c]) => setCounts({ products: p.count ?? 0, customers: c.count ?? 0 }));
  }, [days]);
  const paid = orders.filter((o) => o.status === "paid");
  const cards = [["Faturamento", money(paid.reduce((s, o) => s + Number(o.total), 0))], ["Vendas pagas", paid.length], ["Pendentes", orders.filter((o) => o.status === "pending").length], ["Produtos", counts.products], ["Clientes", counts.customers]];
  return <section><div className="mb-4 flex gap-2">{[1, 7, 30, 365].map((d) => <button key={d} onClick={() => setDays(d)} className={`rounded-full px-3 py-1 text-xs ${days === d ? "bg-[#3a2343] text-white" : "bg-white"}`}>{d === 1 ? "Hoje" : d === 365 ? "12 meses" : `${d} dias`}</button>)}</div>
    <div className="grid grid-cols-2 gap-3 md:grid-cols-5">{cards.map(([l, v]) => <div key={l} className="rounded-2xl bg-white p-5"><p className="text-[10px] font-black uppercase text-[#9b8d9b]">{l}</p><p className="mt-2 text-xl font-black">{v}</p></div>)}</div></section>;
}

const emptyProduct = { name: "", slug: "", price: 0, promo_price: null as number | null, category_id: null as string | null, short_description: "", description: "", details: [] as string[], format: "PDF", status: "draft" as Product["status"], is_featured: false, is_new: false, is_adult: false, sort_order: 0, image_url: null as string | null, file_path: null as string | null };

function Products() {
  const [list, setList] = useState<Product[]>([]);
  const [cats, setCats] = useState<Category[]>([]);
  const [edit, setEdit] = useState<(typeof emptyProduct & { id?: string }) | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const load = () => { supabase.from("products").select("*").order("sort_order").then(({ data }) => setList(data ?? [])); supabase.from("categories").select("*").order("sort_order").then(({ data }) => setCats(data ?? [])); };
  useEffect(load, []);

  async function upload(file: File, bucket: "product-media" | "product-files") {
    const path = `${Date.now()}-${slugify(file.name.replace(/\.[^.]+$/, ""))}.${file.name.split(".").pop()}`;
    const { error } = await supabase.storage.from(bucket).upload(path, file);
    if (error) throw error;
    return path;
  }
  async function save(e: React.FormEvent) {
    e.preventDefault(); if (!edit) return; setBusy(true); setMsg(null);
    const { id, ...row } = edit;
    const payload = { ...row, slug: row.slug || slugify(row.name), published_at: row.status === "published" ? new Date().toISOString() : null };
    const { error } = id ? await supabase.from("products").update(payload).eq("id", id) : await supabase.from("products").insert(payload);
    setBusy(false);
    if (error) return setMsg(error.message);
    setEdit(null); load();
  }
  async function onFile(e: React.ChangeEvent<HTMLInputElement>, kind: "image" | "file") {
    const f = e.target.files?.[0]; if (!f || !edit) return; setBusy(true);
    try { const path = await upload(f, kind === "image" ? "product-media" : "product-files"); setEdit({ ...edit, [kind === "image" ? "image_url" : "file_path"]: path }); }
    catch (err) { setMsg(err instanceof Error ? err.message : "Falha no envio"); }
    setBusy(false);
  }
  if (edit) return <form onSubmit={save} className="grid gap-3 rounded-2xl bg-white p-6 md:grid-cols-2">
    <label className="text-xs font-bold">Nome<input required className={inp} value={edit.name} onChange={(e) => setEdit({ ...edit, name: e.target.value })}/></label>
    <label className="text-xs font-bold">Endereço (slug)<input className={inp} value={edit.slug} placeholder={slugify(edit.name)} onChange={(e) => setEdit({ ...edit, slug: slugify(e.target.value) })}/></label>
    <label className="text-xs font-bold">Preço (R$)<input type="number" step="0.01" min="0" required className={inp} value={edit.price} onChange={(e) => setEdit({ ...edit, price: Number(e.target.value) })}/></label>
    <label className="text-xs font-bold">Preço promocional<input type="number" step="0.01" min="0" className={inp} value={edit.promo_price ?? ""} onChange={(e) => setEdit({ ...edit, promo_price: e.target.value === "" ? null : Number(e.target.value) })}/></label>
    <label className="text-xs font-bold">Categoria<select className={inp} value={edit.category_id ?? ""} onChange={(e) => setEdit({ ...edit, category_id: e.target.value || null })}><option value="">—</option>{cats.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></label>
    <label className="text-xs font-bold">Status<select className={inp} value={edit.status} onChange={(e) => setEdit({ ...edit, status: e.target.value as Product["status"] })}><option value="draft">Rascunho</option><option value="published">Publicado</option><option value="inactive">Inativo</option></select></label>
    <label className="text-xs font-bold md:col-span-2">Resumo<input className={inp} value={edit.short_description} onChange={(e) => setEdit({ ...edit, short_description: e.target.value })}/></label>
    <label className="text-xs font-bold md:col-span-2">Descrição<textarea rows={4} className={inp} value={edit.description} onChange={(e) => setEdit({ ...edit, description: e.target.value })}/></label>
    <label className="text-xs font-bold md:col-span-2">O que vem no arquivo (um item por linha)<textarea rows={4} className={inp} value={edit.details.join("\n")} onChange={(e) => setEdit({ ...edit, details: e.target.value.split("\n") })}/></label>
    <label className="text-xs font-bold">Formato<select className={inp} value={edit.format} onChange={(e) => setEdit({ ...edit, format: e.target.value })}>{["PDF", "ZIP", "PNG", "Digital"].map((f) => <option key={f}>{f}</option>)}</select></label>
    <label className="text-xs font-bold">Ordem de exibição<input type="number" className={inp} value={edit.sort_order} onChange={(e) => setEdit({ ...edit, sort_order: Number(e.target.value) })}/></label>
    <label className="text-xs font-bold">Capa {edit.image_url && <span className="font-normal text-green-700">✓ enviada</span>}<input type="file" accept="image/*" className={inp} onChange={(e) => onFile(e, "image")}/></label>
    <label className="text-xs font-bold">Arquivo PDF/ZIP {edit.file_path && <span className="font-normal text-green-700">✓ enviado</span>}<input type="file" accept=".pdf,.zip" className={inp} onChange={(e) => onFile(e, "file")}/></label>
    <div className="flex flex-wrap gap-4 text-xs md:col-span-2">{(["is_featured", "is_new", "is_adult"] as const).map((k) => <label key={k} className="flex items-center gap-2"><input type="checkbox" checked={edit[k]} onChange={(e) => setEdit({ ...edit, [k]: e.target.checked })}/>{{ is_featured: "Destaque", is_new: "Novidade", is_adult: "+18" }[k]}</label>)}</div>
    {msg && <p className="text-xs text-red-600 md:col-span-2">{msg}</p>}
    <div className="flex gap-2 md:col-span-2"><button disabled={busy} className={btn}>{busy ? "Salvando…" : "Salvar"}</button><button type="button" onClick={() => setEdit(null)} className="text-xs underline">Cancelar</button></div>
  </form>;
  return <section className="rounded-2xl bg-white p-6"><div className="mb-4 flex justify-between"><h2 className="font-black">Produtos</h2><button className={btn} onClick={() => setEdit({ ...emptyProduct })}>Novo produto</button></div>
    <table className="w-full text-sm"><tbody>{list.map((p) => <tr key={p.id} className="border-t"><td className="py-2">{p.name}</td><td>{money(p.price)}</td><td className="text-xs">{p.status === "published" ? "Publicado" : p.status === "draft" ? "Rascunho" : "Inativo"}</td><td className="text-xs">{p.file_path ? "Arquivo ✓" : "Sem arquivo"}</td><td className="text-right"><button className="text-xs font-bold text-[#c72570]" onClick={() => setEdit({ ...emptyProduct, ...p, id: p.id, price: Number(p.price), promo_price: p.promo_price == null ? null : Number(p.promo_price) })}>Editar</button></td></tr>)}</tbody></table></section>;
}

function Categories() {
  const [list, setList] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const load = () => { supabase.from("categories").select("*").order("sort_order").then(({ data }) => setList(data ?? [])); };
  useEffect(load, []);
  async function add(e: React.FormEvent) { e.preventDefault(); await supabase.from("categories").insert({ name, slug: slugify(name), sort_order: list.length + 1 }); setName(""); load(); }
  async function upd(id: string, patch: Partial<Category>) { await supabase.from("categories").update(patch).eq("id", id); load(); }
  return <section className="rounded-2xl bg-white p-6"><form onSubmit={add} className="mb-4 flex gap-2"><input required className={inp} placeholder="Nova categoria" value={name} onChange={(e) => setName(e.target.value)}/><button className={btn}>Adicionar</button></form>
    <table className="w-full text-sm"><tbody>{list.map((c) => <tr key={c.id} className="border-t"><td className="py-2"><input className={inp} defaultValue={c.name} onBlur={(e) => e.target.value !== c.name && upd(c.id, { name: e.target.value })}/></td><td className="w-24"><input type="number" className={inp} defaultValue={c.sort_order} onBlur={(e) => upd(c.id, { sort_order: Number(e.target.value) })}/></td><td className="pl-3 text-xs"><label className="flex items-center gap-1"><input type="checkbox" checked={c.is_active} onChange={(e) => upd(c.id, { is_active: e.target.checked })}/>Ativa</label></td></tr>)}</tbody></table></section>;
}

function Orders() {
  const [list, setList] = useState<Order[]>([]);
  const [status, setStatus] = useState("all");
  useEffect(() => { supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(200).then(({ data }) => setList(data ?? [])); }, []);
  const shown = useMemo(() => status === "all" ? list : list.filter((o) => o.status === status), [list, status]);
  return <section className="rounded-2xl bg-white p-6"><div className="mb-4 flex items-center justify-between"><h2 className="font-black">Pedidos</h2><select className="rounded-lg border px-2 py-1 text-xs" value={status} onChange={(e) => setStatus(e.target.value)}><option value="all">Todos</option>{Object.entries(statusLabel).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></div>
    {shown.length === 0 ? <p className="text-sm text-slate-500">Nenhum pedido ainda.</p> : <table className="w-full text-sm"><tbody>{shown.map((o) => <tr key={o.id} className="border-t"><td className="py-2">{new Date(o.created_at).toLocaleString("pt-BR")}</td><td>{o.email}</td><td>{statusLabel[o.status]}</td><td className="text-right font-bold">{money(o.total)}</td></tr>)}</tbody></table>}</section>;
}

function Coupons() {
  const [list, setList] = useState<Coupon[]>([]);
  const [form, setForm] = useState({ code: "", discount_type: "percent" as Coupon["discount_type"], discount_value: 10, minimum_order: 0, ends_at: "", max_redemptions: "" });
  const load = () => { supabase.from("coupons").select("*").order("created_at", { ascending: false }).then(({ data }) => setList(data ?? [])); };
  useEffect(load, []);
  async function add(e: React.FormEvent) {
    e.preventDefault();
    await supabase.from("coupons").insert({ code: form.code.toUpperCase().trim(), discount_type: form.discount_type, discount_value: form.discount_value, minimum_order: form.minimum_order, ends_at: form.ends_at ? new Date(form.ends_at).toISOString() : null, max_redemptions: form.max_redemptions ? Number(form.max_redemptions) : null });
    setForm({ ...form, code: "" }); load();
  }
  return <section className="rounded-2xl bg-white p-6"><form onSubmit={add} className="mb-5 grid gap-2 md:grid-cols-6">
    <input required className={inp} placeholder="CÓDIGO" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })}/>
    <select className={inp} value={form.discount_type} onChange={(e) => setForm({ ...form, discount_type: e.target.value as Coupon["discount_type"] })}><option value="percent">%</option><option value="fixed">R$</option></select>
    <input type="number" min="0" className={inp} title="Valor" value={form.discount_value} onChange={(e) => setForm({ ...form, discount_value: Number(e.target.value) })}/>
    <input type="number" min="0" className={inp} title="Compra mínima" placeholder="Mínimo" value={form.minimum_order} onChange={(e) => setForm({ ...form, minimum_order: Number(e.target.value) })}/>
    <input type="date" className={inp} value={form.ends_at} onChange={(e) => setForm({ ...form, ends_at: e.target.value })}/>
    <button className={btn}>Criar cupom</button></form>
    <table className="w-full text-sm"><tbody>{list.map((c) => <tr key={c.id} className="border-t"><td className="py-2 font-mono font-bold">{c.code}</td><td>{c.discount_type === "percent" ? `${c.discount_value}%` : money(c.discount_value)}</td><td className="text-xs">{c.redemption_count} usos</td><td className="text-xs"><label className="flex items-center gap-1"><input type="checkbox" checked={c.is_active} onChange={async (e) => { await supabase.from("coupons").update({ is_active: e.target.checked }).eq("id", c.id); load(); }}/>Ativo</label></td></tr>)}</tbody></table></section>;
}
