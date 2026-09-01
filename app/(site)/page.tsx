import Link from "next/link";
import { PostCard } from "@/components/PostCard";
import { NewsletterForm } from "@/components/NewsletterForm";
import { getAllPosts } from "@/lib/posts";

export default function HomePage() {
  const posts = getAllPosts().slice(0, 3);

  return (
    <div>
      <section className="border-b border-neutral-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-16 text-center">
          <h1 className="text-4xl font-bold text-brand-dark sm:text-5xl">
            Gestão que sai do papel
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-neutral-600">
            Artigos práticos sobre gestão de pequenos negócios, com
            ferramentas e produtos digitais para aplicar direto na sua
            rotina.
          </p>
          <div className="mx-auto mt-8 max-w-md">
            <NewsletterForm />
            <p className="mt-2 text-xs text-neutral-400">
              Uma vez por semana, sem spam.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-16">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-brand-dark">
            Últimos posts
          </h2>
          <Link href="/blog" className="text-sm font-medium text-brand hover:underline">
            Ver todos →
          </Link>
        </div>
        {posts.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <p className="text-neutral-500">
            Nenhum post publicado ainda. Adicione arquivos .mdx em{" "}
            <code>content/posts</code>.
          </p>
        )}
      </section>
    </div>
  );
}
