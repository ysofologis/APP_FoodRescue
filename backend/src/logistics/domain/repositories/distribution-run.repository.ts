import { DistributionRunAggregate } from '../aggregates/distribution-run.aggregate';

export abstract class DistributionRunRepository {
  abstract save(run: DistributionRunAggregate): Promise<void>;
  abstract findById(id: string): Promise<DistributionRunAggregate | null>;
  abstract findByDriverId(
    driverId: string,
  ): Promise<DistributionRunAggregate[]>;
  abstract findByStatus(status: string): Promise<DistributionRunAggregate[]>;
}