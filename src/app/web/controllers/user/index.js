let express = require('express')
let Const = require('../../../const/constants')
let router = express.Router()
let ApiException = require('../../../exception/api_exception')
let ApiValidateException = require('../../../exception/api_validate_exception')
const NotFoundException = require('../../../exception/not_found_exception')
let ResponseUtil = require('../../../util/response_util')
let StringUtil = require('../../../util/string_util')
let validator = require('validator')
const RequestUtil = require('../../../util/request_util')
const randomstring = require('randomstring')
let userService = require('../../../const/rpc').userRpc

router.post('/register', async (req, res) => {
    try {
        let code = (req.body['code'] + '').replace(/[^0-9]/ig, '')
        let name = req.body['name']
        if (!name || typeof (name) !== 'string') {
            name = randomstring.generate(16)
        }
        if (StringUtil.isEmpty(code)) {
            throw new ApiValidateException('Code required', '{CODE}_REQUIRED')
        }
        let phoneInfo = req.body['phoneInfo'] + ''
        if (StringUtil.isEmpty(phoneInfo)) {
            throw new ApiValidateException('Phone info required', '{PHONE_INFO}_REQUIRED')
        }
        let validateCodeDecode = StringUtil.decodeHashStrings(phoneInfo)
        if (!validateCodeDecode || validateCodeDecode.length !== 3) {
            throw new ApiValidateException('Phone info not valid', '{PHONE_INFO}_NOT_VALID')
        }
        //countryCode, phone, flag
        if (validator.isEmail(name)) {
            throw new ApiValidateException('User name exists', '{NAME}_EXISTS')
        }
        if (validator.isInt(name)) {
            throw new ApiValidateException('User name exists', '{NAME}_EXISTS')
        }
        let password = req.body['password'] + ''
        if (StringUtil.isEmpty(password)) {
            throw new ApiValidateException('User password required', '{PASSWORD}_REQUIRED')
        }
        let flag = 10
        let phone = validateCodeDecode[1]
        let countryCode = validateCodeDecode[0]
        // Check message validate.
        let validateResult = await userService.validateMessage(countryCode, phone, flag, code, true)
        if (!validateResult) {
            throw new ApiValidateException('Code not valid', '{CODE}_NOT_VALID')
        }

        // Register RPC
        // No front server like nginx.
        //let ip = req.headers['x-real-ip'] || req.connection.remoteAddress
        let ip = RequestUtil.getIp(req)
        let dat = await userService.registerUser(name, password, countryCode, phone, ip)
        writeLoginMessage(req,dat)
        ResponseUtil.Ok(req, res, dat)
    } catch (error) {
        ResponseUtil.RenderStandardRpcError(req, res, error)
    }
})


router.post('/sendRegisterMessage', async (req, res) => {
    try {
        let code = randomstring.generate({
            charset: 'numeric',
            length: 6
        })
        let countryCode = (req.body['countryCode'] + '').replace(/[^0-9]/ig, '')
        let phone = (req.body['phone'] + '').replace(/[^0-9]/ig, '')
        if (!phone || !(typeof (phone) === 'string')) {
            throw new ApiValidateException('Phone required', '{PHONE}_REQUIRED')
        }
        if (!countryCode || (typeof (countryCode) !== 'string')) {
            countryCode = '86'
        }
        //user exists
        let exists = await userService.checkUserExistsByPhone(countryCode, phone)
        if (exists) {
            throw new ApiValidateException('User phone exists', 'USER_PHONE_EXIST')
        }
        let flag = 10
        let checkMessageResult = await userService.sendMessage(countryCode,
            phone,
            flag,
            code,
            500)
        if (checkMessageResult !== 0) {
            throw new ApiException('Send message too frequently', 400, 'SEND_MESSAGE_FREQUENTLY')
        }
        try {
            await Const.SMS_SENDER.sendRegisterMessage(phone, code, countryCode, 5)
            ResponseUtil.Ok(req, res, StringUtil.encodeHashStrings(countryCode, phone, flag))
        } catch (errorCode) {
            //console.error(error)
            if (errorCode === 1016) {
                throw new ApiValidateException('Phone not validate', 'PHONE_NOT_VALIDATE')
            }
            throw new ApiException('SEND_MESSAGE_ERROR', 500, 'SEND_MESSAGE_ERROR')
        }
    } catch (apiError) {
        ResponseUtil.RenderStandardRpcError(req, res, apiError)
    }
})

