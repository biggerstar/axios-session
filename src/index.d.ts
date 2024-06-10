export type AxiosSessionOptions = {
  retries?: number
  /** 如果传入 proxyString 会自动使用过理, 支持 http https sock5 */
  proxyString?: string
  /** 重试条件 */
  retryCondition?(err: import('axios').AxiosError): boolean
  retryDelay?(): number
} & import('axios').AxiosRequestConfig & Record<any, any>

export type AxiosSessionReturn = import('axios').AxiosInstance & {
  /** jar tough-cookie 实例 */
  jar: import('tough-cookie').CookieJar,
  /** 获取 cookie 内容 */
  getCookie?(cookieDomain: string, name: string): void
}

/**
 * 模拟浏览器持久 cookie 访问
 * */
export function createAxiosSession(options: AxiosSessionOptions): AxiosSessionReturn;
