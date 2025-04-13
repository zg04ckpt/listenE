import { ISegmentItem } from "./segment";

export type ITrackItem = {
  id: number;
  name: string;
  fullTranscript: string;
  fullAudio: File;
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