router.post('/sendLoginMessage', async (req, res) => {
    try {
        let code = randomstring.generate({
            charset: 'numeric',
            length: 6
        })
        let countryCode = (req.body['countryCode'] + '').replace(/[^0-9]/ig, '')
        let phone = (req.body['phone'] + '').replace(/[^0-9]/ig, '')
        if (!phone || !(typeof (phone) === 'string')) {
            throw new ApiValidateException('Phone required', '{PHONE}_REQUIRED')
        }
        if (!countryCode || !(typeof (countryCode) === 'string')) {
            countryCode = '86'
        }
        //user exists
        let exists = await userService.checkUserExistsByPhone(countryCode, phone)
        if (!exists) {
            throw new ApiValidateException('User phone not exists', 'USER_PHONE_NOT_EXIST')
        }
        let flag = 20
        let checkMessageResult = await userService.sendMessage(countryCode,
            phone,
            flag,
            code,
            500)
        if (checkMessageResult !== 0) {
            throw new ApiException('Send message too frequently', 400, 'SEND_MESSAGE_FREQUENTLY')
        }
        try {
            await Const.SMS_SENDER.sendCommonMessage(phone, code, '97082', countryCode, 5)
            ResponseUtil.Ok(req, res, StringUtil.encodeHashStrings(countryCode, phone, flag))
        } catch (errorCode) {
            //console.error(error)
            if (errorCode === 1016) {
                throw new ApiValidateException('Phone not validate', 'PHONE_NOT_VALIDATE')
            }
            throw new ApiException('SEND_MESSAGE_ERROR', 500, 'SEND_MESSAGE_ERROR')
        }
    } catch (apiError) {
        ResponseUtil.RenderStandardRpcError(req, res, apiError)
    }
})

router.post('/loginByMessage', async (req, res) => {
    try {
        let code = (req.body['code'] + '').replace(/[^0-9]/ig, '')
        if (StringUtil.isEmpty(code)) {
            throw new ApiValidateException('Code required', '{CODE}_REQUIRED')
        }
        let phoneInfo = req.body['phoneInfo'] + ''
        if (StringUtil.isEmpty(phoneInfo)) {
            throw new ApiValidateException('Phone info required', '{PHONE_INFO}_REQUIRED')
        }
        let validateCodeDecode = StringUtil.decodeHashStrings(phoneInfo)
        if (!validateCodeDecode || validateCodeDecode.length !== 3) {
            throw new ApiValidateException('Phone info not valid', '{PHONE_INFO}_NOT_VALID')
        }
        //countryCode, phone, flag
        let flag = 20
        let phone = validateCodeDecode[1]
        let countryCode = validateCodeDecode[0]
        // Check message validate.
        let validateResult = await userService.validateMessage(countryCode, phone, flag, code, true)
        if (!validateResult) {
            throw new ApiValidateException('Code not valid', '{CODE}_NOT_VALID')
        }
        let isMobile = RequestUtil.isMobile(req)
        let dat = await userService.loginByPhone(countryCode, phone, isMobile)

        writeLoginMessage(req,dat)
        ResponseUtil.Ok(req, res, dat)
    } catch (error) {
        ResponseUtil.RenderStandardRpcError(req, res, error)
    }
})

router.post('/logout', async (req,res) => {
    try {
        let isMobile = RequestUtil.isMobile(req)
        let userId = req.user.uuid
        let succ = await userService.logout(userId, isMobile)
        delete req.user
        ResponseUtil.Ok(req, res, succ)
    } catch (error) {
        ResponseUtil.RenderStandardRpcError(req, res, error)
    }
})

router.post('/login', async (req, res) => {
    // login logic
    try {
        let value = req.body['value']
        let password = req.body['password']
        let countryCode = (req.body['countryCode'] + '').replace(/[^0-9]/ig, '')
        if (!countryCode) {
            countryCode = '86'
        }
        if (StringUtil.isEmpty(value)) {
            throw new ApiValidateException('Check value required', '{VALUE}_REQUIRED')
        }
        if (StringUtil.isEmpty(password)) {
            throw new ApiValidateException('User password required', '{PASSWORD}_REQUIRED')
        }
        // Check email first.

        let caller = undefined
        let isMobile = RequestUtil.isMobile(req)
        if (validator.isEmail(value)) {
            caller = userService.checkUserValidByEmail(value, password,isMobile)
        } else if (validator.isInt(value)) {
            caller = userService.checkUserValidByPhone(countryCode, value, password,isMobile)
        } else {
            caller = userService.checkUserValidByName(value, password,isMobile)
        }
        let dat = await caller
        writeLoginMessage(req,dat)
        ResponseUtil.Ok(req, res, dat)
    } catch (error) {
        ResponseUtil.RenderStandardRpcError(req, res, error)
    }
})

