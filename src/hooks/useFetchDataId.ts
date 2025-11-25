import { useQuery } from "@tanstack/react-query";
import APIClient, { FetchResponse } from "../services/api-client";


export const useFetchDataId = <TData>(
    endpoint: string,
    id?: string
) => {
    const apiClient = new APIClient<TData>(endpoint); 
    // console.log("fetchId",id) 
    return useQuery<FetchResponse<TData>, Error>({
        queryKey: [endpoint, id], 
        queryFn: apiClient.get,
        enabled: !!id, // Only enable the query if id is truthy
    });
};


export default useFetchDataId;