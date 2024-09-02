import {createAxiosSession} from "../src";

const session = createAxiosSession({
  autoUserAgent: true,
  keepSession: true
})

const topHost = '//baidu.com'
const subHost = 'https://www.baidu.com'
// session.jar.setCookie('topHost=1111111; Domain=baidu.com;', topHost).then()
// session.jar.setCookie('subHost=2222222;Max-Age=31536000; Domain=baidu.com;', subHost).then()

session.request({
  url: topHost,
  // proxyString: 'https://100.200.1.0:20100',
  maxRedirects: 1,
  // keepSession: false,
}).then(res => {
  // console.log(res)
  // session.deleteCookie('https://baidu.com', 'BAIDUID_BFESS')
  // session.deleteCookie('https://baidu.com', 'BAIDUID')
  // console.log(session.jar.store)
  console.log(session.jar.getCookies('https://www.baidu.com'));
  console.log(session.jar.getCookies('https://baidu.com'));
  // session.get(topHost, {
  //   maxRedirects: 2,
  //   headers: {
  //     cookie: 'subHost=3333333'
  //   }
  // })
})
console.log(session)
