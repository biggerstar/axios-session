// noinspection JSUnusedGlobalSymbols

import {CookieJar} from "tough-cookie";
import setCookieParser, {Cookie} from "set-cookie-parser";
import UserAgent from "user-agents";
import axios, {AxiosInstance} from "axios";
import axiosRetry from "axios-retry";
import {HttpsProxyAgent} from "https-proxy-agent";
import {AxiosSessionRequestConfig} from "./AxiosSessionRequestConfig";
import {AxiosSessionResponse} from "./AxiosSessionResponse";
import {uuidv7} from 'uuidv7'

export class AxiosSessionInstance {
  /*--------------axios 实例的引用, 白名单模式-------------------*/
  /** 代理 axios 的 全局默认配置 */
  public defaults: AxiosInstance['defaults']
  public request: <T = any, R = AxiosSessionResponse<T>, D = any>(config: Partial<AxiosSessionRequestConfig<D>>) => Promise<R>;
  public setAxiosDefaults: (config: Partial<AxiosSessionRequestConfig>) => void
  public interceptors: AxiosInstance['interceptors']
  /*-----------------------------------------*/
  /** jar tough-cookie 实例 */
  public jar: CookieJar
  public sessionId: string

  constructor(opt: Partial<AxiosSessionRequestConfig> = {}) {
    const cookieJar = new CookieJar(void 0, void 0)
    this.jar = cookieJar
    const userAgent = new UserAgent();
    const service: AxiosSessionInstance = <any>axios.create({
      'axios-retry': {
        retries: 0,
        retryDelay: () => 0,
      },
      withCredentials: true,
      keepSession: true,
      ...opt || {},
    })
    Object.assign(service.defaults.headers, {
      "Cache-Control": "no-cache",
    })
    this.sessionId = uuidv7()
    this.interceptors = service.interceptors
    this.defaults = service.defaults
    this.request = service.request.bind(service)

    this.setAxiosDefaults = function (config) {
      Object.assign(service.defaults, config || {})
    }

    const additionalCookie = (req: AxiosSessionRequestConfig) => {   /* 为请求添加上Cookie */
      if (!req.keepSession) return req
      if (!req.url.startsWith('http') && req.url.startsWith('//')) req.url = `https:${req.url}`
      const urls = new URL(req.url, req.baseURL)
      const recordCookie = cookieJar.getCookieStringSync(urls.href)
      const reqCookie = req.headers['Cookie'] || req.headers['cookie']
      const cookie = reqCookie ? `${recordCookie};${reqCookie}` : recordCookie // 追加历史获取的 cookie
      if (cookie) req.headers['Cookie'] = cookie
      return req
    }
    const saveCookie = (res: AxiosSessionResponse) => {   /* 保存Cookie */
      if (!res?.config?.keepSession) return res
      if (!res?.headers?.['set-cookie']) return res
      const setCookie = res.headers['set-cookie'] || []
      setCookie.forEach(cookieStr => {
        const reqUrl = res.request?.['res']?.['responseUrl'] || res.config?.url
        try {
          cookieJar.setCookieSync(cookieStr, reqUrl)
        } catch (e) {
        }
      })
      return res
    }
    const patchRetry = (req: AxiosSessionRequestConfig) => {
      const axiosRetryConfig = service?.['axios-retry']
      if (!axiosRetryConfig) (axiosRetry['default'] || axiosRetry)(<any>service, req)
      Object.assign(axiosRetryConfig || {}, req)
    }
    const patchProxy = (req: AxiosSessionRequestConfig) => {
      // console.log(req)
      if (req.proxyString) {
        try {
          const urls = new URL(opt.proxyString)
          service.defaults.headers["X-Real-IP"] = urls.hostname
        } catch (e) {
        }
        const proxyAgent = new HttpsProxyAgent(req.proxyString)
        req.httpAgent = proxyAgent;
        req.httpsAgent = proxyAgent;
      }
    }

    function patchHeader(req: AxiosSessionRequestConfig) {
      if (req.autoUserAgent) req.headers["User-Agent"] = userAgent.toString()
    }

    function patchOther(req: AxiosSessionRequestConfig) {
      if (!req.meta || typeof req.meta !== 'object') req.meta = {}
    }

    service.interceptors.request.use(
      (req: any) => {
        additionalCookie(req)
        patchRetry(req)
        patchProxy(req)
        patchHeader(req)
        patchOther(req)
        return req
      },
      (err) => {
        return Promise.reject(err)
      }
    )
    service.interceptors.response.use(
      (res: AxiosSessionResponse) => {
        saveCookie(res)
        return res
      },
      (err) => {
        saveCookie(err.response)
        return Promise.reject(err)
      })
  }

  /** 通过 url 获取 cookie 内容 */
  public getCookie(url: string, name: string): Cookie {
    const parsedCookies = setCookieParser.parse(this.jar.getSetCookieStringsSync(url))
    return parsedCookies.find((item: Cookie) => item.name === name)
  }

  /** 通过 url 设置 cookie 内容 */
  public setCookie(url: string, name: string, data: any): void {
    this.jar.setCookieSync(`${name}=${data}`, url)

  }

  /** 通过 url 删除 cookie 内容 */
  public deleteCookie(url: string, name: string): void {
    const cookies = this.jar.getCookiesSync(url)
    const remainingCookies = cookies.filter(cookie => cookie.key !== name.trim());
    this.jar.removeAllCookies(() => {
      remainingCookies.forEach(cookie => {
        this.jar.setCookieSync(cookie.toString(), url)
      });
    });
  }

  public clearAllCookies() {
    this.jar.removeAllCookiesSync()
  }
}

