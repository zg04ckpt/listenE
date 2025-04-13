import axios from "../utils/axios";
import { ITrackItem } from "../types/track";
import { endpoints } from "../utils/axios";

export async function updateOrCreateTrack(
  params: ITrackItem,
  isDelete: boolean = false
) {
  if (params.id) {
    // delete
    if (isDelete) {
      const URL = `${endpoints.track.delete(params.id)}`;
      const res = await axios.delete(URL);
      return res;
    }
    // update
    const URL = `${endpoints.track.update(params.id)}`;
    const response = await axios.put(URL, params);
    return response;
  }
}

export async function getDetailsTrack(trackId: number) {
  const URL = `${endpoints.track.root}/${trackId}`;
  const response = axios.get(URL);
  return response;
}
