import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

// Returns a short-lived download link only for paid orders owned by the caller.
export const getDownloadUrl = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { orderId: string; productId: string }) => {
    if (!/^[0-9a-f-]{36}$/i.test(input.orderId) || !/^[0-9a-f-]{36}$/i.test(input.productId)) throw new Error("Pedido inválido");
    return input;
  })
  .handler(async ({ data, context }) => {
    const { data: order } = await context.supabase.from("orders").select("id,status,user_id,email").eq("id", data.orderId).maybeSingle();
    if (!order || order.status !== "paid" || (order.user_id !== context.userId && order.email.toLowerCase() !== String(context.claims.email ?? "").toLowerCase())) throw new Error("Download indisponível para este pedido.");
    const { data: item } = await context.supabase.from("order_items").select("product_id").eq("order_id", order.id).eq("product_id", data.productId).maybeSingle();
    if (!item) throw new Error("Produto não pertence ao pedido.");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: product } = await supabaseAdmin.from("products").select("file_path").eq("id", data.productId).maybeSingle();
    if (!product?.file_path) throw new Error("Arquivo ainda não disponível.");
    const { data: signed, error } = await supabaseAdmin.storage.from("product-files").createSignedUrl(product.file_path, 300, { download: true });
    if (error || !signed) throw new Error("Não foi possível gerar o link.");
    await supabaseAdmin.from("downloads").insert({ order_id: order.id, product_id: data.productId, user_id: context.userId, email: order.email });
    return { url: signed.signedUrl };
  });
