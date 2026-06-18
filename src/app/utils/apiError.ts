export class ApiError extends Error {
  constructor(
    public code: string,
    detail?: string,
  ) {
    super(detail || code);
    this.name = 'ApiError';
  }
}
