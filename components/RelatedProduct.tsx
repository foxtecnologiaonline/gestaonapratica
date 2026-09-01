import { ProductCard } from "@/components/ProductCard";
import { getProductBySlug } from "@/lib/products";

export function RelatedProduct({ slug }: { slug: string }) {
  const product = getProductBySlug(slug);
  if (!product) return null;

  return (
    <div className="mt-12 border-t border-neutral-200 pt-8">
      <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-neutral-500">
        Quer ir além deste post?
      </p>
      <ProductCard product={product} />
    </div>
  );
}
