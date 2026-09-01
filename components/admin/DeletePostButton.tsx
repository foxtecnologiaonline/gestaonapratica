"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function DeletePostButton({ slug }: { slug: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm("Excluir este post? A exclusão vira um commit e pode ser desfeita pelo histórico do Git, mas some do site imediatamente.")) {
      return;
    }
    setLoading(true);
    const response = await fetch(`/api/admin/posts/${slug}`, { method: "DELETE" });
    setLoading(false);

    if (response.ok) {
      router.refresh();
    } else {
      const data = await response.json().catch(() => ({}));
      alert(data.error || "Erro ao excluir post.");
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="font-medium text-red-600 hover:underline disabled:opacity-50"
    >
      {loading ? "Excluindo..." : "Excluir"}
    </button>
  );
}
