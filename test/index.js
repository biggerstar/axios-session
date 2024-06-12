const {createAxiosSession} = require('../src/index')

const session = createAxiosSession()

const topHost = 'https://baidu.com'
const subHost = 'https://www.baidu.com'
session.jar.setCookie('topHost=1111111; Domain=baidu.com;', topHost).then()
session.jar.setCookie('subHost=2222222;Max-Age=31536000; Domain=baidu.com;', subHost).then()

session.get('https://www.mafengwo.cn', {
  maxRedirects: 2
}).then(res => {
  // console.log(res)
  // session.deleteCookie('https://baidu.com', 'BAIDUID_BFESS')
  // session.deleteCookie('https://baidu.com', 'BAIDUID')
  // console.log(session.jar.store)
  // console.log(session.jar.getCookies('https://www.baidu.com'));
  // console.log(session.jar.getCookies('https://baidu.com'));
  session.get('https://www.baidu.com/s?tn=68018901_3_dg&ie=UTF-8&wd=cookie%20%E4%BD%9C%E7%94%A8%E5%9F%9F', {
    maxRedirects: 2,
    headers: {
      cookie: 'subHost=3333333'
    }
  })
})

