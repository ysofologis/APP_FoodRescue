import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { v4 as uuid } from 'uuid';

@Entity('recipients')
export class RecipientAggregate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255 })
  orgType: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  legalDocsRef?: string;

  @Column({ type: 'varchar', length: 255 })
  contactEmail: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  contactPhone?: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  address?: string;

  @Column({ type: 'simple-json', default: [] })
  dietaryRestrictions: string[];

  @Column({ type: 'simple-json', default: [] })
  preferredCategories: string[];

  @Column({ type: 'simple-json', default: {} })
  capacity: Record<string, unknown>;

  @Column({ type: 'varchar', length: 20, default: 'PENDING' })
  status: string;

  @Column({ type: 'int', default: 0 })
  reliabilityScore: number;

  static create(
    name: string,
    orgType: string,
    contactEmail: string,
    legalDocsRef?: string,
    contactPhone?: string,
    address?: string,
  ): [RecipientAggregate, any] {
    const recipient = new RecipientAggregate();
    recipient.id = uuid();
    recipient.name = name;
    recipient.orgType = orgType;
    recipient.contactEmail = contactEmail;
    recipient.legalDocsRef = legalDocsRef;
    recipient.contactPhone = contactPhone;
    recipient.address = address;
    recipient.status = 'PENDING';
    recipient.reliabilityScore = 0;

    return [recipient, { type: 'recipient.created', recipientId: recipient.id }];
  }

  verify(): void {
    if (this.status === 'VERIFIED') {
      throw new Error('Recipient is already verified');
    }
    this.status = 'VERIFIED';
  }

  suspend(reason: string): void {
    if (this.status === 'SUSPENDED') {
      throw new Error('Recipient is already suspended');
    }
    this.status = 'SUSPENDED';
  }

  updateReliability(score: number): void {
    if (score < 0 || score > 100) {
      throw new Error('Reliability score must be between 0 and 100');
    }
    this.reliabilityScore = score;
  }
}
