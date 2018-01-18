const ApiException = require('../exception/api_exception')
const jwt = require('jsonwebtoken')
const Constants = require('../const/constants')
class ResponseUtil {
    static Ok(req, res, data) {
        ResponseUtil.json(req, res, { status: 200, result: data, code: "OK", success: true })
    }

    static OkOrError(req, res, error, data) {
        if (error) {
            //console.error(error)
            //throw new ApiException('Internal Server Error', undefined, undefined, false)
            ResponseUtil.Error(req, res, error)
            return
        }
        ResponseUtil.json(req, res, { status: 200, result: data, code: "OK", success: true })
    }

    static Error(req, res, error) {
        if (error) {
            console.error(error)
        }
        res.status(500)
        ResponseUtil.json(req, res, { status: 500, code: "INTERAL_ERROR", success: false })
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
        ResponseUtil.json(req, res, data)
        //throw new ApiException('Internal Server Error', undefined, undefined, false)
        //res.json({ status: 200, result: data, code: "OK", success: true })
    }

    static json(req, res, data) {
        if (req.user) {
            //Sign And put
            dat = res.user
            auth = jwt.sign({
                'uuid': dat.uuid,
                'name': dat.name,
                'email': dat.email,
                'phone': dat.phone,
                'lastLoginTime': dat.lastLoginTime,
                'refreshTime': dat.refreshTime
            }, Constants.JWT_SECRET_KEY, { expiresIn: '7d' })
            res.header('Authorization', auth);
            if (data) {
                data['authorization'] = auth
            } else {
                data = { 'authorization': auth }
            }
        }
        res.json(data)
    }
}
module.exports = ResponseUtil