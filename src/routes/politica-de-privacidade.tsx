import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";
import { storeName } from "@/data/products";
import { StoreFooter, StoreHeader } from "@/components/store-layout";

export const Route = createFileRoute("/politica-de-privacidade")({
  head: () => ({ meta: [
    { title: "Política de privacidade | " + storeName },
    { name: "description", content: "Saiba como os dados pessoais são tratados nesta loja." },
  ]}),
  component: PrivacyPage,
});

function PrivacyPage() {
  return <><StoreHeader/><main className="min-h-screen bg-[#fffdfb] px-4 py-12 text-[#251d2d] sm:py-16"><article className="mx-auto max-w-[850px]"><div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fff0ed] text-[#ed5965]"><ShieldCheck size={23}/></div><p className="mt-6 text-[10px] font-black uppercase tracking-[.2em] text-[#ed5965]">Privacidade e proteção de dados</p><h1 className="mt-2 text-4xl font-black tracking-tight sm:text-5xl">Política de privacidade</h1><p className="mt-4 text-sm leading-7 text-[#827985]">Esta política explica, em linguagem simples, como a {storeName} pretende tratar os dados pessoais utilizados durante a navegação, o atendimento e as compras na loja.</p>
      <div className="mt-10 space-y-8 text-sm leading-7 text-[#625a67]">
        <section><h2 className="text-lg font-black text-[#251d2d]">1. Dados que podem ser tratados</h2><p className="mt-2">Podemos tratar dados fornecidos pelo próprio usuário, como nome, e-mail, telefone, informações necessárias ao pedido e mensagens enviadas ao suporte. Dados técnicos de navegação, como endereço IP, tipo de dispositivo e registros de acesso, também poderão ser tratados quando necessários à operação e à segurança do site.</p></section>
        <section><h2 className="text-lg font-black text-[#251d2d]">2. Para que usamos os dados</h2><p className="mt-2">Os dados poderão ser utilizados para processar pedidos, disponibilizar produtos digitais, permitir o acesso à área do cliente, prestar suporte, enviar comunicações relacionadas à compra, prevenir fraudes, cumprir obrigações legais e melhorar a experiência na loja.</p></section>
        <section><h2 className="text-lg font-black text-[#251d2d]">3. Pagamentos</h2><p className="mt-2">Os pagamentos serão processados por provedores especializados, incluindo a Stripe, conforme a configuração do checkout. Os dados de pagamento são tratados de acordo com os avisos e políticas do respectivo provedor. A loja não deve solicitar que o cliente envie número completo de cartão ou código de segurança por WhatsApp ou e-mail.</p></section>
        <section><h2 className="text-lg font-black text-[#251d2d]">4. Compartilhamento</h2><p className="mt-2">Dados poderão ser compartilhados com fornecedores que apoiem hospedagem, autenticação, processamento de pagamentos, entrega de arquivos, comunicação e segurança, limitados ao necessário para prestar esses serviços, além de hipóteses exigidas por lei.</p></section>
        <section><h2 className="text-lg font-black text-[#251d2d]">5. Armazenamento e segurança</h2><p className="mt-2">Adotaremos medidas técnicas e administrativas razoáveis para proteger os dados contra acesso não autorizado, perda, alteração ou divulgação indevida. O período de retenção dependerá da finalidade do tratamento e das obrigações legais aplicáveis.</p></section>
        <section><h2 className="text-lg font-black text-[#251d2d]">6. Direitos do titular</h2><p className="mt-2">Nos termos da legislação aplicável, especialmente a LGPD, o titular poderá solicitar confirmação do tratamento, acesso, correção, anonimização, bloqueio ou eliminação de dados, informações sobre compartilhamento e demais direitos previstos em lei, observadas as hipóteses legais de conservação.</p></section>
        <section><h2 className="text-lg font-black text-[#251d2d]">7. Cookies</h2><p className="mt-2">O site poderá utilizar cookies e tecnologias semelhantes para funcionamento, preferências, segurança e métricas. Quando necessário, as escolhas de consentimento serão apresentadas ao visitante.</p></section>
        <section><h2 className="text-lg font-black text-[#251d2d]">8. Contato e atualizações</h2><p className="mt-2">Para dúvidas ou solicitações relacionadas à privacidade, entre em contato pelo <a className="font-bold text-[#ed5965] underline" href="https://wa.me/5545988018222" target="_blank" rel="noreferrer">WhatsApp de suporte</a>. Esta política poderá ser atualizada para refletir mudanças na loja, nos serviços ou na legislação.</p></section>
      </div><p className="mt-10 border-t border-[#eee7e2] pt-5 text-xs text-[#9a9098]">Importante: este texto é uma base inicial para publicação e deve ser revisado com os dados reais da empresa, fornecedores, prazos de retenção e processos efetivamente utilizados.</p>
    </article></main><StoreFooter/></>;
}
