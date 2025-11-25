import { useQuery } from "@tanstack/react-query";
import APIClient, { FetchResponse } from "../services/api-client";
import { useCallback, useRef } from "react";

interface QueryParams {
  page?: number;
}

export const useLazyFetch = <TData>(endpoint: string, options = {}) => {
  const apiClient = useRef(new APIClient<TData>(endpoint)).current; //useRef: يضمن إنشاء الـ client مرة واحدة فقط (يحسن الأداء)
  const enabledRef = useRef(false);
  const paramsRef = useRef<QueryParams | undefined>();//حفظ آخر بارامترات مُستخدمة في الطلب.

  const query = useQuery<FetchResponse<TData>, Error>({
    queryKey: [endpoint, paramsRef.current],
    queryFn: () => apiClient.get(paramsRef.current),
    enabled: enabledRef.current,
    ...options
  });

  const fetchWithParams = useCallback((params?: QueryParams) => { //useCallback: يحفظ الدالة بين الريندرات (يقلل إعادة الإنشاء)
    paramsRef.current = params;
    enabledRef.current = true;
    return query.refetch();
  }, [query]);

  return {
    ...query,
    fetchWithParams
  };
};