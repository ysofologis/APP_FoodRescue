import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { v4 as uuid } from 'uuid';

@Entity('distribution_runs')
export class DistributionRunAggregate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 'uuid' })
  driverId: string;

  @Column({ type: 'simple-json' })
  listingIds: string[];

  @Column({ type: 'timestamp' })
  scheduledPickup: Date;

  @Column({ type: 'varchar', length: 500, nullable: true })
  routeNotes?: string;

  @Column({ type: 'varchar', length: 20, default: 'SCHEDULED' })
  status: string;

  @Column({ type: 'timestamp', nullable: true })
  pickedUpAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  deliveredAt?: Date;

  static create(
    name: string,
    driverId: string,
    listingIds: string[],
    scheduledPickup: Date,
    routeNotes?: string,
  ): [DistributionRunAggregate, any] {
    const run = new DistributionRunAggregate();
    run.id = uuid();
    run.name = name;
    run.driverId = driverId;
    run.listingIds = listingIds;
    run.scheduledPickup = scheduledPickup;
    run.routeNotes = routeNotes;
    run.status = 'SCHEDULED';

    return [run, { type: 'distribution.run.created', runId: run.id }];
  }

  assignDriver(driverId: string): void {
    if (this.status !== 'SCHEDULED') {
      throw new Error(`Cannot reassign driver to run in status: ${this.status}`);
    }
    this.driverId = driverId;
  }

  confirmPickup(): void {
    if (this.status !== 'SCHEDULED') {
      throw new Error('Run must be scheduled before pickup confirmation');
    }
    this.status = 'IN_TRANSIT';
    this.pickedUpAt = new Date();
  }

  confirmDelivery(): void {
    if (this.status !== 'IN_TRANSIT') {
      throw new Error('Run must be in transit before delivery confirmation');
    }
    this.status = 'DELIVERED';
    this.deliveredAt = new Date();
  }

  cancel(reason: string): void {
    if (this.status === 'DELIVERED') {
      throw new Error('Cannot cancel a completed delivery');
    }
    this.status = 'CANCELLED';
    this.routeNotes = `Cancelled: ${reason}`;
  }
}
