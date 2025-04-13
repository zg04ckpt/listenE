import axios from "../utils/axios";
import { endpoints } from "../utils/axios";
import { PaginatedResult } from "../types/page";
import { ISessionItem, FetchSessionsParams } from "../types/session";
import { ApiResponse } from "../types/api";

export async function createSessionTrack(sessionId: number, params: FormData) {
  const URL = `${endpoints.session.createTrack(sessionId)}`;
  const response = await axios.post(URL, params, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response;
}

export async function getListSessionTracks(sessonId: number) {
  const URL = `${endpoints.session.listTrack(sessonId)}`;
  const response = await axios.get(URL);
  return response;
}

export async function getDetailsSession(sessionId: number) {
  const URL = `${endpoints.session.root}/${sessionId}`;
  const response = await axios.get(URL);
  return response;
}

export const getAllSessions = async ({
  page = 1,
  size = 10,
  key = "",
  topicId = "",
  sortField = "",
  sortDirection = "asc",
}: FetchSessionsParams = {}): Promise<PaginatedResult<ISessionItem>> => {
  let URL = `${endpoints.session.root}?page=${page}&size=${size}`;

  if (key) {
    URL += `&key=${encodeURIComponent(key)}`;
  }

  if (topicId !== "") {
    URL += `&topicId=${topicId}`;
  }

  if (sortField) {
    URL += `&sort=${sortField},${sortDirection}`;
  }

  const response = await axios.get<ApiResponse<PaginatedResult<ISessionItem>>>(
    URL
  );

  const paginatedResult = response.data.data;

  const sortedItems = [...paginatedResult.items];

  if (sortField && !URL.includes("&sort=")) {
    sortedItems.sort((a, b) => {
      const aValue = a[sortField as keyof ISessionItem];
      const bValue = b[sortField as keyof ISessionItem];

      if (aValue === undefined || bValue === undefined) return 0;

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return sortDirection === "asc"
        ? (aValue as number) - (bValue as number)
        : (bValue as number) - (aValue as number);
    });

    return {
      ...paginatedResult,
      items: sortedItems,
    };
  }

  return paginatedResult;
};
