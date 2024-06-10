const {createAxiosSession} = require('../src/index')

const session = createAxiosSession()
console.log(session.jar)




