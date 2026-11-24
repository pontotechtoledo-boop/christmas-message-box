export type StoreProduct = {
  id: string;
  slug: string;
  name: string;
  category: string;
  price: number;
  description: string;
  shortDescription: string;
  format: "PDF" | "PNG" | "ZIP" | "Digital";
  status: "published" | "draft";
  featured?: boolean;
  image?: string;
  publishedAt?: string;
  popularity?: number;
  isNew?: boolean;
};

export const storeName = "Sua Loja";

export const catalogCategories = [
  "Caixas e combos",
  "Casais e experiências a dois",
  "Jogos e desafios",
  "Presentes criativos",
  "Datas comemorativas",
  "Festas e celebrações",
  "Lembrancinhas",
  "Natal",
  "Educação infantil",
  "Alfabetização",
  "Leitura e escrita",
  "Matemática",
  "Apostilas",
  "Avaliações e sondagens",
  "Calendários",
  "Painéis",
  "Formatura",
  "Kits e combos",
];

export const featuredProduct: StoreProduct = {
  id: "caixa-mensagens-natal-cristao",
  slug: "caixa-mensagens-natal-cristao",
  name: "Caixa de Mensagens Natal Cristão",
  category: "Natal",
  price: 10,
  description:
    "Celebre o verdadeiro sentido do Natal com uma caixa especial de mensagens cristãs. O material inclui o molde da caixa em PDF e 54 cartões com mensagens diferentes, organizados para impressão. Arquivo não editável.",
  shortDescription:
    "Uma lembrança especial para compartilhar fé, esperança e carinho no Natal.",
  format: "PDF",
  status: "published",
  featured: true,
};

export const catalogProducts: StoreProduct[] = [featuredProduct];

export function getPublishedProducts() {
  return catalogProducts.filter((product) => product.status === "published");
}

export function getProductBySlug(slug: string) {
  return getPublishedProducts().find((product) => product.slug === slug);
}

export function getRelatedProducts(product: StoreProduct, limit = 4) {
  return getPublishedProducts()
    .filter((item) => item.id !== product.id && item.category === product.category)
    .sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)))
    .slice(0, limit);
}

export function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
