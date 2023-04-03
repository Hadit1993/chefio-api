export default class BaseResponse<T> {
  success: boolean;
  message: string;

  constructor(
    public data?: T,
    options?: { success?: boolean; message?: string }
  ) {
    this.success = options?.success ?? true;
    this.message =
      options?.message ??
      (this.success
        ? "The operation was successful"
        : "Oops! Something went wrong");
  }
}
