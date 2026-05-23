class ApiError extends Error {
  public statusCode: number;
  public data: null;
  public error: unknown[];
  public success: boolean;
  constructor(
    statusCode: number,
    message: string = "Something went wrong!",
    error: unknown[] = [],
    stack?: string,
  ) {
    super(message);

    this.statusCode = statusCode;
    this.data = null;
    this.message = message;
    this.error = error;
    this.success = false;

    if (stack) this.stack = stack;
    else Error.captureStackTrace(this, this.constructor); // If no stack provided it generate proper stack trace automatically.
  }
}
export { ApiError };
