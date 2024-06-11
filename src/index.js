const axios = require('axios')
const userAgents = require("random-useragent")
const {CookieJar} = require('tough-cookie')
const {HttpsProxyAgent} = require("https-proxy-agent")
const axiosRetry = require("axios-retry").default

const setCookieParser = require("set-cookie-parser")

exports.createAxiosSession = function (opt = {}) {
  const {retries = 0, proxyString, retryCondition, retryDelay = () => 200} = opt
  const cookieJar = new CookieJar(void 0, void 0)
  let agent = {}
  if (opt.proxyString) {
    const proxyAgent = new HttpsProxyAgent(proxyString)
    agent = {
      httpAgent: proxyAgent,
      httpsAgent: proxyAgent,
    }
  }
  const service = axios.create({
    maxRedirects: 0,
    timeout: 10000,
    withCredentials: true,
    ...agent,
    ...opt,
  })

  Object.assign(service.defaults.headers, {
    "User-Agent": userAgents.getRandom(),
    "Cache-Control": "no-cache",
  })

  if (opt.proxyString) {
    try {
      const urls = new URL(opt.proxyString)
      service.defaults.headers["X-Real-IP"] = urls.hostname
    } catch (e) {
    }
  }
  service.jar = cookieJar

  const additionalCookie = (req) => {   /* 为请求添加上Cookie */
    const urls = new URL(req.url)
    const cookieDomain = urls.origin
    const recordCookie = cookieJar.getCookieStringSync(cookieDomain)
    const reqCookie = req.headers['Cookie'] || req.headers['cookie']
    const cookie = reqCookie ? `${recordCookie};${reqCookie}` : recordCookie // 追加历史获取的 cookie
    if (cookie) req.headers['Cookie'] = cookie
    // console.log(req.headers['Cookie'])
    return req
  }
  const saveCookie = async (res) => {   /* 保存Cookie */
    if (!res.headers?.['set-cookie']) return
    const setCookie = res.headers['set-cookie']
    const parsedCookies = setCookieParser.parse(setCookie)
    const urls = new URL(res.config.url)
    const cookieDomain = urls.origin
    parsedCookies.forEach(cookieItem => {
      // console.log(cookieItem)
      const domain = cookieItem.domain ? `${urls.protocol}//${cookieItem.domain}` : cookieDomain + (cookieItem.path || '')
      cookieJar.setCookieSync(`${cookieItem.name}=${cookieItem.value}`, domain)
    })  // 保存 cookie
    // console.log(cookieJar.getCookieStringSync(cookieDomain))
    // console.log('拦截器', res.status, res.config.url);
    return res
  }
  service.interceptors.request.use(
    (req) => {
      additionalCookie(req)
      return req
    },
    (err) => {
      return Promise.reject(err)
    }
  )
  service.interceptors.response.use(
    async (res) => {
      await saveCookie(res)
      return res
    },
    async (err) => {
      await saveCookie(err.response)
      return Promise.reject(err)
    })

  function getCookie(cookieDomain, name) {
    const parsedCookies = setCookieParser.parse(cookieJar.getSetCookieStringsSync(cookieDomain))
    return parsedCookies.find(item => item.name === name)
  }

  function setCookie(cookieDomain, name, data) {
    cookieJar.setCookieSync(`${name}=${data}`, cookieDomain)
  }

  function deleteCookie(cookieDomain, name) {
    const cookies = cookieJar.getCookiesSync(cookieDomain)
    const remainingCookies = cookies.filter(cookie => cookie.key !== name.trim());
    cookieJar.removeAllCookies(() => {
      remainingCookies.forEach(cookie => {
        cookieJar.setCookieSync(cookie.toString(), cookieDomain)
      });
    });
  }

  service.getCookie = getCookie
  service.setCookie = setCookie
  service.deleteCookie = deleteCookie

  axiosRetry(service, {             //传入axios实例
    retries,          // 设置自动发送请求次数
    shouldResetTimeout: true,       //  重置超时时间
    retryDelay,
    retryCondition,
  })
  return service
}
