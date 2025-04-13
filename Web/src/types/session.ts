export type ISessionItem = {
  id: number;
  name: string;
  progress?: number;
  completed?: boolean;
  orderInTopic: number;
  trackCount: number;
  topicId?: number;
};

export type FetchSessionsParams = {
  page?: number;
  size?: number;
  key?: string;
  topicId?: number | string;
  sortField?: string;
  sortDirection?: "asc" | "desc";
};
