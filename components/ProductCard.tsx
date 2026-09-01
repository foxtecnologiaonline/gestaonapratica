import type { Product } from "@/lib/products";

export function ProductCard({ product }: { product: Product }) {
  return (
    <div className="flex flex-col rounded-lg border border-neutral-200 bg-white p-6">
      {product.badge && (
        <span className="mb-3 inline-block w-fit rounded-full bg-brand px-3 py-1 text-xs font-semibold text-white">
          {product.badge}
        </span>
      )}
      <h3 className="text-lg font-bold text-brand-dark">{product.title}</h3>
      <p className="mt-2 flex-1 text-sm text-neutral-600">
        {product.description}
      </p>
      <div className="mt-4 flex items-center justify-between">
        <span className="text-xl font-bold text-brand-dark">
          {product.price}
        </span>
        <a
          href={product.hotmartUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-light"
        >
          Comprar
        </a>
      </div>
    </div>
  );
}
