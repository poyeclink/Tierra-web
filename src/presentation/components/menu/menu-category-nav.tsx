import type { MenuCategory } from "@/core/menu/domain/menu";

export function MenuCategoryNav({ categories }: { categories: readonly MenuCategory[] }) {
  return (
    <nav aria-label="Categorías del menú">
      <ul className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <li key={category.id}>
            <a
              href={`#${category.id}`}
              className="inline-block rounded-full border border-line px-4 py-1.5 text-sm transition-colors hover:border-aqua hover:bg-tint"
            >
              {category.name}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
