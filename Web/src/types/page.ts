export type PaginatedResult<T> = {
  totalItems: number;
  page: number;
  size: number;
  totalPages: number;
  items: T[];
};
