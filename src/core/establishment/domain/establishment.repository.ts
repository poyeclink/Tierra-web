import type { Establishment } from "./establishment";

/** Port: establishment info (about, contact, hours). */
export interface EstablishmentRepository {
  getEstablishment(): Promise<Establishment>;
}
