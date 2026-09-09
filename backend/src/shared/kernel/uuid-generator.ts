import { v4 as uuid } from 'uuid';

export class UuidGenerator {
  static generate(): string {
    return uuid();
  }
}
