import Link from "next/link";
import { getAllPosts } from "@/lib/posts";
import { auditPost, siteWideChecks, type SeoCheck } from "@/lib/seo";

export default function AdminSeoPage() {
  const posts = getAllPosts();
  const site = siteWideChecks();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-brand-dark">SEO</h1>

      <section className="mb-8">
        <h2 className="mb-3 text-lg font-semibold text-brand-dark">
          Checklist do site
        </h2>
        <div className="divide-y divide-neutral-100 rounded-lg border border-neutral-200 bg-white">
          {site.map((check) => (
            <CheckRow key={check.label} check={check} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold text-brand-dark">
          Auditoria por post
        </h2>
        <div className="space-y-4">
          {posts.map((post) => {
            const { score, checks } = auditPost(post);
            return (
              <div
                key={post.slug}
                className="rounded-lg border border-neutral-200 bg-white p-5"
              >
                <div className="mb-3 flex items-center justify-between">
                  <Link
                    href={`/admin/posts/${post.slug}`}
                    className="font-semibold text-brand-dark hover:underline"
                  >
                    {post.frontmatter.title}
                  </Link>
                  <ScoreBadge score={score} />
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  {checks.map((check) => (
                    <CheckRow key={check.label} check={check} compact />
                  ))}
                </div>
              </div>
            );
          })}
          {posts.length === 0 && (
            <p className="text-neutral-400">Nenhum post ainda.</p>
          )}
        </div>
      </section>
    </div>
  );
}

function ScoreBadge({ score }: { score: number }) {
  const color =
    score >= 80
      ? "bg-green-100 text-green-700"
      : score >= 50
        ? "bg-amber-100 text-amber-700"
        : "bg-red-100 text-red-700";
  return (
    <span className={`rounded-full px-2 py-1 text-xs font-semibold ${color}`}>
      {score}%
    </span>
  );
}

function CheckRow({ check, compact }: { check: SeoCheck; compact?: boolean }) {
  const icon = check.level === "ok" ? "✓" : check.level === "warning" ? "!" : "✕";
  const color =
    check.level === "ok"
      ? "text-green-600"
      : check.level === "warning"
        ? "text-amber-600"
        : "text-red-600";

  return (
    <div
      className={
        compact
          ? "flex items-start gap-2 text-sm"
          : "flex items-start gap-3 px-4 py-3 text-sm"
      }
    >
      <span className={`font-bold ${color}`}>{icon}</span>
      <div>
        <p className="font-medium text-neutral-700">{check.label}</p>
        <p className="text-neutral-500">{check.detail}</p>
      </div>
    </div>
  );
}
