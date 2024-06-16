import {AxiosSessionRequestConfig} from "./AxiosSessionRequestConfig";
import {AxiosSessionInstance} from "./AxiosSessionInstance";

export * from "./AxiosSessionInstance";
export * from "./AxiosSessionRequestConfig";
export * from "./AxiosSessionResponse";
export * from "./AxiosSessionError";

/**
 * 模拟浏览器持久 cookie 访问
 * */
export function createAxiosSession(opt?: Partial<AxiosSessionRequestConfig>): AxiosSessionInstance {
  return new AxiosSessionInstance(opt)
}
