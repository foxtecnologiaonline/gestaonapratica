export function Footer() {
  return (
    <footer className="mt-20 border-t border-neutral-200 bg-white">
      <div className="mx-auto max-w-5xl px-4 py-8 text-sm text-neutral-500">
        <p>
          © {new Date().getFullYear()} Gestão na Prática. Conteúdo sobre
          gestão para pequenos negócios.
        </p>
      </div>
    </footer>
  );
}
