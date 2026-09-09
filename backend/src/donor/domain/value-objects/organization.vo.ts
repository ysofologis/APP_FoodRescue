export class Organization {
  constructor(
    public readonly name: string,
    public readonly type: string,
    public readonly verified: boolean = false,
  ) {
    if (!name || name.trim().length === 0) {
      throw new Error('Organization name must not be empty');
    }
    if (!type || type.trim().length === 0) {
      throw new Error('Organization type must not be empty');
    }
  }
}
