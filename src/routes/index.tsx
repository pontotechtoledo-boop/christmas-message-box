import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import produto from "@/assets/produto.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Caixa de Mensagens de Natal — Ateliê Educar" },
      { name: "description", content: "Material digital para imprimir: caixa com 54 cartões de mensagens natalinas." },
      { property: "og:title", content: "Caixa de Mensagens de Natal — Ateliê Educar" },
      { property: "og:description", content: "Imprima, monte e presenteie com 54 mensagens de fé e carinho." },
      { property: "og:type", content: "product" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const categorias = ["Alfabetização", "Datas comemorativas", "Natal", "Apostilas", "Avaliações", "Calendários", "Lembrancinhas"];
const relacionados = ["Kit Lembrancinha de Natal", "Cartões de Ano Novo", "Calendário 2027", "Apostila de Férias"];

function Index() {
  const [qtd, setQtd] = useState(1);
  const [img, setImg] = useState(0);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="bg-primary py-2 text-center text-xs text-primary-foreground">
        Material 100% digital • Receba por e-mail após o pagamento
      </div>
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <span className="font-display text-2xl text-primary">Ateliê Educar</span>
          <nav className="hidden gap-6 text-sm md:flex">
            <a href="#">Início</a><a href="#">Loja</a><a href="#">Categorias</a><a href="#">Contato</a>
          </nav>
          <span className="rounded-full bg-secondary px-3 py-1 text-sm">🛒 0</span>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-10 px-4 py-8 md:grid-cols-2">
        <section>
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
            <img src={produto} alt="Caixa de mensagens de Natal" width={1024} height={1024}
              className={`w-full transition ${img % 2 ? "scale-110" : ""}`} />
          </div>
          <div className="mt-3 grid grid-cols-5 gap-2">
            {[0, 1, 2, 3, 4].map((i) => (
              <button key={i} onClick={() => setImg(i)}
                className={`overflow-hidden rounded-lg border-2 ${img === i ? "border-primary" : "border-transparent"}`}>
                <img src={produto} alt="" loading="lazy" width={1024} height={1024} />
              </button>
            ))}
          </div>
        </section>

        <section>
          <p className="text-xs uppercase tracking-widest text-accent-foreground">Natal • Lembrancinhas</p>
          <h1 className="mt-2 font-display text-4xl leading-tight">Caixa de Mensagens de Natal Cristão</h1>
          <p className="mt-4 font-display text-3xl text-primary">R$ 10,00</p>

          <div className="mt-6 flex items-center gap-3">
            <div className="flex items-center rounded-full border border-border">
              <button className="px-4 py-2" onClick={() => setQtd(Math.max(1, qtd - 1))}>−</button>
              <span className="w-6 text-center">{qtd}</span>
              <button className="px-4 py-2" onClick={() => setQtd(qtd + 1)}>+</button>
            </div>
            <button className="flex-1 rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground shadow-card transition hover:opacity-90">
              Adicionar ao carrinho
            </button>
          </div>

          <div className="mt-8 space-y-4 text-sm leading-relaxed text-muted-foreground">
            <p>Leve esperança e carinho neste fim de ano com uma caixinha cheia de mensagens inspiradoras para distribuir na escola, no trabalho ou em família.</p>
            <div className="rounded-xl bg-secondary p-4 text-secondary-foreground">
              <p className="font-semibold">📦 O que vem no arquivo</p>
              <ul className="mt-2 space-y-1">
                <li>✔ Molde da caixa (18×18 cm) em PDF</li>
                <li>✔ 54 cartões com mensagens diferentes (9 por folha)</li>
                <li>✔ Dica: acompanhe cada cartão com um docinho</li>
              </ul>
            </div>
            <p className="font-semibold text-foreground">Arquivo não editável.</p>
          </div>

          <details className="mt-6 rounded-xl border border-border p-4 text-sm" open>
            <summary className="cursor-pointer font-semibold">Como recebo meu material?</summary>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-muted-foreground">
              <li>O link de download chega no seu e-mail após a confirmação do pagamento.</li>
              <li>Download disponível por 365 dias — salve no seu dispositivo.</li>
              <li>Por ser digital, não há trocas ou reembolsos.</li>
              <li>Pagamento por Pix ou cartão.</li>
            </ul>
          </details>
        </section>
      </main>

      <section className="mx-auto max-w-6xl px-4 pb-10">
        <h2 className="font-display text-2xl">Você também pode gostar</h2>
        <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
          {relacionados.map((r) => (
            <div key={r} className="rounded-xl border border-border bg-card p-3">
              <img src={produto} alt={r} loading="lazy" width={1024} height={1024} className="rounded-lg" />
              <p className="mt-2 text-sm font-medium">{r}</p>
              <p className="text-sm text-primary">R$ 10,00</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="bg-primary text-primary-foreground">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <h3 className="font-display text-xl">Categorias</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {categorias.map((c) => (
              <span key={c} className="rounded-full border border-primary-foreground/30 px-3 py-1 text-xs">{c}</span>
            ))}
          </div>
          <p className="mt-6 text-xs opacity-70">© 2026 Ateliê Educar — materiais pedagógicos digitais</p>
        </div>
      </footer>
    </div>
  );
}
