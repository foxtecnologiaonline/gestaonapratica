import Link from "next/link";
import type { Post } from "@/lib/posts";

export function PostCard({ post }: { post: Post }) {
  const date = new Date(post.frontmatter.date).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="block rounded-lg border border-neutral-200 bg-white p-6 transition hover:border-brand hover:shadow-sm"
    >
      <p className="text-xs uppercase tracking-wide text-neutral-400">
        {date}
      </p>
      <h2 className="mt-2 text-xl font-bold text-brand-dark">
        {post.frontmatter.title}
      </h2>
      <p className="mt-2 text-neutral-600">{post.frontmatter.description}</p>
      {post.frontmatter.tags?.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {post.frontmatter.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-brand/10 px-3 py-1 text-xs font-medium text-brand"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}
