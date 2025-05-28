import axios from "../utils/axios";
import { endpoints } from "../utils/axios";
import { ITagItem } from "../types/tag";
import { FetchTagsParams } from "../types/tag";
import { PaginatedResult } from "../types/page";
import { ApiResponse } from "../types/api";

export const getAllTags = async ({
  page = 1,
  size = 100,
  type,
  name = "",
  sortField = "",
  sortDirection = "asc",
}: FetchTagsParams = {}): Promise<PaginatedResult<ITagItem>> => {
  let URL = `${endpoints.tag.root}?page=${page}&size=${size}`;

  if (type) {
    URL += `&type=${type}`;
  }

  if (name) {
    URL += `&name=${name}`;
  }

  if (size) {
    URL += `&size=${size}`;
  }

  // Add sorting if provided
  if (sortField) {
    URL += `&sort=${sortField},${sortDirection}`;
  }

  try {
    const response = await axios.get<ApiResponse<PaginatedResult<ITagItem>>>(
      URL
    );

    return response.data.data;
  } catch (error) {
    console.error("Error fetching questions:", error);
    throw error;
  }
};
export const bulkCreateTag = async (type: string, tags: string[]) => {
  const URL = `${endpoints.tag.root}`;
  const res = await axios.post(URL, { type, tags });
  return res;
};

export const updateTag = async (id: number, name: string, type: string) => {
  const URL = `${endpoints.tag.root}/${id}`;
  const res = await axios.put(URL, { name, type });
  return res;
};

export const bulkDeleteTag = async (tagIds: number[]) => {
  const URL = `${endpoints.tag.root}`;
  const res = await axios.delete(URL, { data: { tagIds } });
  return res;
};
