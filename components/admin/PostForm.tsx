"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Product } from "@/lib/products";

type PostFormValues = {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string;
  relatedProduct: string;
  content: string;
};

export function PostForm({
  mode,
  initial,
  products,
}: {
  mode: "create" | "edit";
  initial: PostFormValues;
  products: Product[];
}) {
  const router = useRouter();
  const [values, setValues] = useState(initial);
  const [slugTouched, setSlugTouched] = useState(mode === "edit");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function update<K extends keyof PostFormValues>(key: K, value: PostFormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  function handleTitleChange(title: string) {
    update("title", title);
    if (!slugTouched) {
      update("slug", slugify(title));
    }
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      ...values,
      tags: values.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };

    const url = mode === "create" ? "/api/admin/posts" : `/api/admin/posts/${initial.slug}`;
    const method = mode === "create" ? "POST" : "PUT";

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setSaving(false);

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      setError(data.error || "Erro ao salvar post.");
      return;
    }

    router.push("/admin/posts");
    router.refresh();
  }

  const titleLen = values.title.length;
  const descLen = values.description.length;

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-5">
      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700">Título</label>
        <input
          required
          value={values.title}
          onChange={(event) => handleTitleChange(event.target.value)}
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-brand focus:outline-none"
        />
        <p
          className={`mt-1 text-xs ${
            titleLen > 60 || titleLen < 30 ? "text-amber-600" : "text-neutral-400"
          }`}
        >
          {titleLen} caracteres (ideal: 30-60)
        </p>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700">Slug (URL)</label>
        <input
          required
          value={values.slug}
          disabled={mode === "edit"}
          onChange={(event) => {
            setSlugTouched(true);
            update("slug", slugify(event.target.value));
          }}
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-brand focus:outline-none disabled:bg-neutral-100"
        />
        <p className="mt-1 text-xs text-neutral-400">
          /blog/{values.slug || "..."}
          {mode === "edit" && " (não pode ser alterado após criar)"}
        </p>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700">
          Meta descrição
        </label>
        <textarea
          required
          rows={2}
          value={values.description}
          onChange={(event) => update("description", event.target.value)}
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-brand focus:outline-none"
        />
        <p
          className={`mt-1 text-xs ${
            descLen > 160 || descLen < 70 ? "text-amber-600" : "text-neutral-400"
          }`}
        >
          {descLen} caracteres (ideal: 70-160)
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-700">Data</label>
          <input
            type="date"
            required
            value={values.date}
            onChange={(event) => update("date", event.target.value)}
            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-brand focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-700">
            Tags (separadas por vírgula)
          </label>
          <input
            value={values.tags}
            onChange={(event) => update("tags", event.target.value)}
            placeholder="financeiro, fluxo de caixa"
            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-brand focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700">
          Produto relacionado (opcional)
        </label>
        <select
          value={values.relatedProduct}
          onChange={(event) => update("relatedProduct", event.target.value)}
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-brand focus:outline-none"
        >
          <option value="">Nenhum</option>
          {products.map((product) => (
            <option key={product.slug} value={product.slug}>
              {product.title}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700">
          Conteúdo (Markdown/MDX)
        </label>
        <textarea
          required
          rows={18}
          value={values.content}
          onChange={(event) => update("content", event.target.value)}
          className="w-full rounded-md border border-neutral-300 px-3 py-2 font-mono text-sm focus:border-brand focus:outline-none"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-md bg-brand px-5 py-2 text-sm font-semibold text-white transition hover:bg-brand-light disabled:opacity-60"
        >
          {saving ? "Publicando..." : mode === "create" ? "Publicar post" : "Salvar alterações"}
        </button>
      </div>
    </form>
  );
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}
