import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import { useCases } from "@/di/container";
import { CACHE_TAGS } from "@/presentation/lib/cache-tags";

export async function getMenu() {
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAGS.menu);
  return useCases.getMenu();
}
