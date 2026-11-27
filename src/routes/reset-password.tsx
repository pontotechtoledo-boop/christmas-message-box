import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { storeName } from "@/data/products";

export const Route = createFileRoute("/reset-password")({
  head: () => ({ meta: [
    { title: `Nova senha | ${storeName}` },
    { name: "description", content: "Defina uma nova senha para sua conta." },
    { property: "og:title", content: `Nova senha | ${storeName}` },
    { property: "og:description", content: "Redefina sua senha." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ]}),
  component: ResetPage,
});

function ResetPage() {
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const navigate = useNavigate();
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const { error } = await supabase.auth.updateUser({ password });
    if (error) return setMsg(error.message);
    navigate({ to: "/minha-conta" });
  }
  return <main className="flex min-h-screen items-center justify-center bg-[#fffaf0] px-4">
    <form onSubmit={submit} className="w-full max-w-md space-y-4 rounded-3xl bg-white p-8 shadow-sm">
      <h1 className="text-2xl font-black text-[#34213a]">Defina sua nova senha</h1>
      <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Nova senha" className="w-full rounded-xl border border-[#eadfd6] px-4 py-3 text-sm"/>
      <button className="w-full rounded-full bg-[#d92f78] py-3.5 text-xs font-black uppercase text-white">Salvar senha</button>
      {msg && <p className="text-xs text-red-600">{msg}</p>}
    </form>
  </main>;
}
