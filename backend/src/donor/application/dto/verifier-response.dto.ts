import { Exclude, Expose } from 'class-transformer';
import { VerifierSummary } from '../ports/verifiers-read.port';

@Exclude()
export class VerifierResponseDto implements VerifierSummary {
  @Expose()
  id!: string;

  @Expose()
  name!: string;

  @Expose()
  role!: string;

  @Expose()
  active!: boolean;

  static fromSummary(summary: VerifierSummary): VerifierResponseDto {
    return Object.assign(new VerifierResponseDto(), summary);
  }
}