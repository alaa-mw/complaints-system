import { useMutation } from "@tanstack/react-query";
import APIClient, { FetchResponse } from "../services/api-client";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const useSendData = <TData> ( endpoint: string , data?: unknown ) => {
    const apiClient = new APIClient<TData>(endpoint); 
    return useMutation<FetchResponse<TData>, Error, typeof data>({
      mutationFn: (bodyData? ) => {
        console.log("mutate",bodyData);
        return  apiClient.post(
          bodyData
        );
      },
     });
  };    

export default useSendData;

// FetchResponse<TData> = Success response type

// Error = Error type

// typeof data = The type of the mutation input (inferred from the data parameter)