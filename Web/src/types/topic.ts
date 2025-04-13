export type ITopicItem = {
  id: number;
  name: string;
  thumbnailUrl: string;
  description: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  sessionCount: number;
  isFavorite?: boolean;
};

export type ITopicsFilterValue = string | string[];

export type ITopicsFilters = {
  name?: string;
  search?: string;
  skill?: string[];
};
