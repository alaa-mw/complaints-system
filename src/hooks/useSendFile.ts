import { useMutation } from "@tanstack/react-query";
import APIClient, { FetchResponse } from "../services/api-client";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const useSendFile = <TData> ( endpoint: string , data?: unknown ) => {
    const apiClient = new APIClient<TData>(endpoint); 
    return useMutation<FetchResponse<TData>, Error, typeof data>({
      mutationFn: (bodyData? ) => {
        console.log("mutate",bodyData);
        return  apiClient.postBolob(
          bodyData
        );
      },
     });
  };    

export default useSendFile;