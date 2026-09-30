/**
 * Anti-corruption layer: donor's claim-tracking view needs to render
 * distribution-run info owned by the logistics context.
 */

export interface DriverRunSummary {
  id: string;
  name: string;
  driverId: string;
  listingIds: string[];
  scheduledPickup: Date;
  status: string;
}

export interface DriverRunsReadPort {
  findByDriverId(driverId: string): Promise<DriverRunSummary[]>;
}