export class ApiResponse<T> {
  constructor(
    public readonly success: boolean,
    public readonly data?: T,
    public readonly error?: string,
    public readonly message?: string,
  ) {}

  static ok<T>(data: T, message?: string): ApiResponse<T> {
    return new ApiResponse<T>(true, data, undefined, message);
  }

  static fail<T>(error: string, message?: string): ApiResponse<T> {
    return new ApiResponse<T>(false, undefined, error, message);
  }
}
