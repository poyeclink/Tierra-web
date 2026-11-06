import type { Menu } from "./menu";

/** Port: where the menu comes from (local data today, Toast POS later). */
export interface MenuRepository {
  getMenu(): Promise<Menu>;
}
