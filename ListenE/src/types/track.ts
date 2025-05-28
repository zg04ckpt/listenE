import { IPostUpdateSegmentItem, ISegmentItem } from "./segment";

export type ITrackItem = {
  id: number;
  name: string;
  fullTranscript: string;
  fullAudio?: File;
  segments: ISegmentItem[];
  difficulty?: string;
  completed?: boolean;
};

export type ITrackReponseItem = {
  id: number;
  name: string;
  fullAudioUrl: string;
  fullAudioTranscript: string;
  fullAudioDuration: string;
  segments: ISegmentItem[];
  difficulty?: string;
  completed?: boolean;
};

export type IPostUpdateTrackItem = {
  name: string;
  fullTranscript: string;
  segments: IPostUpdateSegmentItem[];
};

export type FetchTracksParams = {
  page?: number;
  size?: number;
  name?: string;
  sortField?: string;
  sortDirection?: "asc" | "desc";
};

export type ITrackResponseItem = {
  id: number;
  name: string;
  order: number;
};
