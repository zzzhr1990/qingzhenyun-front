let express = require('express')
let Const = require('../../../const/constants')
let router = express.Router()
let ApiException = require('../../../exception/api_exception')
let ApiValidateException = require('../../../exception/api_validate_exception')
let ResponseUtil = require('../../../util/response_util')
let StringUtil = require('../../../util/string_util')
let validator = require('validator')
const RequestUtil = require('../../../util/request_util')
const randomstring = require("randomstring");
let userService = require('../../../const/rpc').userRpc

router.post('/register', async (req, res) => {
    try {
        let code = req.body['code']
        let name = req.body['name']
        if(!name || typeof(name) !== 'string'){
            name = randomstring.generate(16)
        }
        if (StringUtil.isEmpty(code)) {
            throw new ApiValidateException("Code required", '{CODE}_REQUIRED')
        }
        let phoneInfo = req.body['phoneInfo'] + ''
        if (StringUtil.isEmpty(phoneInfo)) {
            throw new ApiValidateException("Phone info required", '{PHONE_INFO}_REQUIRED')
        }
        let validateCodeDecode = StringUtil.decodeHashStrings(phoneInfo)
        if (!validateCodeDecode || validateCodeDecode.length !== 3) {
            throw new ApiValidateException("Phone info not valid", '{PHONE_INFO}_NOT_VALID')
        }
        //countryCode, phone, flag
        if (validator.isEmail(name)) {
            throw new ApiValidateException("User name exists", '{NAME}_EXISTS')
        }
        if (validator.isInt(name)) {
            throw new ApiValidateException("User name exists", '{NAME}_EXISTS')
        }
        let password = req.body['password'] + ''
        if (StringUtil.isEmpty(password)) {
            throw new ApiValidateException("User password required", '{PASSWORD}_REQUIRED')
        }
        let flag = 10
        let phone = validateCodeDecode[1]
        let countryCode = validateCodeDecode[0]
        // Check message validate.
        let validateResult = await userService.validateMessage(countryCode, phone, flag, code, true)
        if (!validateResult) {
            throw new ApiValidateException("Code not valid", '{CODE}_NOT_VALID')
        }

        // Register RPC
        // No front server like nginx.
        //let ip = req.headers['x-real-ip'] || req.connection.remoteAddress
        let ip = RequestUtil.getIp(req)
        let data = await userService.registerUser(name, password, countryCode, phone, ip)
        ResponseUtil.Ok(req, res, data)
    } catch (error) {
        ResponseUtil.RenderStandardRpcError(req, res, error)
    }
})

router.post('/sendRegisterMessage', async (req, res) => {
    try {
        let code = randomstring.generate({
            charset: "numeric",
            length: 6
        })
        let countryCode = (req.body['countryCode'] + '').replace(/[^0-9]/ig, "")
        let phone = (req.body['phone'] + '').replace(/[^0-9]/ig, "")
        if (!phone || !(typeof (phone) === 'string')) {
            throw new ApiValidateException("Phone required", '{PHONE}_REQUIRED')
        }
        if (!countryCode || !(typeof (countryCode) === 'string')) {
            countryCode = '86'
        }
        //user exists
        let 
        let flag = 10
        let checkMessageResult = await userService.sendMessage(countryCode,
            phone,
            flag,
            code,
            500)
        if (checkMessageResult !== 0) {
            throw new ApiException("Send message too frequently", 400, "SEND_MESSAGE_FREQUENTLY")
        }
        try {
            await Const.SMS_SENDER.sendRegisterMessage(phone, code, countryCode, 5)
            ResponseUtil.Ok(req, res, StringUtil.encodeHashStrings(countryCode, phone, flag))
        } catch (errorCode) {
            //console.error(error)
            if (errorCode === 1016) {
                throw new ApiValidateException("Phone not validate", '{PHONE}_NOT_VALIDATE')
            }
            throw new ApiException("SEND_MESSAGE_ERROR", 500, "SEND_MESSAGE_ERROR")
        }
    } catch (apiError) {
        ResponseUtil.RenderStandardRpcError(req, res, apiError)
    }
})

