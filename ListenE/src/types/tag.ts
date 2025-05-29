export type ITagItem = {
  id: number;
  type: string;
  name: string;
};

export type FetchTagsParams = {
  page?: number;
  size?: number;
  type?: string;
  name?: string;
  sortField?: string;
  sortDirection?: "asc" | "desc";
};
