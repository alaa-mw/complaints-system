import axios, { AxiosRequestConfig, AxiosError} from "axios";
// import { logoutSuccess } from "../features/auth/Redux/authSlice";
// import store from "../store";
// export const baseUrl =  "http://127.0.0.1:8000/";

export const baseUrl =  "https://complaint-app-gvhv.onrender.com";
const baseAxios = axios.create({
  baseURL:"/api",
  
  headers: {
    'Content-Type': 'application/json',
  },
  // +"api",
});


// baseAxios.interceptors.response.use(
//   (response: AxiosResponse) => response,
//   (error: AxiosError) => {
//     if (error.response?.status === 401) {
//       store.dispatch(logoutSuccess());  // logout when token expired
//     }
//     return Promise.reject(error);
//   }
// );


baseAxios.interceptors.request.use((config) => {
  // config.baseURL = getDynamicBaseURL();
  const token = localStorage.getItem("authToken");
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

  private request = <TData>(config: AxiosRequestConfig) => {
    return baseAxios
      .request<FetchResponse<TData>>(config)
      .then((res) => res.data) // not res
      .catch((error: AxiosError) => {
        console.error("API Error:", error.response?.data || error.message);
        return Promise.reject(error.response?.data || error);
      });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get = (queryParams:Record<string ,any>  = {}) => {
    const params = new URLSearchParams();
    // console.log("params",params);

    for (const key in queryParams) {
      if (queryParams[key] !== undefined) {
        params.append(key, queryParams[key]);
      }
    }
    // console.log("paramsAfter",params);

    const queryString = params.toString();
    // console.log("queryString",queryString);

    return this.request<T>({ method: "GET",
       url: queryString ? `${this.endpoint}?${queryString}` : this.endpoint })
  };

  post = (data?: unknown) =>
    this.request<T>({
      method: "POST",
      url: this.endpoint, 
      // responseType: 'blob', // important
      data,
      headers: { "Content-Type": "multipart/form-data" },
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
