import {AxiosResponseHeaders, InternalAxiosRequestConfig, RawAxiosResponseHeaders} from "axios";
import {AxiosSessionRequestConfig} from "./AxiosSessionRequestConfig";

export interface AxiosSessionResponse<T = any, D = any> {
  data: T;
  status: number;
  statusText: string;
  headers: RawAxiosResponseHeaders | AxiosResponseHeaders;
  config: InternalAxiosRequestConfig<D> & AxiosSessionRequestConfig;
  request?: any;
}
