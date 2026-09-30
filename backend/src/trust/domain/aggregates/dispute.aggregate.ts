import { Entity, PrimaryColumn, PrimaryGeneratedColumn, Column } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { DisputeOpenedEvent } from '../events/dispute-opened.event';
import { DisputeResolvedEvent } from '../events/dispute-resolved.event';

@Entity('disputes')
export class DisputeAggregate {
  @PrimaryColumn({ type: 'varchar', length: 36 })
  id: string;

  @Column({ type: 'varchar', length: 36 })
  listingId: string;

  @Column({ type: 'varchar', length: 36 })
  openedBy: string;

  @Column({ type: 'text' })
  reason: string;

  @Column({ type: 'varchar', length: 20, default: 'OPEN' })
  status: string;

  @Column({ type: 'text', nullable: true })
  resolution?: string;

  @Column({ type: 'varchar', length: 36, nullable: true })
  resolvedBy?: string;

  @Column({ type: 'datetime' })
  openedAt: Date;

  @Column({ type: 'datetime', nullable: true })
  resolvedAt?: Date;

  static open(
    listingId: string,
    openedBy: string,
    reason: string,
  ): [DisputeAggregate, DisputeOpenedEvent] {
    const dispute = new DisputeAggregate();
    dispute.id = uuid();
    dispute.listingId = listingId;
    dispute.openedBy = openedBy;
    dispute.reason = reason;
    dispute.status = 'OPEN';
    dispute.openedAt = new Date();

    const event = new DisputeOpenedEvent(dispute.id, listingId, openedBy, reason);
    return [dispute, event];
  }

  resolve(resolution: string, resolvedBy: string): [DisputeAggregate, DisputeResolvedEvent] {
    if (this.status !== 'OPEN') {
      throw new Error('Dispute is not open');
    }
    this.status = 'RESOLVED';
    this.resolution = resolution;
    this.resolvedBy = resolvedBy;
    this.resolvedAt = new Date();
    const event = new DisputeResolvedEvent(this.id, this.listingId, resolution, resolvedBy);
    return [this, event];
  }
}
