import { useMutation, UseMutationResult } from "@tanstack/react-query";
import APIClient, { FetchResponse } from "../services/api-client";

export const useDeleteData = <TData, TVariables = unknown>(endpoint: string): UseMutationResult<FetchResponse<TData>, Error, TVariables> => {
  const apiClient = new APIClient<TData>(endpoint);
  return useMutation<FetchResponse<TData>, Error, TVariables>({
    mutationFn: (body?: TVariables) => {
      return apiClient.deleteWithBody(body);
    },
  });
};

export default useDeleteData;