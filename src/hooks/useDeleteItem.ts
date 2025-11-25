import { useMutation } from "@tanstack/react-query";
import APIClient from "../services/api-client";

export const useDeleteItem = <TData> ( endpoint: string) => {
    const apiClient = new APIClient<TData>(endpoint); 
    return useMutation({
      mutationFn: (id: string ) => {
        return  apiClient.delete(
          id
        );
      },
     });
  };    

export default useDeleteItem;