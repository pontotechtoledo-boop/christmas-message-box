import { createFileRoute } from "@tanstack/react-router";
import { FileText } from "lucide-react";
import { storeName } from "@/data/products";
import { StoreFooter, StoreHeader } from "@/components/store-layout";

export const Route = createFileRoute("/termos-de-uso")({
  head: () => ({ meta: [
    { title: "Termos de uso | " + storeName },
    { name: "description", content: "Consulte as condições de uso e compra de produtos digitais." },
  ]}),
  component: TermsPage,
});

function TermsPage() {
  return <><StoreHeader/><main className="min-h-screen bg-[#fffaf0] px-4 py-12 text-[#34213a] sm:py-16"><article className="mx-auto max-w-[850px]"><div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#ffe0eb] text-[#b51d64]"><FileText size={23}/></div><p className="mt-6 text-[10px] font-black uppercase tracking-[.2em] text-[#c72570]">Condições da loja</p><h1 className="mt-2 text-4xl font-black tracking-tight sm:text-5xl">Termos de uso</h1><p className="mt-4 text-sm leading-7 text-[#827985]">Ao navegar nesta loja, o usuário concorda com as condições abaixo. Leia as informações antes de realizar uma compra ou utilizar um arquivo digital.</p>
      <div className="mt-10 space-y-8 text-sm leading-7 text-[#625a67]">
        <section><h2 className="text-lg font-black text-[#34213a]">1. Sobre a loja</h2><p className="mt-2">A {storeName} oferece produtos digitais, que podem incluir arquivos para download, materiais imprimíveis, jogos, atividades, caixas, combos e outros conteúdos descritos em cada página de produto.</p></section>
        <section><h2 className="text-lg font-black text-[#251d2d]">2. Informações dos produtos</h2><p className="mt-2">Cada página de produto deve apresentar sua descrição, formato, conteúdo incluído e eventuais requisitos de uso. O cliente é responsável por conferir essas informações, compatibilidade, formato de arquivo e necessidades de impressão antes de comprar. Salvo indicação expressa, produtos digitais não incluem envio de item físico nem serviço de personalização.</p></section>
        <section><h2 className="text-lg font-black text-[#251d2d]">3. Pagamento e confirmação</h2><p className="mt-2">Quando o checkout estiver ativo, os pagamentos serão processados por provedor indicado na etapa de compra, atualmente planejado para Stripe. O pedido será considerado confirmado após a aprovação do pagamento pelo provedor. Preços, condições e disponibilidade são os exibidos no momento da contratação.</p></section>
        <section><h2 className="text-lg font-black text-[#251d2d]">4. Entrega e downloads</h2><p className="mt-2">Por se tratarem de produtos digitais, a entrega ocorrerá por meio eletrônico, como link de download, e-mail ou área do cliente, conforme indicado no produto e no fluxo de compra. O cliente deve informar dados corretos e manter acesso ao e-mail utilizado na compra. Em caso de dificuldade, poderá procurar o suporte.</p></section>
        <section><h2 className="text-lg font-black text-[#251d2d]">5. Licença e propriedade intelectual</h2><p className="mt-2">A compra concede ao cliente uma licença de uso pessoal ou aquela expressamente indicada na página do produto. É proibido revender, redistribuir, compartilhar publicamente, sublicenciar ou disponibilizar os arquivos a terceiros sem autorização do titular dos direitos, respeitadas as exceções legais.</p></section>
        <section><h2 className="text-lg font-black text-[#251d2d]">6. Cancelamentos e direitos do consumidor</h2><p className="mt-2">Solicitações de cancelamento, arrependimento, reembolso ou suporte serão analisadas conforme a legislação brasileira aplicável, inclusive o Código de Defesa do Consumidor, considerando a natureza digital do produto e as circunstâncias da contratação. Nenhuma disposição destes termos pretende afastar direitos obrigatórios do consumidor.</p></section>
        <section><h2 className="text-lg font-black text-[#251d2d]">7. Uso adequado</h2><p className="mt-2">O usuário compromete-se a não utilizar o site para atividades ilícitas, tentativas de fraude, violação de direitos de terceiros, interferência no funcionamento da plataforma ou acesso não autorizado a contas e sistemas.</p></section>
        <section><h2 className="text-lg font-black text-[#251d2d]">8. Atendimento e alterações</h2><p className="mt-2">Dúvidas sobre pedidos, arquivos ou estes termos podem ser encaminhadas pelo <a className="font-bold text-[#c72570] underline" href="https://wa.me/5545988018222" target="_blank" rel="noreferrer">WhatsApp de suporte</a>. Estes termos poderão ser atualizados; a versão vigente será publicada nesta página.</p></section>
      </div><p className="mt-10 border-t border-[#f0dca1] pt-5 text-xs text-[#9a9098]">Importante: esta é uma minuta inicial. Antes de operar vendas, revise o texto com orientação jurídica e complete a identificação legal da empresa, regras definitivas de licença, entrega, suporte e reembolso.</p>
    </article></main><StoreFooter/></>;
}
