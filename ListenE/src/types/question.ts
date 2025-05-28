import { IAnswerPostItem, IAnswerResponseItem } from "./answer";

export type FetchQuestionsParams = {
  page?: number;
  size?: number;
  tagId?: number;
  type?: string;
  sortField?: string;
  sortDirection?: "asc" | "desc";
};

export type IQuestionResponseItem = {
  id: number;
  name: string;
  tagName: string;
  tagId: number;
  type: string;
};

export type IQuestionPartOneResponseItem = {
  id: number;
  imageUrl: string;
  audioUrl: string;
  tagId: number;
  tagName: string;
  type: string;
  answers: IAnswerResponseItem[];
};

export type IQuestionPartOnePostItem = {
  image: File | null;
  audio: File | null;
  correctAnswer: number;
  transcript: string;
  explanation: string;
  tagId: number;
  answers: IAnswerPostItem[];
};

export type IQuestionPartTwoResponseItem = {
  id: number;
  audioUrl: string;
  tagId: number;
  tagName: string;
  type: string;
  answers: IAnswerResponseItem[];
};

export type IQuestionPartTwoPostItem = {
  audio: File | null;
  correctAnswer: number;
  transcript: string;
  explanation: string;
  tagId: number;
  answers: IAnswerPostItem[];
};

export type ISubQuestionPart34PostItem = {
  correctAnswer: number;
  explanation: string;
  stringQuestion: string;
  answers: ISubAnswerPart34PostItem[];
};

export type ISubAnswerPart34PostItem = {
  content: string;
};

export type IQuestionPartT3PostItem = {
  image?: File;
  audio?: File;
  transcript: string;
  tagId: number;
  questions: ISubQuestionPart34PostItem[];
};

export type IQuestionPart34ResponseItem = {
  groupId: number;
  groupName: string;
  imageUrl?: string;
  audioUrl: string;
  transcript?: string;
  questions: ISubQuestionPart34ResponseItem[];
};

export type ISubQuestionPart34ResponseItem = {
  id: number;
  tagId: number;
  tagName: number;
  stringQuestion: string;
  type: string;
  explanation?: string;
  answers: ISubAnswerPart34ResponseItem[];
};

export type ISubAnswerPart34ResponseItem = {
  key: number;
  content: string;
};

export type IGroupResponseItem = {
  groupId: number;
  groupName: string;
  tagName: string;
  tagId: number;
  type: string;
};
