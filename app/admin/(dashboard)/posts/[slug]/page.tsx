import { notFound } from "next/navigation";
import { PostForm } from "@/components/admin/PostForm";
import { getAllPostSlugs, getPostBySlug } from "@/lib/posts";
import { products } from "@/lib/products";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!getAllPostSlugs().includes(slug)) notFound();
  const post = getPostBySlug(slug);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-brand-dark">Editar post</h1>
      <PostForm
        mode="edit"
        products={products}
        initial={{
          slug: post.slug,
          title: post.frontmatter.title,
          description: post.frontmatter.description,
          date: post.frontmatter.date.slice(0, 10),
          tags: (post.frontmatter.tags || []).join(", "),
          relatedProduct: post.frontmatter.relatedProduct || "",
          content: post.content.trim(),
        }}
      />
    </div>
  );
}
