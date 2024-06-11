const {createAxiosSession} = require('../src/index')

const session = createAxiosSession()
// console.log(session.jar)

session.get('https://baidu.com', {
  maxRedirects: 2
}).then(res => {
  // console.log(res)
  session.deleteCookie('https://baidu.com', 'BAIDUID_BFESS')
  session.deleteCookie('https://baidu.com', 'BAIDUID')
  console.log(session.jar.getCookies('https://baidu.com'));
})



