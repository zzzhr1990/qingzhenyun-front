const ApiException = require('../exception/api_exception')
class ResponseUtil {
    static Ok(req, res, data) {
        res.json({ status: 200, result: data, code: "OK", success: true })
    }

    static OkOrError(req, res, error, data) {
        if (error) {
            console.error(error)
            throw new ApiException('Internal Server Error', undefined, undefined, false)
        }
        res.json({ status: 200, result: data, code: "OK", success: true })
    }
}
module.exports = ResponseUtil