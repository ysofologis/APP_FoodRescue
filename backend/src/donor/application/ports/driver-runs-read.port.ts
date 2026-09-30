/**
 * Anti-corruption layer: donor's claim-tracking view needs to render
 * distribution-run info owned by the logistics context. Abstract port
 * for NestJS DI compatibility.
 */

export interface DriverRunSummary {
  id: string;
  name: string;
  driverId: string;
  listingIds: string[];
  scheduledPickup: Date;
  status: string;
}

export abstract class DriverRunsReadPort {
  abstract findByDriverId(driverId: string): Promise<DriverRunSummary[]>;
}