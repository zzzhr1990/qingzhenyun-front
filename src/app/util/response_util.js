const ApiException = require('../exception/api_exception')
class ResponseUtil {
    static Ok(req, res, data) {
        res.json({ status: 200, result: data, code: "OK", success: true })
    }

    static OkOrError(req, res, error, data) {
        if (error) {
            //console.error(error)
            //throw new ApiException('Internal Server Error', undefined, undefined, false)
            ResponseUtil.Error(req, res, error)
            return
        }
        res.json({ status: 200, result: data, code: "OK", success: true })
    }

    static Error(req, res, error) {
        if (error) {
            console.error(error)
        }
        res.status(500)
        res.json({ status: 500, code: "INTERAL_ERROR", success: false })
        //throw new ApiException('Internal Server Error', undefined, undefined, false)
        //res.json({ status: 200, result: data, code: "OK", success: true })
    }

    static ApiError(req, res, err) {
        if (!err) {
            ResponseUtil.Error(req, res, err)
            return
        }
        if (!err["supress"]) {
            console.error(err.stack)
        }
        let status = err.status || 500
        res.status(status)
        let data = { success: false, message: err.message }
        if (err['code']) {
            data.code = err["code"]
        } else {
            data.code = 'INTERNAL_SERVER_ERROR'
        }
        data.status = status
        res.json(data)
        //throw new ApiException('Internal Server Error', undefined, undefined, false)
        //res.json({ status: 200, result: data, code: "OK", success: true })
    }
}
module.exports = ResponseUtil