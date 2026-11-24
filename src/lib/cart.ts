export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  price: number;
  format: string;
  image?: string;
  quantity: number;
};

const CART_KEY = "sua-loja-cart";

export function readCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const parsed = JSON.parse(window.localStorage.getItem(CART_KEY) || "[]");
    return Array.isArray(parsed) ? parsed.filter((item) =>
      item && typeof item.productId === "string" && typeof item.slug === "string" &&
      typeof item.name === "string" && Number.isFinite(item.price) &&
      Number.isInteger(item.quantity) && item.quantity > 0
    ) : [];
  } catch {
    return [];
  }
}

function writeCart(items: CartItem[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CART_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event("store-cart-updated"));
}

export function addToCart(product: Omit<CartItem, "quantity">, quantity = 1) {
  const cart = readCart();
  const existing = cart.find((item) => item.productId === product.productId);
  if (existing) existing.quantity += quantity;
  else cart.push({ ...product, quantity });
  writeCart(cart);
  return cart;
}

export function updateCartQuantity(productId: string, quantity: number) {
  const cart = readCart()
    .map((item) => item.productId === productId ? { ...item, quantity } : item)
    .filter((item) => item.quantity > 0);
  writeCart(cart);
  return cart;
}

export function removeFromCart(productId: string) {
  const cart = readCart().filter((item) => item.productId !== productId);
  writeCart(cart);
  return cart;
}

export function clearCart() {
  writeCart([]);
}

export function getCartCount(items: CartItem[]) {
  return items.reduce((total, item) => total + item.quantity, 0);
}

export function getCartSubtotal(items: CartItem[]) {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
}
