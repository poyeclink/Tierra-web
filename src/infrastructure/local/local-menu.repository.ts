import type { MenuRepository } from "@/core/menu/domain/menu.repository";
import { menuData } from "./data/menu.data";

export const localMenuRepository: MenuRepository = {
  async getMenu() {
    return menuData;
  },
};
