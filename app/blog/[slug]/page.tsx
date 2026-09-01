import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { RelatedProduct } from "@/components/RelatedProduct";
import { getAllPostSlugs, getPostBySlug } from "@/lib/posts";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return getAllPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getAllPostSlugs().includes(slug) ? getPostBySlug(slug) : null;
  if (!post) return {};

  return {
    title: post.frontmatter.title,
    description: post.frontmatter.description,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;

  if (!getAllPostSlugs().includes(slug)) {
    notFound();
  }

  const post = getPostBySlug(slug);
  const date = new Date(post.frontmatter.date).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <article className="mx-auto max-w-3xl px-4 py-16">
      <p className="text-xs uppercase tracking-wide text-neutral-400">
        {date}
      </p>
      <h1 className="mt-2 text-3xl font-bold text-brand-dark sm:text-4xl">
        {post.frontmatter.title}
      </h1>
      <p className="mt-4 text-lg text-neutral-600">
        {post.frontmatter.description}
      </p>

      <div className="prose-content mt-10">
        <MDXRemote source={post.content} />
      </div>

      {post.frontmatter.relatedProduct && (
        <RelatedProduct slug={post.frontmatter.relatedProduct} />
      )}
    </article>
  );
}
