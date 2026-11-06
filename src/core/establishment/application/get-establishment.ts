import type { Establishment } from "../domain/establishment";
import type { EstablishmentRepository } from "../domain/establishment.repository";

export function makeGetEstablishment(repository: EstablishmentRepository) {
  return function getEstablishment(): Promise<Establishment> {
    return repository.getEstablishment();
  };
}
