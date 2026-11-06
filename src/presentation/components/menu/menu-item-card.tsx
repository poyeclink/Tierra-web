import type { MenuItem } from "@/core/menu/domain/menu";
import { formatPrice, MENU_TAG_LABELS } from "@/presentation/lib/format";

export function MenuItemCard({ item }: { item: MenuItem }) {
  return (
    <li className="flex items-start justify-between gap-6 py-5">
      <div>
        <h3 className="font-medium">{item.name}</h3>
        {item.description && <p className="mt-1 text-sm text-ink-muted">{item.description}</p>}
        {item.tags && item.tags.length > 0 && (
          <ul className="mt-2 flex flex-wrap gap-2">
            {item.tags.map((tag) => (
              <li key={tag} className="rounded-full border border-aqua px-2 py-0.5 text-xs">
                {MENU_TAG_LABELS[tag]}
              </li>
            ))}
          </ul>
        )}
      </div>
      <p className="shrink-0 font-medium tabular-nums">{formatPrice(item.price)}</p>
    </li>
  );
}
