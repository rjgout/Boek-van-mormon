import Link from "next/link";

export default function Breadcrumb({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Kruimelpad" className="text-sm text-slate-400 dark:text-slate-500 flex flex-wrap items-center gap-1.5">
      <Link href="/dashboard" className="hover:text-brand-600 dark:hover:text-brand-300 font-semibold">
        Boek van Mormon
      </Link>
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5">
          <span aria-hidden>→</span>
          {item.href ? (
            <Link href={item.href} className="hover:text-brand-600 dark:hover:text-brand-300 font-semibold">
              {item.label}
            </Link>
          ) : (
            <span className="text-slate-600 dark:text-slate-300 font-semibold">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
