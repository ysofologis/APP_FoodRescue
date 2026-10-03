import { Expose } from 'class-transformer';
import { DonorImpactSummary } from '../ports/impact-read.port';
import { PublicImpactSummary } from '../ports/public-impact-read.port';
import { RecipientImpactSummary } from '../ports/recipient-impact-read.port';

@Expose()
export class DonorImpactResponseDto implements DonorImpactSummary {
  @Expose()
  donorId!: string;

  @Expose()
  totalMealsSaved!: number;

  @Expose()
  totalCo2Avoided!: number;

  @Expose()
  totalKgDelivered!: number;

  static fromSummary(summary: DonorImpactSummary): DonorImpactResponseDto {
    return Object.assign(new DonorImpactResponseDto(), summary);
  }
}

@Expose()
export class PublicImpactResponseDto implements PublicImpactSummary {
  @Expose()
  totalMealsSaved!: number;

  @Expose()
  totalCo2Avoided!: number;

  @Expose()
  totalKgDelivered!: number;

  static fromSummary(summary: PublicImpactSummary): PublicImpactResponseDto {
    return Object.assign(new PublicImpactResponseDto(), summary);
  }
}

@Expose()
export class RecipientImpactResponseDto implements RecipientImpactSummary {
  @Expose()
  recipientId!: string;

  @Expose()
  totalMealsSaved!: number;

  @Expose()
  totalCo2Avoided!: number;

  @Expose()
  totalKgDelivered!: number;

  static fromSummary(
    summary: RecipientImpactSummary,
  ): RecipientImpactResponseDto {
    return Object.assign(new RecipientImpactResponseDto(), summary);
  }
}