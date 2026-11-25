import { describe, expect, it } from "vitest";
import { calculateTotals, filterSafeRecommendations, type Coupon } from "@/lib/pricing";

const A = { id: "a", name: "A", price: 10, promoPrice: null, categoryId: "c1" };
const B = { id: "b", name: "B", price: 15, promoPrice: null, categoryId: "c2" };
const coupon = (o: Partial<Coupon> = {}): Coupon => ({ id: "k", code: "NATAL10", discountType: "percent", discountValue: 10, minimumOrder: 0, startsAt: null, endsAt: null, maxRedemptions: null, redemptionCount: 0, productIds: [], categoryIds: [], isActive: true, ...o });

describe("pricing rules", () => {
  it("combo A R$10 + B R$15 for R$20 charges R$20", () => {
    const r = calculateTotals({ lines: [{ productId: "a", quantity: 1 }, { productId: "b", quantity: 1 }], products: [A, B], combos: [{ id: "x", name: "AB", productIds: ["a", "b"], comboPrice: 20 }] });
    expect(r.total).toBe(20);
  });
  it("ignores unknown products sent by the browser", () => {
    const r = calculateTotals({ lines: [{ productId: "fake", quantity: 1 }, { productId: "a", quantity: 1 }], products: [A] });
    expect(r.total).toBe(10);
  });
  it("rejects expired coupon", () => {
    const r = calculateTotals({ lines: [{ productId: "a", quantity: 1 }], products: [A], coupon: coupon({ endsAt: "2020-01-01T00:00:00Z" }) });
    expect(r.couponError).toBe("Cupom expirado.");
    expect(r.total).toBe(10);
  });
  it("rejects coupon that reached its usage limit", () => {
    const r = calculateTotals({ lines: [{ productId: "a", quantity: 1 }], products: [A], coupon: coupon({ maxRedemptions: 5, redemptionCount: 5 }) });
    expect(r.couponError).toBe("Cupom esgotado.");
  });
  it("applies 10% coupon", () => {
    const r = calculateTotals({ lines: [{ productId: "b", quantity: 2 }], products: [B], coupon: coupon() });
    expect(r.total).toBe(27);
  });
  it("progressive tier from R$20 applies and shows what is missing for the next", () => {
    const tiers = [{ id: "t1", minSubtotal: 20, discountType: "fixed" as const, discountValue: 2, label: "" }, { id: "t2", minSubtotal: 35, discountType: "fixed" as const, discountValue: 5, label: "" }];
    const r = calculateTotals({ lines: [{ productId: "b", quantity: 2 }], products: [B], tiers });
    expect(r.total).toBe(28);
    expect(r.missingForNextTier).toBe(5);
  });
  it("coupon and progressive tier do not stack", () => {
    const tiers = [{ id: "t1", minSubtotal: 20, discountType: "fixed" as const, discountValue: 2, label: "" }];
    const r = calculateTotals({ lines: [{ productId: "b", quantity: 2 }], products: [B], tiers, coupon: coupon() });
    expect(r.discounts.map((d) => d.kind)).toEqual(["coupon"]);
  });
  it("never recommends +18 products in kids context", () => {
    expect(filterSafeRecommendations({ isKids: true }, [{ isAdult: true }, { isAdult: false }])).toHaveLength(1);
  });
});
