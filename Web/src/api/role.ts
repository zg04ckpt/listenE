import axios from "../utils/axios";
import { endpoints } from "../utils/axios";

export async function getAllRoles() {
  const URL = `${endpoints.user.listRoles}`;
  const res = await axios.get(URL);
  return res;
}

export async function asignRoles(roles: string[], userId: number) {
  const URL = `${endpoints.user.asignRoles(userId)}`;
  const res = await axios.put(URL, { roles });
  return res;
}
