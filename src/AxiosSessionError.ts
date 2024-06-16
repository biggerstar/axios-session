import {AxiosSessionRequestConfig} from "./AxiosSessionRequestConfig";
import {AxiosSessionResponse} from "./AxiosSessionResponse";

export interface AxiosSessionError<T = any, D = any> extends Error {
  config: AxiosSessionRequestConfig<D>;
  code?: string;
  request?: any;
  response?: AxiosSessionResponse<T, D>;
  isAxiosError: boolean;
  toJSON: () => object;
}
