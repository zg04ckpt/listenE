import axios from "../utils/axios";
import { endpoints } from "../utils/axios";

export async function checkingSegment(segmentId: number, content: string) {
  const URL = `${endpoints.segment.checking(segmentId)}`;
  const response = await axios.post(URL, { content });
  return response;
}
