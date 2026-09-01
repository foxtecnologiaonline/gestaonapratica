import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_SESSION_COOKIE, verifySessionToken } from "@/lib/admin-session";
import { LogoutButton } from "@/components/admin/LogoutButton";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

const NAV = [
  { href: "/admin", label: "Visão geral" },
  { href: "/admin/posts", label: "Posts" },
  { href: "/admin/seo", label: "SEO" },
  { href: "/admin/analytics", label: "Analytics" },
];

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // O middleware já protege estas rotas; esta é uma segunda checagem
  // (defesa em profundidade) para o caso de o layout ser renderizado
  // sem passar pelo middleware.
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  const valid = await verifySessionToken(token);
  if (!valid) {
    redirect("/admin/login");
  }

  return (
    <div className="flex min-h-screen bg-neutral-50">
      <aside className="flex w-56 shrink-0 flex-col border-r border-neutral-200 bg-white">
        <div className="border-b border-neutral-200 px-4 py-4">
          <p className="text-sm font-bold text-brand-dark">Admin</p>
          <p className="text-xs text-neutral-400">Gestão na Prática</p>
        </div>
        <nav className="flex flex-1 flex-col gap-1 p-3 text-sm">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 font-medium text-neutral-700 transition hover:bg-brand/10 hover:text-brand"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-3">
          <LogoutButton />
        </div>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
