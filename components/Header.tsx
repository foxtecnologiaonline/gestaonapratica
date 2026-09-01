import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-neutral-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-lg font-bold text-brand-dark">
          Gestão na Prática
        </Link>
        <nav className="flex gap-6 text-sm font-medium text-neutral-700">
          <Link href="/blog" className="hover:text-brand">
            Blog
          </Link>
          <Link href="/produtos" className="hover:text-brand">
            Produtos
          </Link>
        </nav>
      </div>
    </header>
  );
}
