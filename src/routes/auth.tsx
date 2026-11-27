import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { storeName } from "@/data/products";
import { StoreFooter, StoreHeader } from "@/components/store-layout";

export const Route = createFileRoute("/auth")({
  validateSearch: (s: Record<string, unknown>) => ({ redirect: typeof s["redirect"] === "string" && s["redirect"].startsWith("/") ? s["redirect"] : undefined }),
  head: () => ({ meta: [
    { title: `Entrar | ${storeName}` },
    { name: "description", content: "Entre ou crie sua conta para acessar pedidos e downloads." },
    { property: "og:title", content: `Entrar | ${storeName}` },
    { property: "og:description", content: "Acesse sua conta na loja." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ]}),
  component: AuthPage,
});

function AuthPage() {
  const { redirect } = Route.useSearch();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"in" | "up" | "forgot">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setMsg(null);
    try {
      if (mode === "in") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate({ to: redirect || "/minha-conta" });
      } else if (mode === "up") {
        const { error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: window.location.origin + "/minha-conta", data: { full_name: name } } });
        if (error) throw error;
        setMsg("Conta criada! Confira seu e-mail para confirmar o cadastro.");
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin + "/reset-password" });
        if (error) throw error;
        setMsg("Enviamos um link para redefinir sua senha.");
      }
    } catch (err) { setMsg(err instanceof Error ? err.message : "Algo deu errado."); }
    setBusy(false);
  }
  const input = "w-full rounded-xl border border-[#eadfd6] bg-white px-4 py-3 text-sm outline-none focus:border-[#d92f78]";
  return <><StoreHeader/><main className="min-h-[70vh] bg-[#fffaf0] px-4 py-14 text-[#34213a]">
    <form onSubmit={submit} className="mx-auto max-w-md space-y-4 rounded-3xl bg-white p-8 shadow-sm">
      <h1 className="text-2xl font-black">{mode === "in" ? "Entrar" : mode === "up" ? "Criar conta" : "Recuperar senha"}</h1>
      {mode === "up" && <input className={input} placeholder="Seu nome" value={name} onChange={(e) => setName(e.target.value)}/>}
      <input className={input} type="email" required placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)}/>
      {mode !== "forgot" && <input className={input} type="password" required minLength={6} placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)}/>}
      <button disabled={busy} className="w-full rounded-full bg-[#d92f78] py-3.5 text-xs font-black uppercase tracking-wider text-white hover:bg-[#b51d64] disabled:opacity-60">{busy ? "Aguarde..." : mode === "in" ? "Entrar" : mode === "up" ? "Cadastrar" : "Enviar link"}</button>
      {msg && <p className="rounded-xl bg-[#fff0b5] p-3 text-xs">{msg}</p>}
      <div className="flex justify-between text-xs font-bold text-[#c72570]">
        {mode !== "in" ? <button type="button" onClick={() => setMode("in")}>Já tenho conta</button> : <button type="button" onClick={() => setMode("up")}>Criar conta</button>}
        {mode === "in" && <button type="button" onClick={() => setMode("forgot")}>Esqueci a senha</button>}
      </div>
    </form>
  </main><StoreFooter/></>;
}
