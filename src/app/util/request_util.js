class RequestUtil {
    static getIp(req) {
        return req.headers['x-real-ip'] || req.connection.remoteAddress
    }
}
module.exports = RequestUtil