import type { MenuCategory } from "@/core/menu/domain/menu";
import { MenuItemCard } from "./menu-item-card";

export function MenuCategorySection({ category }: { category: MenuCategory }) {
  return (
    <section id={category.id} aria-labelledby={`${category.id}-title`} className="scroll-mt-8">
      <h2 id={`${category.id}-title`}>{category.name}</h2>
      {category.description && <p className="mt-2 text-ink-muted">{category.description}</p>}
      <ul className="mt-4 divide-y divide-line">
        {category.items.map((item) => (
          <MenuItemCard key={item.id} item={item} />
        ))}
      </ul>
    </section>
  );
}
