export type ISegmentItem = {
  id: number;
  trackId: number;
  name: string;
  duration: string;
  audioUrl: string;
  transcript: string;
  completed?: boolean;
};

export type ISegmentResponseItem = {
  id: number;
  name?: string;
  trancript: string;
  segmentDuration: string;
  orderInTrack: number;
  completed?: boolean;
};

export type IPostSegmentItem = {
  id: number;
  order?: number;
  startSec?: number;
  endSec?: number;
  transcript: string;
  audioUrl?: string;
};
