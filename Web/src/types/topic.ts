export type ITopicItem = {
  id: number;
  name: string;
  thumbnailUrl: string;
  description: string;
  type: string;
  isFavorite?: boolean;
};

export type ITopicsFilterValue = string | string[];

export type ITopicsFilters = {
  name?: string;
  search?: string;
  skill?: string[];
};

export type ITopicListResponse = {
  items: ITopicItem[];
  totalItems: number;
  totalPages: number;
};

export type ITopicCreateEditItem = {
  name: string;
  description: string;
  thumbnail: File | null;
  thumbnailPreview: string | null;
};
