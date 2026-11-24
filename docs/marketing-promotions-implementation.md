# Lírio Doce — contrato de backend para promoções

Este documento descreve os dados e as regras necessários para ativar as cinco experiências promocionais no storefront. A interface deve permanecer inativa quando não houver uma campanha válida; nunca mostrar um cupom fictício ou um desconto não confirmado pelo servidor.

## 1. Campanha surpresa / cupom

Criar uma entidade de campanhas com:
- `id`, `name`, `headline`, `message`, `discount_type` (`percent` ou `fixed`), `discount_value`, `coupon_code`.
- `starts_at`, `ends_at`, `is_active`, `max_redemptions`, `redemption_count`.
- `minimum_order_amount`, `eligible_category_ids` e/ou `eligible_product_ids`, quando aplicável.

A loja só deve mostrar o botão de presente quando o servidor retornar uma campanha ativa e elegível. A revelação pode exibir o cupom e copiar o código. O código deve ser validado novamente no servidor no checkout.

## 2. Recomendações de produtos

Usar relações administráveis entre produtos:
- Produto de origem.
- Produto recomendado.
- Tipo de relação (`related`, `complementary`, `bundle`).
- Prioridade e status ativo.

As recomendações devem respeitar status publicado, categoria e classificação etária. Produtos +18 nunca devem ser recomendados em páginas ou carrinhos de produtos infantis/educativos. Se não houver recomendações elegíveis, não renderizar a seção.

## 3. Oferta complementar / combo

Permitir que o administrador associe um ou mais produtos complementares a um produto principal e, opcionalmente, defina um preço promocional de combo. O servidor deve validar:
- Ambos os produtos publicados e disponíveis.
- Datas da oferta.
- Limites de uso.
- Valor final calculado no servidor.

No carrinho, mostrar a oferta como opcional e adicionar o item/combinação com um clique. Não alterar o preço de um item diretamente no navegador.

## 4. Desconto progressivo

Configurar metas por campanha, por exemplo:
- Valor mínimo do carrinho.
- Tipo e valor do benefício liberado.
- Período, limite de resgates e categorias/produtos elegíveis.

A barra de progresso deve usar o subtotal elegível retornado/calculado no servidor. O desconto só deve entrar no total após validação no backend. Não aplicar desconto em cascata com cupons se a regra da campanha não permitir.

## 5. Banners e ofertas especiais

Criar campanhas de banner com:
- Texto de apoio, título, descrição, imagem opcional e destino.
- Início/fim, status ativo e prioridade.
- Relação opcional com cupom, produtos, categoria ou combo.

Não usar contadores regressivos sem prazo real definido. Ocultar campanhas expiradas automaticamente.

## Regras obrigatórias de segurança e Stripe

1. Criar e administrar campanhas somente por usuário autenticado com papel `admin`.
2. Aplicar RLS às tabelas de campanhas, cupons, resgates e relações de produtos.
3. O navegador nunca define o preço final: o servidor busca os preços atuais dos produtos e calcula descontos.
4. Validar cupom, campanha, elegibilidade, datas, limites e total no servidor antes de criar a sessão Stripe.
5. Incluir no pedido os IDs de campanha/cupom e os valores de desconto aplicados para auditoria.
6. Confirmar pagamento exclusivamente pelo webhook Stripe, com processamento idempotente.
7. Registrar resgate somente após confirmação do pagamento; impedir dupla utilização concorrente além dos limites.
8. Em reembolso/cancelamento, atualizar o pedido e aplicar a política definida para liberar ou não o resgate.
9. Produtos digitais e arquivos de download continuam protegidos; liberar somente após confirmação do webhook.
10. Não armazenar dados de cartão no banco da loja.

## Contrato sugerido para a interface

Disponibilizar uma consulta pública somente de leitura que retorne:
- Campanha surpresa ativa e elegível.
- Banners ativos.
- Metas de desconto progressivo ativas.
- Recomendações elegíveis para os produtos/carrinho informados.

Disponibilizar ações autenticadas no checkout para validar cupom e calcular o resumo final. A resposta deve incluir subtotal, descontos discriminados, total final, mensagens de elegibilidade e IDs de campanha aplicados.

## Critérios de aceite

- Sem campanha ativa, nenhum botão de presente, cupom ou banner promocional aparece.
- Cupom expirado, esgotado ou inelegível é recusado pelo servidor.
- Alterar preço no DevTools não altera o valor cobrado pelo Stripe.
- Recomendações +18 não aparecem em contextos infantis/educativos.
- Adicionar/remover produtos atualiza a barra de progresso e as ofertas.
- Pedido só é marcado como pago após webhook válido.
- Repetir o webhook não duplica pedido nem resgate.
- Testar sucesso, falha, cancelamento, cupom válido/inválido, expiração e reembolso no ambiente de teste Stripe.
