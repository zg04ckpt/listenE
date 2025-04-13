import useSWR, { mutate } from "swr";
import { AxiosRequestConfig } from "axios";
import { useMemo, useCallback } from "react";

import axios, { fetcher, endpoints } from "../utils/axios";
import { stringifyRequestQuery } from "../utils/crud-helpers/crud-helper";
import {
  QueryState,
  BaseResponseWithPayload,
} from "../utils/crud-helpers/model";

import { IUserItem } from "../types/user";

// ----------------------------------------------------------------------

export function useGetUsers(queryStage: QueryState) {
  const URL = `${endpoints.user.list}?${stringifyRequestQuery(queryStage)}`;
  const config: AxiosRequestConfig = {
    method: "get",
  };

  const { data, isLoading, error, isValidating } = useSWR<
    BaseResponseWithPayload<IUserItem[]>
  >([URL, config], fetcher);
  const refetchUsers = useCallback(() => {
    mutate(
      [
        URL,
        {
          method: "get",
        },
      ],
      undefined,
      { revalidate: true }
    ); // Force re-fetch without using the cache
  }, [URL]);

  // Memoize the value to avoid unnecessary re-renders
  const memoizedValue = useMemo(() => {
    // Check if data is available and is of correct type
    const response = data as BaseResponseWithPayload<IUserItem[]>;
    return {
      users: response?.data ?? [], // Access the users from the response data
      usersLoading: isLoading, // Loading is true if no data and no error
      usersError: error, // Error object
      usersValidating: isValidating, // SWR validating status
      usersEmpty: !isValidating && !(response?.data?.length > 0), // Check if data is empty
      usersTotal: response?.payload?.pagination?.total ?? 0, // Access total from pagination
      refetchUsers,
    };
  }, [data, error, isLoading, isValidating, refetchUsers]);

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetUser(id: string) {
  const URL = id ? `${endpoints.user.details}/${id}` : "";
  const config: AxiosRequestConfig = {
    method: "get",
  };
  const { data, isLoading, error, isValidating } = useSWR(
    [URL, config],
    fetcher
  );

  const memoizedValue = useMemo(
    () => ({
      user: data as IUserItem,
      userLoading: isLoading,
      userError: error,
      userValidating: isValidating,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useSearchUsers(query: string) {
  const URL = query ? [endpoints.user.search, { params: { query } }] : "";

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher, {
    keepPreviousData: true,
  });

  const memoizedValue = useMemo(
    () => ({
      searchResults: (data?.results as IUserItem[]) || [],
      searchLoading: isLoading,
      searchError: error,
      searchValidating: isValidating,
      searchEmpty: !isLoading && !data?.results.length,
    }),
    [data?.results, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export async function updateOrCreateUser(
  params: IUserItem,
  isDelete: boolean = false
) {
  if (isDelete) {
    // delete
    const URL = `${endpoints.user.details}/${params.id}`;
    const res = await axios.delete(URL);
    return res;
  }

  if (params.id) {
    // update
    const URL = `${endpoints.user.details}/${params.id}`;
    const response = await axios.put(URL, params, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  }

  // add
  const res = await axios.post(endpoints.user.details, params);
  return res;
}