router.post('/check', (req, res) => {
    let value = req.body['value']
    if (StringUtil.isEmpty(value)) {
        throw new ApiValidateException('Check value required', '{VALUE}_REQUIRED')
    }
    let type = (req.body['type'] ? req.body['type'] : 0).toString()
    // check
    let countryCode = (req.body['countryCode'] + '').replace(/[^0-9]/ig, '')
    if (!countryCode) {
        countryCode = '86'
    }
    switch (type) {
    case '0':
        userService.checkUserExistsByName(value)
            .then((data) => ResponseUtil.Ok(req, res, data))
            .catch((error) => ResponseUtil.OkOrError(req, res, error))
        break
    case '1':
        userService.checkUserExistsByEmail(value)
            .then(data => ResponseUtil.Ok(req, res, data))
            .catch((error) => ResponseUtil.OkOrError(req, res, error))
        break
    case '2':
        userService.checkUserExistsByPhone(countryCode, value)
            .then(data => ResponseUtil.Ok(req, res, data))
            .catch((error) => ResponseUtil.OkOrError(req, res, error))
        break
    default:
        throw new ApiValidateException('Check type not validate', '{TYPE}_NOT_RECONGNISED')
    }
})


router.post('/changePassword', async (req, res) => {
    try {
        let userId = req.user.uuid
        let newPassword = req.body['newPassword'] + ''
        let oldPassword = req.body['oldPassword'] + ''
        let data = await userService.changePassword(userId, oldPassword, newPassword)
        ResponseUtil.Ok(req, res, data)
    } catch (error) {
        ResponseUtil.RenderStandardRpcError(req, res, error)
    }
})

router.post('/sendChangePasswordMessage', async (req, res) => {
    try {
        let code = randomstring.generate({
            charset: 'numeric',
            length: 6
        })
        let userId = req.user.uuid
        let userInfo = await userService.getUserByUuid(userId)
        if(!userInfo){
            throw new ApiValidateException('User not found', 'USER_NOT_FOUND')
        }
        let countryCode = userInfo.countryCode
        let phone = userInfo.phone
        if (!phone || !(typeof (phone) === 'string')) {
            throw new ApiValidateException('Phone required', '{PHONE}_REQUIRED')
        }
        if (!countryCode || !(typeof (countryCode) === 'string')) {
            countryCode = '86'
        }
        //user exists
        let flag = 30
        let checkMessageResult = await userService.sendMessage(countryCode,
            phone,
            flag,
            code,
            500)
        if (checkMessageResult !== 0) {
            throw new ApiException('Send message too frequently', 400, 'SEND_MESSAGE_FREQUENTLY')
        }
        try {
            await Const.SMS_SENDER.sendCommonMessage(phone, code, '94261', countryCode, 5)
            ResponseUtil.Ok(req, res, StringUtil.encodeHashStrings(countryCode, phone, flag))
        } catch (errorCode) {
            //console.error(error)
            if (errorCode === 1016) {
                throw new ApiValidateException('Phone not validate', 'PHONE_NOT_VALIDATE')
            }
            throw new ApiException('SEND_MESSAGE_ERROR', 500, 'SEND_MESSAGE_ERROR')
        }
    } catch (apiError) {
        ResponseUtil.RenderStandardRpcError(req, res, apiError)
    }
})

router.post('/sendChangePasswordMessage2', async (req, res) => {
    try {
        let code = randomstring.generate({
            charset: 'numeric',
            length: 6
        })
        let countryCode = (req.body['countryCode'] + '').replace(/[^0-9]/ig, '')
        let phone = (req.body['phone'] + '').replace(/[^0-9]/ig, '')
        if (!phone || !(typeof (phone) === 'string')) {
            throw new ApiValidateException('Phone required', '{PHONE}_REQUIRED')
        }
        if (!countryCode || !(typeof (countryCode) === 'string')) {
            countryCode = '86'
        }
        //user exists
        let exists = await userService.checkUserExistsByPhone(countryCode, phone)
        //let userId = req.user.uuid
        if(!exists){
            throw new NotFoundException('User phone not found','USER_PHONE_NOT_FOUND')
        }
        if (!phone || !(typeof (phone) === 'string')) {
            throw new ApiValidateException('Phone required', '{PHONE}_REQUIRED')
        }
        //user exists
        let flag = 30
        let checkMessageResult = await userService.sendMessage(countryCode,
            phone,
            flag,
            code,
            500)
        if (checkMessageResult !== 0) {
            throw new ApiException('Send message too frequently', 400, 'SEND_MESSAGE_FREQUENTLY')
        }
        try {
            await Const.SMS_SENDER.sendCommonMessage(phone, code, '94261', countryCode, 5)
            ResponseUtil.Ok(req, res, StringUtil.encodeHashStrings(countryCode, phone, flag))
        } catch (errorCode) {
            //console.error(error)
            if (errorCode === 1016) {
                throw new ApiValidateException('Phone not validate', 'PHONE_NOT_VALIDATE')
            }
            throw new ApiException('SEND_MESSAGE_ERROR', 500, 'SEND_MESSAGE_ERROR')
        }
    } catch (apiError) {
        ResponseUtil.RenderStandardRpcError(req, res, apiError)
    }
})

