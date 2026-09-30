import { Entity, PrimaryColumn, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { Organization } from '../value-objects/organization.vo';
import { DonorStatus } from '../value-objects/donor-status.vo';
import { FoodListing } from './food-listing.aggregate';
import { DonorCreatedEvent } from '../events/donor-created.event';

@Entity('donors')
export class DonorAggregate {
  @PrimaryColumn({ type: 'varchar', length: 36 })
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  businessLicense?: string;

  @Column({ type: 'varchar', length: 255 })
  contactEmail: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  contactPhone?: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  address?: string;

  @Column({ type: 'simple-json', default: {} })
  metadata: Record<string, unknown>;

  @Column({ type: 'varchar', length: 20, default: 'PENDING' })
  status: string;

  @OneToMany(() => FoodListing, (listing) => listing.donor)
  listings: FoodListing[];

  static create(
    name: string,
    contactEmail: string,
    businessLicense?: string,
    contactPhone?: string,
    address?: string,
  ): [DonorAggregate, DonorCreatedEvent] {
    const donor = new DonorAggregate();
    donor.id = uuid();
    donor.name = name;
    donor.contactEmail = contactEmail;
    donor.businessLicense = businessLicense;
    donor.contactPhone = contactPhone;
    donor.address = address;
    donor.status = 'PENDING';
    donor.metadata = {};

    const event = new DonorCreatedEvent(donor.id, name, contactEmail);
    return [donor, event];
  }

  verify(): void {
    if (this.status === 'VERIFIED') {
      throw new Error('Donor is already verified');
    }
    this.status = 'VERIFIED';
  }

  suspend(reason: string): void {
    if (this.status === 'SUSPENDED') {
      throw new Error('Donor is already suspended');
    }
    this.status = 'SUSPENDED';
    this.metadata.suspensionReason = reason;
  }
}
