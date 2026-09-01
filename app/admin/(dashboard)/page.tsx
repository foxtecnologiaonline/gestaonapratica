import Link from "next/link";
import { getAllPosts } from "@/lib/posts";
import { products } from "@/lib/products";
import { auditPost } from "@/lib/seo";
import { isGithubPublishingConfigured } from "@/lib/github-content";
import { isGaConfigured } from "@/lib/analytics";

export default function AdminDashboardPage() {
  const posts = getAllPosts();
  const scores = posts.map((post) => auditPost(post).score);
  const avgScore = scores.length
    ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
    : 0;
  const githubConfigured = isGithubPublishingConfigured();
  const gaConfigured = isGaConfigured();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-brand-dark">Visão geral</h1>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Posts publicados" value={posts.length} href="/admin/posts" />
        <StatCard label="Produtos digitais" value={products.length} href="/produtos" />
        <StatCard label="SEO médio" value={`${avgScore}%`} href="/admin/seo" />
        <StatCard
          label="Analytics"
          value={gaConfigured ? "Conectado" : "Não conectado"}
          href="/admin/analytics"
        />
      </div>

      {!githubConfigured && (
        <div className="mt-8 rounded-md border border-amber-300 bg-amber-50 p-4 text-sm text-amber-800">
          <strong>Publicação via GitHub não configurada.</strong> Sem{" "}
          <code className="rounded bg-white/60 px-1">GITHUB_TOKEN</code>,{" "}
          <code className="rounded bg-white/60 px-1">GITHUB_OWNER</code> e{" "}
          <code className="rounded bg-white/60 px-1">GITHUB_REPO</code> definidos, posts
          criados aqui só gravam localmente (útil em <code className="rounded bg-white/60 px-1">npm run dev</code>,
          mas não persiste em produção). Veja o README para configurar.
        </div>
      )}

      <div className="mt-8">
        <Link
          href="/admin/posts/new"
          className="inline-block rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-light"
        >
          + Novo post
        </Link>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  href,
}: {
  label: string;
  value: string | number;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="block rounded-lg border border-neutral-200 bg-white p-5 transition hover:border-brand"
    >
      <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">
        {label}
      </p>
      <p className="mt-2 text-2xl font-bold text-brand-dark">{value}</p>
    </Link>
  );
}
