import type { EstablishmentRepository } from "@/core/establishment/domain/establishment.repository";
import { establishmentData } from "./data/establishment.data";

export const localEstablishmentRepository: EstablishmentRepository = {
  async getEstablishment() {
    return establishmentData;
  },
};
