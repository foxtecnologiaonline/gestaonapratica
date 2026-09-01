import { products } from "@/lib/products";

export type ValidPostPayload = {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  relatedProduct?: string;
  content: string;
};

const SLUG_REGEX = /^[a-z0-9]+(-[a-z0-9]+)*$/;

export function validatePostPayload(
  body: unknown,
): { ok: true; data: ValidPostPayload } | { ok: false; error: string } {
  if (typeof body !== "object" || body === null) {
    return { ok: false, error: "Corpo da requisição inválido." };
  }
  const b = body as Record<string, unknown>;

  const slug = typeof b.slug === "string" ? b.slug.trim() : "";
  const title = typeof b.title === "string" ? b.title.trim() : "";
  const description = typeof b.description === "string" ? b.description.trim() : "";
  const date = typeof b.date === "string" ? b.date.trim() : "";
  const content = typeof b.content === "string" ? b.content : "";
  const relatedProduct =
    typeof b.relatedProduct === "string" && b.relatedProduct.trim()
      ? b.relatedProduct.trim()
      : undefined;
  const tags = Array.isArray(b.tags)
    ? b.tags.filter((t): t is string => typeof t === "string" && t.trim().length > 0)
    : [];

  if (!slug || !SLUG_REGEX.test(slug)) {
    return {
      ok: false,
      error: "Slug inválido. Use apenas letras minúsculas, números e hífens.",
    };
  }
  if (!title) return { ok: false, error: "Título é obrigatório." };
  if (!description) return { ok: false, error: "Meta descrição é obrigatória." };
  if (!date || Number.isNaN(Date.parse(date))) {
    return { ok: false, error: "Data inválida." };
  }
  if (!content.trim()) return { ok: false, error: "Conteúdo é obrigatório." };
  if (relatedProduct && !products.some((p) => p.slug === relatedProduct)) {
    return { ok: false, error: "Produto relacionado não encontrado." };
  }

  return { ok: true, data: { slug, title, description, date, tags, relatedProduct, content } };
}
