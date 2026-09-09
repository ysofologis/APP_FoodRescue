import { DistributionRunAggregate } from '../aggregates/distribution-run.aggregate';

export interface DistributionRunRepository {
  save(run: DistributionRunAggregate): Promise<void>;
  findById(id: string): Promise<DistributionRunAggregate | null>;
  findByDriverId(driverId: string): Promise<DistributionRunAggregate[]>;
  findByStatus(status: string): Promise<DistributionRunAggregate[]>;
}
