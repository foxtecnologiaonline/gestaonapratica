import type { Metadata } from "next";
import { ProductCard } from "@/components/ProductCard";
import { products } from "@/lib/products";

export const metadata: Metadata = {
  title: "Produtos",
  description:
    "Ferramentas e materiais digitais criados a partir dos temas mais pedidos do blog.",
};

export default function ProdutosPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <h1 className="mb-2 text-3xl font-bold text-brand-dark">
        Produtos digitais
      </h1>
      <p className="mb-8 max-w-2xl text-neutral-600">
        Planilhas, guias e templates criados a partir dos assuntos mais
        pedidos aqui no blog. Compra e entrega processadas pela Hotmart.
      </p>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
    </div>
  );
}
