# Plano: backend, painel e loja funcional — Lírio Doce

O visual atual (cores, cabeçalho, rodapé, páginas, carrinho, versão celular) fica intacto. Só trocamos a origem dos dados e ligamos os botões a funções reais.

## Etapa 1 — Base (Lovable Cloud)
- Ativar o Lovable Cloud (banco de dados, login, arquivos).
- Tabelas: categorias, produtos, imagens, perfis de clientes, papéis (admin/cliente em tabela separada), pedidos, itens, pagamentos, downloads, cupons, resgates, campanhas, combos, recomendações, metas progressivas, banners, configurações, registro de ações do admin.
- Cadastrar as categorias atuais e o produto "Caixa de Mensagens Natal Cristão" como dados iniciais.
- Regras de acesso em todas as tabelas: público só vê itens publicados e ativos; cliente só vê os próprios pedidos; só admin edita.

## Etapa 2 — Contas
- Cadastro, login, recuperar senha, sair, editar dados — dentro da página Minha Conta existente.
- Histórico de compras, produtos comprados e downloads.
- Primeiro admin: sua conta é marcada como admin pelo banco (ninguém vira admin pelo navegador).

## Etapa 3 — Catálogo conectado
- Página inicial, categorias, produtos e página do produto passam a ler do banco.
- Destaques, novidades, ordem de exibição e +18 respeitados; +18 nunca aparece junto de material infantil.

## Etapa 4 — Painel /admin
- Dashboard (faturamento, vendas, pendentes, pagos, clientes, produtos, mais vendidos, promoções) com filtros hoje / 7 / 30 dias / personalizado.
- Produtos: formulário completo, envio de capa, galeria, vídeo e arquivo PDF/ZIP; trocar arquivo sem recriar produto.
- Categorias: criar, editar, ordenar, ativar/desativar.
- Pedidos e pagamentos; relatórios financeiros com filtros.

## Etapa 5 — Arquivos protegidos
- Capas e imagens públicas; PDFs/ZIPs em área privada.
- Download só com link temporário, gerado após pagamento confirmado e só para o dono do pedido.

## Etapa 6 — Pagamento (Stripe)
- Ativar pagamentos integrados da Lovable com Stripe (ambiente de teste primeiro; para receber de verdade, você assume a conta depois).
- Checkout: carrinho → dados → cupom → Stripe. Preço sempre recalculado no servidor.
- Confirmação só pelo aviso oficial do Stripe (webhook), sem duplicar pedidos. Estados: aguardando, pago, falhou, cancelado, reembolsado.
- Compra como visitante associada ao e-mail, com acesso recuperável depois.
- E-mail de confirmação com instruções de acesso.

## Etapa 7 — Marketing
- Cupons (percentual/fixo, mínimo, datas, limites, produtos/categorias).
- Presente surpresa (botão flutuante só quando há campanha válida).
- Recomendações e complementares escolhidos no painel (produto e carrinho).
- Combos com preço especial validado no servidor.
- Desconto progressivo com barra no carrinho.
- Banners com datas e prioridade, sem contadores falsos.

## Etapa 8 — Rastreamento
- Campos no painel para Meta Pixel, GA4 e Google Ads; chave da API de Conversões guardada como segredo.
- Eventos: ver produto, adicionar ao carrinho, iniciar checkout, compra (só após pagamento confirmado).

## Etapa 9 — Testes
- Testes automáticos das regras de preço, cupom, combo, desconto progressivo e bloqueio +18.
- Teste do fluxo real: cadastrar produto, publicar, comprar no modo teste, receber download.

## O que vou precisar de você
- Confirmar o e-mail da conta que será admin.
- Aprovar a ativação do pagamento (formulário com seus dados) na Etapa 6.
- Domínio de e-mail para envio das confirmações (pode ser configurado depois).
- IDs do Meta Pixel / GA4 / Google Ads quando tiver.

## Detalhes técnicos
- TanStack Start + server functions com requireSupabaseAuth; papéis via tabela user_roles + has_role.
- Webhook Stripe em /api/public/stripe-webhook com verificação de assinatura e tabela de eventos processados (idempotência).
- Buckets: product-media (público), product-files (privado, signed URLs curtas).
- Carrinho continua no navegador só com IDs/quantidades; totais vêm do servidor.
- Execução em etapas sequenciais; cada etapa verificada antes da próxima.
