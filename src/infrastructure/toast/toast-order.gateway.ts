import type { OrderGateway } from "@/core/ordering/domain/order.gateway";
import type { ToastConfig } from "./toast.config";

/**
 * Adapter: domain OrderDraft -> Toast order.
 *
 * TODO (phase 3): map OrderDraft to the Toast order payload (menu item GUIDs,
 * dining option, customer) and map the response to PlacedOrder.
 */
export function createToastOrderGateway(config: ToastConfig): OrderGateway {
  void config;
  return {
    async placeOrder() {
      throw new Error("Toast order integration is not implemented yet.");
    },
  };
}