router.post('/login', (req, res) => {
    // login logic
    let value = req.body['value']
    let password = req.body['password']
    let countryCode = (req.body['countryCode'] + '').replace(/[^0-9]/ig, "")
    if (!countryCode) {
        countryCode = '86'
    }
    if (StringUtil.isEmpty(value)) {
        throw new ApiValidateException("Check value required", '{VALUE}_REQUIRED')
    }
    if (StringUtil.isEmpty(password)) {
        throw new ApiValidateException("User password required", '{PASSWORD}_REQUIRED')
    }
    // Check email first.

    var caller = undefined
    if (validator.isEmail(value)) {
        caller = userService.checkUserValidByEmail(value, password)
    } else if (validator.isInt(value)) {
        caller = userService.checkUserValidByPhone(countryCode, value, password)
    } else {
        caller = userService.checkUserValidByName(value, password)
    }

    // Access
    caller.then(dat => {
        // ResponseUtil.Error(req, res, error)
        req.user = {
            'uuid': dat.uuid,
            'name': dat.name,
            'email': dat.email,
            'phone': dat.phone,
            'lastLoginTime': dat.lastLoginTime,
            'refreshTime': dat.refreshTime,
            'version': dat.version
        }
        // console.log(req.user)

        ResponseUtil.Ok(req, res, dat)
    }).catch(error => {
        if (error['innerCode']) {
            ResponseUtil.ApiError(req, res, new ApiException(error['innerMessage'], 401, "LOGIN_FAILED"))
        } else {
            ResponseUtil.Error(req, res, error)
        }
    })
})

router.post('/check', (req, res) => {
    let value = req.body['value']
    if (StringUtil.isEmpty(value)) {
        throw new ApiValidateException("Check value required", '{VALUE}_REQUIRED')
    }
    let type = (req.body['type'] ? req.body['type'] : 0).toString()
    // check
    let countryCode = (req.body['countryCode'] + '').replace(/[^0-9]/ig, "")
    if (!countryCode) {
        countryCode = '86'
    }
    switch (type) {
        case "0":
            userService.checkUserExistsByName(value)
                .then((data) => ResponseUtil.Ok(req, res, data))
                .catch((error) => ResponseUtil.OkOrError(req, res, error))
            break;
        case "1":
            userService.checkUserExistsByEmail(value)
                .then(data => ResponseUtil.Ok(req, res, data))
                .catch((error) => ResponseUtil.OkOrError(req, res, error))
            break;
        case "2":
            userService.checkUserExistsByPhone(countryCode,value)
                .then(data => ResponseUtil.OkOrError(req, res, error, data))
                .catch((error) => ResponseUtil.OkOrError(req, res, error))
            break;
        default:
            throw new ApiValidateException("Check type not validate", '{TYPE}_NOT_RECONGNISED')
    }
})


router.post('/benchmark', (req, res) => {

    // Do Register RPC

    let startTime = new Date().getTime();
    let max = 500000
    /*
    bench = (i) => demoService.out.execute('a', 'b').then((data) => {
        //
        if (i < max) {
            //console.log(i)
            bench(i + 1)
        } else {
            let finTime = new Date().getTime();
            ms = finTime - startTime
            s = ms / 1000
            qps = max / s
            ResponseUtil.Ok(req, res, { 'ms': ms, 'qps': qps })
        }
    })
    bench(0)
    */

    // ResponseUtil.Ok(req,res,data))
})

router.post('/:methodId', (req, res) => {
    let method = req.params.methodId
    let s = StringUtil.encodeHashStrings("a", "b", "c", "d")
    ResponseUtil.Ok(req, res, StringUtil.decodeHashStrings(s))
})

router.get('/date', (req, res) => {
    let time = Date.now()
    let userId = {
        "high": 0,
        "low": 0
    }
    userService.getUserByUuid(userId)
        .then((data) => ResponseUtil.Ok(req, res, data))
        .catch((error) => ResponseUtil.OkOrError(req, res, error))
})

router.get('/test', (req, res) => {
    let time = Date.now()
    userService.test()
    ResponseUtil.Ok(req, res, time)
})
module.exports = router