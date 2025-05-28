export type ApiResponse<T> = {
  data: T;
  status: string;
  message: string | null;
};
