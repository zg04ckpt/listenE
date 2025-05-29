import axios from "../utils/axios";
import { endpoints } from "../utils/axios";
import { FetchQuestionsParams } from "../types/question";
import { PaginatedResult } from "../types/page";
import { IQuestionResponseItem, IGroupResponseItem } from "../types/question";
import { ApiResponse } from "../types/api";

export const getAllQuestions = async ({
  page = 1,
  size = 100,
  tagId,
  type,
  sortField = "",
  sortDirection = "asc",
}: FetchQuestionsParams = {}): Promise<
  PaginatedResult<IQuestionResponseItem>
> => {
  let URL = `${endpoints.question.root}?page=${page}&size=${size}`;

  if (tagId !== undefined) {
    URL += `&tagId=${tagId}`;
  }

  if (type) {
    URL += `&type=${type}`;
  }

  if (sortField) {
    URL += `&sort=${sortField},${sortDirection}`;
  }

  try {
    const response = await axios.get<
      ApiResponse<PaginatedResult<IQuestionResponseItem>>
    >(URL);

    return response.data.data;
  } catch (error) {
    console.error("Error fetching questions:", error);
    throw error;
  }
};

export const checkAnswerQuestion = async (id: number) => {
  const URL = `${endpoints.question.root}/${id}/correct-ans`;
  const res = await axios.get(URL);
  return res;
};

export const deleteQuestion = async (id: number) => {
  const URL = `${endpoints.question.root}/${id}`;
  const res = await axios.delete(URL);
  return res;
};

export const getDetailPartOneQuestion = async (id: number) => {
  const URL = `${endpoints.question.part1}/${id}`;
  const res = await axios.get(URL);
  return res;
};

export const createPartOneQuestion = async (params: FormData) => {
  const URL = `${endpoints.question.part1}`;
  const res = await axios.post(URL, params, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res;
};

export const updatePartOneQuestion = async (id: number, params: FormData) => {
  const URL = `${endpoints.question.part1}/${id}`;
  const res = await axios.put(URL, params, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res;
};

export const getDetailPartTwoQuestion = async (id: number) => {
  const URL = `${endpoints.question.part2}/${id}`;
  const res = await axios.get(URL);
  return res;
};

export const createPartTwoQuestion = async (params: FormData) => {
  const URL = `${endpoints.question.part2}`;
  const res = await axios.post(URL, params, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res;
};

export const updatePartTwoQuestion = async (id: number, params: FormData) => {
  const URL = `${endpoints.question.part2}/${id}`;
  const res = await axios.put(URL, params, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res;
};

export const createPart34Question = async (params: FormData) => {
  const URL = `${endpoints.question.part34}`;
  const res = await axios.post(URL, params, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res;
};

export const updatePart34Question = async (id: number, params: FormData) => {
  const URL = `${endpoints.question.part34}/${id}`;
  const res = await axios.put(URL, params, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res;
};

export const getDetailsGroup = async (id: number) => {
  const URL = `${endpoints.question.part34}/${id}`;
  const res = await axios.get(URL);
  return res;
};

export const getAllGroups = async ({
  page = 1,
  size = 100,
  tagId,
  type,
  sortField = "",
  sortDirection = "asc",
}: FetchQuestionsParams = {}): Promise<PaginatedResult<IGroupResponseItem>> => {
  let URL = `${endpoints.question.part34}?page=${page}&size=${size}`;

  if (tagId !== undefined) {
    URL += `&tagId=${tagId}`;
  }

  if (type) {
    URL += `&type=${type}`;
  }

  if (sortField) {
    URL += `&sort=${sortField},${sortDirection}`;
  }

  try {
    const response = await axios.get<
      ApiResponse<PaginatedResult<IGroupResponseItem>>
    >(URL);

    return response.data.data;
  } catch (error) {
    console.error("Error fetching questions:", error);
    throw error;
  }
};

export const deleteGroup = async (id: number) => {
  const URL = `${endpoints.question.part34}/${id}`;
  const res = await axios.delete(URL);
  return res;
};

export const checkGroupAnswer = async (id: number) => {
  const URL = `${endpoints.question.part34}/${id}/correct-ans`;
  const res = await axios.get(URL);
  return res;
};
