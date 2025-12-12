/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosRequestConfig, AxiosError} from "axios";
import TokenService from './tokenService';

export const baseUrl =  "http://127.0.0.1:3000";
// export const baseUrl =  "https://complaint-app-gvhv.onrender.com";
// export const baseUrl =  "https://d4ed84440d78.ngrok-free.app";
const baseAxios = axios.create({
  baseURL:"/api", // in vite.config : when see "/api" replace with correct link as proxy
  
  headers: {
    'Content-Type': 'application/json',
  },
  // +"api",
});


export const refreshAccessToken = async (): Promise<boolean> => {
  try {
    const refreshToken = TokenService.getRefreshToken();
    if (!refreshToken) return false;

    const response = await baseAxios.post<{
      accessToken: string;
      refreshToken: string;
    }>("/authentication/refresh-token", { refreshToken });

    TokenService.setTokens({
      accessToken: response.data.accessToken,
      refreshToken: response.data.refreshToken
    });

    return true;
  } catch (error) {
    console.log("Token refresh error:", error);
    TokenService.clearTokens();
    return false;
  }
};


// baseAxios.interceptors.response.use(
//   (response: AxiosResponse) => response,
//  async  (error: AxiosError) => {
//   const originalRequest = error.config;
//     console.log("originalRequest",originalRequest)
//     if (error.response?.status === 401 && originalRequest) {// token expired
//       console.log("---------401-----------");
//       // const refreshed = await refreshAccessToken();
      
//       // if (refreshed) {
//       //   // Retry the original request with new token
//       //   return baseAxios(originalRequest);
//       // } else {
//       //   // Redirect to login or handle auth failure
//       //   window.location.href = '/login';
//       // }
//     }
//     return Promise.reject(error);
//   }
// );


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
