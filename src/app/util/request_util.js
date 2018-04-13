const ApiException = require('../exception/api_exception')
const REG_MOBILE_CLIENT = /CFNetwork|okhttp/i

class RequestUtil {
    static getIp(req) {
        return req.headers['x-real-ip'] || req.connection.remoteAddress
    }

    static isMobile(req){
        let ua = req.headers['user-agent']
        return REG_MOBILE_CLIENT.test(ua)
    }

    static getToken(req) {
        let pre = req.headers.authorization ? req.headers.authorization : (req.headers.Authorization ? req.headers.Authorization : undefined)
        if (pre) {
            let parts = pre.split(' ')
            if (parts.length == 2) {
                var scheme = parts[0]
                var credentials = parts[1]
                if (/^Bearer$/i.test(scheme)) {
                    return credentials
                } else {
                    throw new ApiException('Format is Authorization: Bearer [token]', 401, 'BEARER_AUTHORIZATION_HEADER_INVALID')
                }
            } else {
                return undefined
            }
        }
        if (req.query && req.query.auth) {
            return req.query.auth
        }
        if (req.query && req.query.token) {
            return req.query.token
        }
        return undefined
    }
}
module.exports = RequestUtil