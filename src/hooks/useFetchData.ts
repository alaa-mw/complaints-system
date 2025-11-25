import { useQuery } from "@tanstack/react-query";
import APIClient, { FetchResponse } from "../services/api-client";


export const useFetchData = <TData>(
  endpoint: string
) => {
  const apiClient = new APIClient<TData>(endpoint); // Create a new APIClient instance in the hook
  return useQuery<FetchResponse<TData>, Error>({
    queryKey: [endpoint],
    queryFn: apiClient.get,
  }
  );
};

export default useFetchData;
