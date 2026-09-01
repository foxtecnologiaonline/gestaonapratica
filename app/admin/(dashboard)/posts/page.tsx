import Link from "next/link";
import { getAllPosts } from "@/lib/posts";
import { auditPost } from "@/lib/seo";
import { DeletePostButton } from "@/components/admin/DeletePostButton";

export default function AdminPostsPage() {
  const posts = getAllPosts();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-brand-dark">Posts</h1>
        <Link
          href="/admin/posts/new"
          className="rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-light"
        >
          + Novo post
        </Link>
      </div>

      <div className="overflow-x-auto rounded-lg border border-neutral-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-neutral-50 text-xs uppercase text-neutral-500">
            <tr>
              <th className="px-4 py-3">Título</th>
              <th className="px-4 py-3">Data</th>
              <th className="px-4 py-3">SEO</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {posts.map((post) => {
              const { score } = auditPost(post);
              return (
                <tr key={post.slug}>
                  <td className="px-4 py-3 font-medium text-neutral-800">
                    {post.frontmatter.title}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-neutral-500">
                    {new Date(post.frontmatter.date).toLocaleDateString("pt-BR")}
                  </td>
                  <td className="px-4 py-3">
                    <ScoreBadge score={score} />
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right">
                    <Link
                      href={`/admin/posts/${post.slug}`}
                      className="mr-3 font-medium text-brand hover:underline"
                    >
                      Editar
                    </Link>
                    <DeletePostButton slug={post.slug} />
                  </td>
                </tr>
              );
            })}
            {posts.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-neutral-400">
                  Nenhum post ainda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
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
