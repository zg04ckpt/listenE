import { IPostUpdateTrackItem } from "./../types/track";
import axios from "../utils/axios";
import { endpoints } from "../utils/axios";
import { FetchTracksParams } from "./../types/track";
import { PaginatedResult } from "../types/page";
import { ApiResponse } from "../types/api";
import { ITrackResponseItem } from "./../types/track";

export async function deleteTrack(trackId: number) {
  const URL = `${endpoints.track.root}/${trackId}`;
  const response = await axios.delete(URL);
  return response;
}

export async function getDetailsTrack(trackId: number) {
  const URL = `${endpoints.track.root}/${trackId}`;
  const response = axios.get(URL);
  return response;
}

export async function updateTrack(trackId: number, data: IPostUpdateTrackItem) {
  const URL = `${endpoints.track.root}/${trackId}`;
  const response = await axios.put(URL, data);
  return response;
}

export async function createTrack(params: FormData) {
  const URL = `${endpoints.track.root}`;
  const response = await axios.post(URL, params, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response;
}

export const getAllTracks = async ({
  page = 1,
  size = 10,
  name = "",
  sortField = "",
  sortDirection = "asc",
}: FetchTracksParams = {}): Promise<PaginatedResult<ITrackResponseItem>> => {
  let URL = `${endpoints.track.root}?page=${page}&size=${size}`;

  if (name) {
    URL += `&name=${name}`;
  }

  if (sortField) {
    URL += `&sort=${sortField},${sortDirection}`;
  }

  try {
    const response = await axios.get<
      ApiResponse<PaginatedResult<ITrackResponseItem>>
    >(URL);

    return response.data.data;
  } catch (error) {
    console.error("Error fetching questions:", error);
    throw error;
  }
};
