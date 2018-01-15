let ApiException = require('./api_exception')
class ApiValidateException extends ApiException {
    constructor(message, code, supress) {
        let _code = code ? code : "VALIDATE_ERROR_ERROR"
        // this._status = status ? (typeof (status) == "number" ? status : 500) : 500
        // let _success = false
        // this._supress = supress == false ? false : true
        super(message, 400, _code, supress)
    }
    get success() {
        return this._success
    }
    get code() {
        return this._code
    }
    get status() {
        return this._status
    }
    get supress() {
        return this._supress
    }

}

module.exports = ApiValidateException