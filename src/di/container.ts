import "server-only";

/**
 * Composition root: the only place that knows which adapter implements each port.
 * Swapping local data for Toast is a config change (see .env.example).
 */
import { env, getToastConfig } from "@/config/env";
import { makeGetEstablishment } from "@/core/establishment/application/get-establishment";
import { makeGetMenu } from "@/core/menu/application/get-menu";
import { makePlaceOrder } from "@/core/ordering/application/place-order";
import { disabledOrderGateway } from "@/infrastructure/disabled-order.gateway";
import { localEstablishmentRepository } from "@/infrastructure/local/local-establishment.repository";
import { localMenuRepository } from "@/infrastructure/local/local-menu.repository";
import { createToastMenuRepository } from "@/infrastructure/toast/toast-menu.repository";
import { createToastOrderGateway } from "@/infrastructure/toast/toast-order.gateway";

const menuRepository =
  env.menuSource === "toast" ? createToastMenuRepository(getToastConfig()) : localMenuRepository;

const orderGateway =
  env.orderProvider === "toast" ? createToastOrderGateway(getToastConfig()) : disabledOrderGateway;

export const useCases = {
  getMenu: makeGetMenu(menuRepository),
  getEstablishment: makeGetEstablishment(localEstablishmentRepository),
  placeOrder: makePlaceOrder(orderGateway, menuRepository),
};
