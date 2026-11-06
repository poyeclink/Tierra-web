import "server-only";

import type { ToastConfig } from "@/infrastructure/toast/toast.config";

function oneOf<T extends string>(name: string, allowed: readonly T[], fallback: T): T {
  // `||`, not `??`: an empty `MENU_SOURCE=` line in .env must fall back too.
  const value = process.env[name] || fallback;
  if (!allowed.includes(value as T)) {
    throw new Error(`${name} must be one of: ${allowed.join(", ")}. Got "${value}".`);
  }
  return value as T;
}

function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable ${name}`);
  return value;
}

export const env = {
  menuSource: oneOf("MENU_SOURCE", ["local", "toast"] as const, "local"),
  orderProvider: oneOf("ORDER_PROVIDER", ["none", "toast"] as const, "none"),
};

/** Read lazily so Toast vars are only required when Toast is in use. */
export function getToastConfig(): ToastConfig {
  return {
    apiHostname: required("TOAST_API_HOSTNAME"),
    clientId: required("TOAST_CLIENT_ID"),
    clientSecret: required("TOAST_CLIENT_SECRET"),
    restaurantGuid: required("TOAST_RESTAURANT_GUID"),
  };
}
