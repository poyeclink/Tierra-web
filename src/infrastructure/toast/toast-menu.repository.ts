import type { MenuRepository } from "@/core/menu/domain/menu.repository";
import type { ToastConfig } from "./toast.config";

/**
 * Adapter: Toast menus -> domain Menu.
 *
 * TODO (phase 3):
 *  - Authenticate with Toast (machine client credentials) and cache the token.
 *  - Fetch the restaurant menu and map groups/items to MenuCategory/MenuItem
 *    (Toast prices come in major units -> use moneyFromMajorUnits).
 *  - Revalidate the "menu" cache tag from a Toast webhook route.
 */
export function createToastMenuRepository(config: ToastConfig): MenuRepository {
  void config;
  return {
    async getMenu() {
      throw new Error("Toast menu integration is not implemented yet.");
    },
  };
}
