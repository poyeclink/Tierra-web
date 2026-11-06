import type { Money } from "@/core/shared/money";

export type MenuItemTag = "vegetarian" | "vegan" | "gluten-free" | "new" | "popular";

export type MenuItem = {
  readonly id: string;
  readonly name: string;
  readonly description?: string;
  readonly price: Money;
  readonly imageUrl?: string;
  readonly tags?: readonly MenuItemTag[];
  readonly isAvailable: boolean;
};

export type MenuCategory = {
  readonly id: string;
  readonly name: string;
  readonly description?: string;
  readonly items: readonly MenuItem[];
};

export type Menu = {
  readonly categories: readonly MenuCategory[];
};

/** Removes unavailable items and categories left empty. */
export function availableMenu(menu: Menu): Menu {
  return {
    categories: menu.categories
      .map((category) => ({
        ...category,
        items: category.items.filter((item) => item.isAvailable),
      }))
      .filter((category) => category.items.length > 0),
  };
}

export function findMenuItem(menu: Menu, itemId: string): MenuItem | undefined {
  for (const category of menu.categories) {
    const item = category.items.find((i) => i.id === itemId);
    if (item) return item;
  }
  return undefined;
}
