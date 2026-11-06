import { siteConfig } from "@/config/site";
import type { Weekday } from "@/core/establishment/domain/establishment";
import type { MenuItemTag } from "@/core/menu/domain/menu";
import { toMajorUnits, type Money } from "@/core/shared/money";

export function formatPrice(price: Money): string {
  return new Intl.NumberFormat(siteConfig.locale, {
    style: "currency",
    currency: price.currency,
  }).format(toMajorUnits(price));
}

export const WEEKDAYS: readonly { day: Weekday; label: string }[] = [
  { day: "monday", label: "Lunes" },
  { day: "tuesday", label: "Martes" },
  { day: "wednesday", label: "Miércoles" },
  { day: "thursday", label: "Jueves" },
  { day: "friday", label: "Viernes" },
  { day: "saturday", label: "Sábado" },
  { day: "sunday", label: "Domingo" },
];

export const MENU_TAG_LABELS: Record<MenuItemTag, string> = {
  vegetarian: "Vegetariano",
  vegan: "Vegano",
  "gluten-free": "Sin gluten",
  new: "Nuevo",
  popular: "Favorito",
};
