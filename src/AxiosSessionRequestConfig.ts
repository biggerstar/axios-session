import {AxiosError, AxiosRequestConfig} from "axios";

declare interface AxiosSessionRequestOptions {
  retries: number
  /** 如果传入 proxyString 会自动使用过理, 支持 http https sock5 */
  proxyString?: string
  /** 是否保持 session  */
  keepSession: boolean
  /** 是否自动添加随机 UA 字符串  */
  autoUserAgent: boolean

  /** 重试条件 */
  retryCondition?(err: AxiosError): boolean

  retryDelay: () => number
}

export declare interface AxiosSessionRequestConfig<D = {}> extends AxiosSessionRequestOptions, AxiosRequestConfig<D> {

}
