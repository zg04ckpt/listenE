import { HOST_API } from "../config-global";

export function getFileUrl(url: string | undefined) {
  if (!url) return "";

  // Lấy URL base từ biến môi trường
  const baseUrl = HOST_API;

  // Tạo URL đầy đủ
  return `${baseUrl}/${url}`;
}