router.post('/changePasswordByMessage', async (req, res) => {
    try {
        let code = (req.body['code'] + '').replace(/[^0-9]/ig, '')
        if (StringUtil.isEmpty(code)) {
            throw new ApiValidateException('Code required', '{CODE}_REQUIRED')
        }
        let phoneInfo = req.body['phoneInfo'] + ''
        if (StringUtil.isEmpty(phoneInfo)) {
            throw new ApiValidateException('Phone info required', '{PHONE_INFO}_REQUIRED')
        }
        let validateCodeDecode = StringUtil.decodeHashStrings(phoneInfo)
        if (!validateCodeDecode || validateCodeDecode.length !== 3) {
            throw new ApiValidateException('Phone info not valid', '{PHONE_INFO}_NOT_VALID')
        }
        //countryCode, phone, flag
        let flag = 30
        let phone = validateCodeDecode[1]
        let countryCode = validateCodeDecode[0]
        // Check message validate.
        let validateResult = await userService.validateMessage(countryCode, phone, flag, code, true)
        if (!validateResult) {
            throw new ApiValidateException('Code not valid', '{CODE}_NOT_VALID')
        }
        let userId = req.user.uuid
        let newPassword = req.body['newPassword'] + ''
        let succ = await userService.changePasswordByMessage(userId, countryCode, phone, newPassword)

        ResponseUtil.Ok(req, res, succ)
    } catch (error) {
        ResponseUtil.RenderStandardRpcError(req, res, error)
    }
})

router.post('/changePasswordByMessage2', async (req, res) => {
    try {
        let code = (req.body['code'] + '').replace(/[^0-9]/ig, '')
        if (StringUtil.isEmpty(code)) {
            throw new ApiValidateException('Code required', '{CODE}_REQUIRED')
        }
        let phoneInfo = req.body['phoneInfo'] + ''
        if (StringUtil.isEmpty(phoneInfo)) {
            throw new ApiValidateException('Phone info required', '{PHONE_INFO}_REQUIRED')
        }
        let validateCodeDecode = StringUtil.decodeHashStrings(phoneInfo)
        if (!validateCodeDecode || validateCodeDecode.length !== 3) {
            throw new ApiValidateException('Phone info not valid', '{PHONE_INFO}_NOT_VALID')
        }
        //countryCode, phone, flag
        let flag = 30
        let phone = validateCodeDecode[1]
        let countryCode = validateCodeDecode[0]
        // Check message validate.
        let validateResult = await userService.validateMessage(countryCode, phone, flag, code, true)
        if (!validateResult) {
            throw new ApiValidateException('Code not valid', '{CODE}_NOT_VALID')
        }
        //validate user exists first.
        let userInfo = await userService.getUserByPhone(countryCode, phone)
        if(!userInfo){
            throw new ApiValidateException('User not found', 'USER_NOT_FOUND')
        }
        let newPassword = req.body['newPassword'] + ''
        let succ = await userService.changePasswordByMessage(userInfo.uuid, countryCode, phone, newPassword)
        ResponseUtil.Ok(req, res, succ)
    } catch (error) {
        ResponseUtil.RenderStandardRpcError(req, res, error)
    }
})

router.post('/:methodId', (req, res) => {
    let method = req.params.methodId
    let s = StringUtil.encodeHashStrings('a', 'b', 'c', 'd', method)
    ResponseUtil.Ok(req, res, StringUtil.decodeHashStrings(s))
})


let writeLoginMessage = (req, dat) => {
    req.user = {
        'uuid': dat.uuid,
        'name': dat.name,
        'email': dat.email,
        'phone': dat.phone,
        'lastLoginTime': dat.lastLoginTime,
        'refreshTime': dat.refreshTime,
        'version': dat.version
    }
}
module.exports = router