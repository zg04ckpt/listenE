import { HOST_API } from "../config-global";

export function getFileUrl(url: string | undefined) {
  if (!url) return "";

  const baseUrl = HOST_API;

  return `${baseUrl}/${url}`;
}
