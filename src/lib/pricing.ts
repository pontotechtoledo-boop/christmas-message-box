// Pure pricing rules shared by server checkout and tests. Never trust client prices.
export type PricedProduct = { id: string; name: string; price: number; promoPrice: number | null; categoryId: string | null };
export type CartLine = { productId: string; quantity: number };
export type Coupon = {
  id: string; code: string; discountType: "percent" | "fixed"; discountValue: number; minimumOrder: number;
  startsAt: string | null; endsAt: string | null; maxRedemptions: number | null; redemptionCount: number;
  productIds: string[]; categoryIds: string[]; isActive: boolean;
};
export type Tier = { id: string; minSubtotal: number; discountType: "percent" | "fixed"; discountValue: number; label: string };
export type Combo = { id: string; name: string; productIds: string[]; comboPrice: number };
export type Discount = { kind: "combo" | "tier" | "coupon"; id: string; label: string; amount: number };

const round = (n: number) => Math.round(n * 100) / 100;

export function unitPrice(p: PricedProduct) {
  return p.promoPrice != null && p.promoPrice < p.price ? p.promoPrice : p.price;
}

export function couponProblem(c: Coupon, now: Date, eligibleSubtotal: number): string | null {
  if (!c.isActive) return "Cupom inativo.";
  if (c.startsAt && new Date(c.startsAt) > now) return "Cupom ainda não está válido.";
  if (c.endsAt && new Date(c.endsAt) <= now) return "Cupom expirado.";
  if (c.maxRedemptions != null && c.redemptionCount >= c.maxRedemptions) return "Cupom esgotado.";
  if (eligibleSubtotal <= 0) return "Cupom não vale para os produtos do carrinho.";
  if (eligibleSubtotal < c.minimumOrder) return `Compra mínima de R$ ${c.minimumOrder.toFixed(2).replace(".", ",")} para este cupom.`;
  return null;
}

function amountOf(type: "percent" | "fixed", value: number, base: number) {
  return round(Math.min(base, type === "percent" ? (base * value) / 100 : value));
}

export function calculateTotals(args: {
  lines: CartLine[]; products: PricedProduct[]; coupon?: Coupon | null; tiers?: Tier[]; combos?: Combo[]; now?: Date;
}) {
  const now = args.now ?? new Date();
  const byId = new Map(args.products.map((p) => [p.id, p]));
  const lines = args.lines
    .filter((l) => byId.has(l.productId) && Number.isInteger(l.quantity) && l.quantity > 0)
    .map((l) => ({ product: byId.get(l.productId)!, quantity: Math.min(l.quantity, 20) }));
  const subtotal = round(lines.reduce((s, l) => s + unitPrice(l.product) * l.quantity, 0));
  const discounts: Discount[] = [];

  // combos: applied once per full set present
  for (const combo of args.combos ?? []) {
    if (combo.productIds.length < 2) continue;
    const sets = Math.min(...combo.productIds.map((id) => lines.find((l) => l.product.id === id)?.quantity ?? 0));
    if (sets <= 0) continue;
    const regular = combo.productIds.reduce((s, id) => s + unitPrice(byId.get(id)!), 0);
    const saving = round((regular - combo.comboPrice) * sets);
    if (saving > 0) discounts.push({ kind: "combo", id: combo.id, label: `Combo ${combo.name}`, amount: saving });
  }
  let running = round(subtotal - discounts.reduce((s, d) => s + d.amount, 0));

  // coupon takes priority over progressive tiers (no stacking)
  let couponError: string | null = null;
  if (args.coupon) {
    const c = args.coupon;
    const eligible = round(lines.filter((l) =>
      (c.productIds.length === 0 && c.categoryIds.length === 0) ||
      c.productIds.includes(l.product.id) || (l.product.categoryId != null && c.categoryIds.includes(l.product.categoryId))
    ).reduce((s, l) => s + unitPrice(l.product) * l.quantity, 0));
    couponError = couponProblem(c, now, eligible);
    if (!couponError) {
      const amt = amountOf(c.discountType, c.discountValue, Math.min(eligible, running));
      discounts.push({ kind: "coupon", id: c.id, label: `Cupom ${c.code}`, amount: amt });
      running = round(running - amt);
    }
  }
  const couponApplied = discounts.some((d) => d.kind === "coupon");
  const sortedTiers = [...(args.tiers ?? [])].sort((a, b) => a.minSubtotal - b.minSubtotal);
  const reached = sortedTiers.filter((t) => subtotal >= t.minSubtotal).at(-1) ?? null;
  const nextTier = sortedTiers.find((t) => subtotal < t.minSubtotal) ?? null;
  if (!couponApplied && reached) {
    const amt = amountOf(reached.discountType, reached.discountValue, running);
    discounts.push({ kind: "tier", id: reached.id, label: reached.label || "Desconto progressivo", amount: amt });
    running = round(running - amt);
  }
  const discountTotal = round(discounts.reduce((s, d) => s + d.amount, 0));
  return {
    lines: lines.map((l) => ({ productId: l.product.id, name: l.product.name, unitPrice: unitPrice(l.product), quantity: l.quantity })),
    subtotal, discounts, discountTotal, total: round(Math.max(0, subtotal - discountTotal)),
    couponError, reachedTier: reached, nextTier, missingForNextTier: nextTier ? round(nextTier.minSubtotal - subtotal) : 0,
  };
}

// +18 products are never shown on kids/educational contexts
export function filterSafeRecommendations<T extends { isAdult: boolean }>(context: { isKids: boolean }, items: T[]) {
  return context.isKids ? items.filter((i) => !i.isAdult) : items;
}
