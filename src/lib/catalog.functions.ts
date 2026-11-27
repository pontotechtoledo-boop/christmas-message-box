import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import type { StoreProduct } from "@/data/products";

function publicClient() {
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  return createClient<Database>(process.env["SUPABASE_URL"]!, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { fetch: (input, init) => {
      const h = new Headers(init?.headers);
      if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) h.delete("Authorization");
      h.set("apikey", key);
      return fetch(input, { ...init, headers: h });
    } },
  });
}

export type CatalogCategory = { id: string; name: string; slug: string; isKids: boolean; isAdult: boolean };
export type Catalog = { categories: CatalogCategory[]; products: StoreProduct[] };

export const getCatalog = createServerFn({ method: "GET" }).handler(async (): Promise<Catalog> => {
  const sb = publicClient();
  const [cats, prods] = await Promise.all([
    sb.from("categories").select("id,name,slug,is_kids,is_adult").eq("is_active", true).order("sort_order"),
    sb.from("products").select("*").eq("status", "published").order("sort_order"),
  ]);
  if (cats.error) throw new Error(cats.error.message);
  if (prods.error) throw new Error(prods.error.message);
  const catById = new Map(cats.data.map((c) => [c.id, c]));
  const publicBase = `${process.env["VITE_SUPABASE_URL"] || process.env["SUPABASE_URL"]}/storage/v1/object/public/product-media/`;
  const img = (v: string | null) => !v ? undefined : v.startsWith("http") ? v : publicBase + v;
  return {
    categories: cats.data.map((c) => ({ id: c.id, name: c.name, slug: c.slug, isKids: c.is_kids, isAdult: c.is_adult })),
    products: prods.data.map((p) => {
      const cat = p.category_id ? catById.get(p.category_id) : undefined;
      return {
        id: p.id, slug: p.slug, name: p.name, category: cat?.name ?? "", categorySlug: cat?.slug ?? "",
        price: Number(p.promo_price != null && p.promo_price < p.price ? p.promo_price : p.price),
        originalPrice: p.promo_price != null && p.promo_price < p.price ? Number(p.price) : undefined,
        description: p.description, shortDescription: p.short_description,
        format: (["PDF", "PNG", "ZIP"].includes(p.format) ? p.format : "Digital") as StoreProduct["format"],
        status: "published", featured: p.is_featured, isNew: p.is_new, isAdult: p.is_adult || Boolean(cat?.is_adult),
        image: img(p.image_url), gallery: p.gallery.map((g) => img(g)!).filter(Boolean),
        publishedAt: p.published_at ?? undefined, details: p.details,
      } satisfies StoreProduct;
    }),
  };
});
