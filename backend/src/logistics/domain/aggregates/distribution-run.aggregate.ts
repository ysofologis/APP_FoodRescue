import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { DistributionRunCreatedEvent } from '../events/distribution-run-created.event';
import { PickupConfirmedEvent } from '../events/pickup-confirmed.event';
import { DeliveryCompletedEvent } from '../events/delivery-completed.event';

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
  ): [DistributionRunAggregate, DistributionRunCreatedEvent] {
    const run = new DistributionRunAggregate();
    run.id = uuid();
    run.name = name;
    run.driverId = driverId;
    run.listingIds = listingIds;
    run.scheduledPickup = scheduledPickup;
    run.routeNotes = routeNotes;
    run.status = 'SCHEDULED';

    const event = new DistributionRunCreatedEvent(run.id, run.name, run.driverId, run.listingIds);
    return [run, event];
  }

  assignDriver(driverId: string): void {
    if (this.status !== 'SCHEDULED') {
      throw new Error(`Cannot reassign driver to run in status: ${this.status}`);
    }
    this.driverId = driverId;
  }

  confirmPickup(): [DistributionRunAggregate, PickupConfirmedEvent] {
    if (this.status !== 'SCHEDULED') {
      throw new Error('Run must be scheduled before pickup confirmation');
    }
    this.status = 'IN_TRANSIT';
    this.pickedUpAt = new Date();
    const event = new PickupConfirmedEvent(this.id, this.listingIds, this.pickedUpAt);
    return [this, event];
  }

  confirmDelivery(): [DistributionRunAggregate, DeliveryCompletedEvent] {
    if (this.status !== 'IN_TRANSIT') {
      throw new Error('Run must be in transit before delivery confirmation');
    }
    this.status = 'DELIVERED';
    this.deliveredAt = new Date();
    const event = new DeliveryCompletedEvent(this.id, this.listingIds, this.deliveredAt);
    return [this, event];
  }

  cancel(reason: string): void {
    if (this.status === 'DELIVERED') {
      throw new Error('Cannot cancel a completed delivery');
    }
    this.status = 'CANCELLED';
    this.routeNotes = `Cancelled: ${reason}`;
  }
}
