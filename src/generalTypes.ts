export type VerificationType = "account-activation" | "password-recovery";

export interface Paginate {
  page?: string;
  limit?: string;
}

export interface PaginateData<T> {
  data: T[];
  page: number;
  limit: number;
  totalCount: number;
}
