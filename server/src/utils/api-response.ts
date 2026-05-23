class ApiResponse {
  public statusCode: number;
  public data: unknown;
  public message: string;
  public success: boolean;

  constructor(statusCode: number, data: null, message: string = "success") {
    this.data = data;
    this.message = message;
    this.statusCode = statusCode;
    this.success = statusCode < 400; // Any status code below 400 is considered successful.
  }
}

export { ApiResponse };
