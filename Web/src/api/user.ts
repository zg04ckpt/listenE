import axios from "../utils/axios";
import { endpoints } from "../utils/axios";
import { PaginatedResult } from "../types/page";
import { IUserResponseItem, FetchUsersParams } from "../types/user";
import { ApiResponse } from "../types/api";

export const getAllUsers = async ({
  page = 1,
  size = 10,
  email = "",
  sortField = "",
  sortDirection = "asc",
}: FetchUsersParams = {}): Promise<PaginatedResult<IUserResponseItem>> => {
  let URL = `${endpoints.user.listResponse}?page=${page}&size=${size}`;

  if (email) URL += `&email=${email}`;

  if (sortField) {
    const apiSortField = sortField === "fullName" ? "firstName" : sortField;
    URL += `&sort=${apiSortField},${sortDirection}`;
  }

  try {
    const response = await axios.get<
      ApiResponse<PaginatedResult<IUserResponseItem>>
    >(URL);
    const paginatedResult = response.data.data;

    if (sortField === "fullName" && !URL.includes("&sort=firstName")) {
      const sortedItems = [...paginatedResult.items];
      sortedItems.sort((a, b) => {
        const aFullName = `${a.firstName} ${a.lastName}`;
        const bFullName = `${b.firstName} ${b.lastName}`;

        return sortDirection === "asc"
          ? aFullName.localeCompare(bFullName)
          : bFullName.localeCompare(aFullName);
      });

      return {
        ...paginatedResult,
        items: sortedItems,
      };
    }

    return paginatedResult;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const deleteUser = async () => {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, 1000);
  });
};

export const getUserProfile = async () => {
  const URL = `${endpoints.user.profile}`;
  const res = await axios.get(URL);
  return res;
};
