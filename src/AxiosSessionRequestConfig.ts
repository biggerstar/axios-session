import {AxiosError, AxiosRequestConfig} from "axios";

export declare interface AxiosSessionRequestOptions {
  [key: string]: any
  /**
   * 如果传入 proxyString 会自动使用过理, 支持 http https sock5
   * @default void
   * */
  proxyString?: string

  /** 是否保持 session
   * @default true
   * */

  keepSession: boolean
  /** 是否自动添加随机 UA 字符串
   * @default false
   * */

  autoUserAgent: boolean

  /**
   * 重试次数
   * @default 0
   * */
  retries: number

  /**
   * 重试条件
   * @default void
   * */
  retryCondition?(err: AxiosError): boolean

  /**
   * 进行重试的间隔
   * @default ()=> 0
   * */
  retryDelay: () => number

  /**
   * 可以为该请求添加上一些附加数据， 可以在 then 和 catch 回调的 request 对象上取回该数据
   * @default {}
   * */
  meta: Record<any, any>
}

export declare interface AxiosSessionRequestConfig<D = {}> extends AxiosSessionRequestOptions, AxiosRequestConfig<D> {

}
