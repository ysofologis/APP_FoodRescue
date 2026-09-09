export class PaginationDto {
  constructor(
    public readonly page: number = 1,
    public readonly limit: number = 20,
  ) {}

  get skip(): number {
    return (this.page - 1) * this.limit;
  }
}
