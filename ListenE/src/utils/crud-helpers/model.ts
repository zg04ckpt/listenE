export type BaseResponseWithPayload<T> = {
  data: T;
  payload: Payload;
};

export type Payload = {
  message: string;
  pagination: PaginationState;
};

export type PaginationState = {
  page: number;
  total?: number;
  totalDoc?: number;
  totalPri?: number;
  totalTemp?: number;
  items_per_page: number;
};
export type SortState = {
  sort?: string;
  order?: 'asc' | 'desc';
};

export type FilterState = {
  filter?: unknown;
};

export type SearchState = {
  search?: string;
};
export type QueryState = PaginationState & SortState & FilterState & SearchState;

export const initialQueryState: QueryState = {
  page: 1,
  items_per_page: 10,
};
export const initialQueryStateAll: QueryState = {
  items_per_page: 100,
  page: 1,
};
export type QueryRequestContextProps = {
  state: QueryState;
  updateState: (updates: Partial<QueryState>) => void;
};
export const initialQueryRequest: QueryRequestContextProps = {
  state: initialQueryState,
  updateState: () => {},
};
