import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import { useCases } from "@/di/container";
import { CACHE_TAGS } from "@/presentation/lib/cache-tags";

export async function getEstablishment() {
  "use cache";
  cacheLife("days");
  cacheTag(CACHE_TAGS.establishment);
  return useCases.getEstablishment();
}
