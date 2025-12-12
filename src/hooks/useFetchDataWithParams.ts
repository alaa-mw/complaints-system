/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import APIClient, { FetchResponse } from "../services/api-client";

export const useFetchDataWithParams = <TData>(
  endpoint: string,
  initialQueryParams: Record<string, any> = {}
) => {
  const [queryParams, setQueryParams] = useState<Record<string, any>>(initialQueryParams);
  const apiClient = new APIClient<TData>(endpoint);

  const query = useQuery<FetchResponse<TData>, Error>({
    queryKey: [endpoint, queryParams],
    queryFn: () => apiClient.get(queryParams),
    keepPreviousData: true,
  });

  return {
    data: query.data as FetchResponse<TData> | undefined,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    queryParams,
    setQueryParams,
  };
};

export default useFetchDataWithParams;

