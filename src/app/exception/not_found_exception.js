let ApiException = require('./api_exception')

class NotFoundException extends ApiException {
    constructor(message, code, supress) {
        let _code = code ? code : 'NOTFOUND_ERROR_ERROR'
        // this._status = status ? (typeof (status) == "number" ? status : 500) : 500
        // let _success = false
        // this._supress = supress == false ? false : true
        super(message, 404, _code, supress)
    }

}

module.exports = NotFoundException