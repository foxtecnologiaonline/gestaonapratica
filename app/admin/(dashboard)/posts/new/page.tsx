import { PostForm } from "@/components/admin/PostForm";
import { products } from "@/lib/products";

export default function NewPostPage() {
  const today = new Date().toISOString().slice(0, 10);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-brand-dark">Novo post</h1>
      <PostForm
        mode="create"
        products={products}
        initial={{
          slug: "",
          title: "",
          description: "",
          date: today,
          tags: "",
          relatedProduct: "",
          content: "",
        }}
      />
    </div>
  );
}
