/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosRequestConfig, AxiosError, AxiosResponse} from "axios";
import TokenService from './tokenService';

// export const baseUrl =  "http://127.0.0.1:3000";
// export const baseUrl =  "https://complaint-app-gvhv.onrender.com";
export const baseUrl =  "https://eaa36598ecff.ngrok-free.app/";
const baseAxios = axios.create({
  baseURL:"/api", // in vite.config : when see "/api" replace with correct link as proxy
  
  headers: {
    'Content-Type': 'application/json',
  },
  // +"api",
});


// export const refreshAccessToken = async (): Promise<string|null> => {
//   try {
//     const refreshToken = TokenService.getRefreshToken();
//     // if (!refreshToken) return false;

//     const response = await baseAxios.post<{
//       accessToken: string;
//       refreshToken: string;
//     }>("/authentication/refresh-token", { refreshToken }).then(response =>{
//         TokenService.setTokens({
//           accessToken: response.data.accessToken,
//           refreshToken: response.data.refreshToken
//       });
//       return response.data.accessToken;
//     });

//     return null ;
//   } catch (error) {
//     console.log("Token refresh error:", error);
//     TokenService.clearTokens();
//     return null;
//   }
// };


baseAxios.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;
    console.log("originalRequest", originalRequest);

    // Do not attempt refresh for refresh-token endpoint itself
    const isRefreshEndpoint = originalRequest?.url?.includes("/authentication/refresh-token");

    const MAX_REFRESH_RETRIES = 1; // limit retry attempts

    if (error.response?.status === 401 && originalRequest && !isRefreshEndpoint) {
      console.log("---------401-----------");

      originalRequest._retryCount = originalRequest._retryCount ?? 0;
      if (originalRequest._retryCount >= MAX_REFRESH_RETRIES) {
        console.warn("Max token refresh retries exceeded");;
        return Promise.reject(error);
      }

      originalRequest._retryCount += 1;

      const refreshToken = TokenService.getRefreshToken();
      baseAxios.post<{
        data: {
        accessToken: string;
        refreshToken: string;
      }
      }>("/authentication/refresh-token", { refreshToken }).then(response =>{
          TokenService.setTokens({
            accessToken: response.data.data.accessToken,
            refreshToken: response.data.data.refreshToken
        });
      });

      const acceccToken = TokenService.getAccessToken();
      console.log("**new access token:", acceccToken);
      if (acceccToken) {
          originalRequest.headers = originalRequest.headers || {};
          originalRequest.headers.Authorization = `Bearer ${acceccToken}`;
        
        return baseAxios(originalRequest);
      } else {
        // Token refresh failed - clear tokens and let caller handle (e.g., redirect to login)
        TokenService.clearTokens();
      }
    }

    return Promise.reject(error);
  }
);


baseAxios.interceptors.request.use((config) => {
  // config.baseURL = getDynamicBaseURL();
  const token = TokenService.getAccessToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
    config.headers['ngrok-skip-browser-warning'] = 'true';
  }
  return config;
});

export interface FetchResponse<T> {
  message: string;
  data: T;
}

class APIClient<T> {
  endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

    private buildUrl = (queryParams: Record<string, any> | undefined) => {
    console.log("queryParams--",queryParams);
    if (!queryParams || Object.keys(queryParams).length === 0) return this.endpoint;
    const params = new URLSearchParams();
    for (const key in queryParams) {
      const val = queryParams[key];
      if (val !== undefined && val !== null) params.append(key, String(val));
    }
    const qs = params.toString();
    console.log("qs--",qs);
    return qs ? `${this.endpoint}?${qs}` : this.endpoint;
  };
  
  private request = <TData>(config: AxiosRequestConfig) => {
    return baseAxios
      .request<FetchResponse<TData>>(config)
      .then((res) => res.data) // not res
      .catch((error: AxiosError) => {
        console.error("API Error:", error.response?.data || error.message);
        return Promise.reject(error.response?.data || error);
      });
  };

  get = (queryParams:Record<string ,any>  = {}) => {
    console.log("get with params",this.buildUrl(queryParams));
    return this.request<T>({ method: "GET",
        url: this.buildUrl(queryParams) })
  };

  post = (data?: unknown) =>
    this.request<T>({
      method: "POST",
      url: this.endpoint, 
      data,
      headers: {  "Content-Type": "application/json" },
    });

  postWithParams = (data?: unknown, queryParams?: Record<string, any>) =>
    this.request<T>({
      method: "POST",
      url: this.buildUrl(queryParams),
      data,
      headers: { "Content-Type": "application/json" },
    });

  postNoToken = (data?: unknown) =>
    this.request<T>({
      method: "POST",
      url: this.endpoint,
      data,
      headers: {  Authorization: undefined },
    });

  postBolob = (data?: unknown) =>
    this.request<T>({
      method: "POST",
      url: this.endpoint, 
      responseType: 'blob', // important
      data,
      headers: { "Content-Type": "multipart/form-data" },
    });
    
  delete = (id:string) =>{
    return this.request<T>({ method: "DELETE", url: `${this.endpoint}/${id}`})
  }

  deleteWithBody = (data?: unknown) =>{
    return this.request<T>({ method: "DELETE", url: `${this.endpoint}`, data  })
  }
  // PATCH method
  patch = (data?: unknown) =>
    this.request<T>({
      method: "PATCH",
      url: this.endpoint, 
      data,
      headers: { "Content-Type": "application/json", },
    });
}

export default APIClient;
