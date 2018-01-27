const ApiException = require('../exception/api_exception')
const jwt = require('jsonwebtoken')
const Constants = require('../const/constants')
const Long = require('ice').Ice.Long
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
            let dat = req.user
            //console.log(dat)
            let auth = jwt.sign({
                'uuid': dat.uuid,
                'name': dat.name,
                'email': dat.email,
                'phone': dat.phone,
                'lastLoginTime': dat.lastLoginTime,
                'refreshTime': dat.refreshTime,
                'version': dat.version
            }, Constants.JWT_SECRET_KEY, { expiresIn: '30d' })
            res.header('Authorization', 'Bearer ' + auth);
            if (data) {
                data['token'] = auth
            } else {
                data = { 'token': auth }
            }
        }
        res.json(ResponseUtil.preProcessObject(data))
    }

    static isObj(obj) { return typeof obj === 'object' && obj !== null }

    static needConvert(obj) {
        //const keys = Object.keys(obj)
        //if (keys.includes('high') && keys.includes('low')) {
        //const Constants = require('../const/constants')
        //
        // return false
        //}
        return typeof (obj)['high'] === 'number' && typeof (obj)['low'] === 'number'
    }

    static long2Number(obj) {
        return (new Long(obj['high'], obj['low'])).toNumber()
    }

    static preProcessObject(obj) {
        if (!ResponseUtil.isObj(obj)) return obj
        if (ResponseUtil.needConvert(obj)) {
            return ResponseUtil.long2Number(obj)
        }
        for (let key of Object.keys(obj)) {
            let value = obj[key]
            if (ResponseUtil.isObj(value)) {
                //
                if (ResponseUtil.needConvert(value)) {
                    obj[key] = ResponseUtil.long2Number(value)
                }
                else {
                    obj[key] = ResponseUtil.preProcessObject(value)
                }
            }
        }
        return obj
    }

    /*
    static preProcessObject(obj) {
        //
        if (typeof (obj) == 'object') {
            if (typeof (obj['toNumber']) == 'function') {
                return obj.toNumber()
            }
            // Foreach
        }
        return onk
    }
    */
}
module.exports = ResponseUtil