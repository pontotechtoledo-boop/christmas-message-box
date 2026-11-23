export type StoreProduct = {
  id: string;
  slug: string;
  name: string;
  category: string;
  price: number;
  description: string;
  format: "PDF" | "PNG" | "ZIP" | "Digital";
  status: "published" | "draft";
};

export const featuredProduct: StoreProduct & { storeName: string } = {
  id: "caixa-mensagens-natal-cristao",
  slug: "caixa-mensagens-natal-cristao",
  storeName: "Sua Loja",
  name: "Caixa de Mensagens Natal Cristão",
  category: "Natal",
  price: 10,
  description: "Celebre o verdadeiro sentido do Natal com uma caixa especial de mensagens cristãs. Um material digital pensado para compartilhar fé, esperança e carinho em momentos especiais.",
  format: "PDF",
  status: "published",
};
