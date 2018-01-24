const express = require('express')
const router = express.Router()
const ApiException = require('../../../exception/api_exception')
const ApiValidateException = require('../../../exception/api_validate_exception')
const StringUtil = require('../../../util/string_util')
const ResponseUtil = require('../../../util/response_util')
let UserFileServiceRpc = require('../../../service/user_file')
let userFileService = new UserFileServiceRpc()
let validator = require('validator')



// List User Files...
router.post('/list', (req, res) => {
    ResponseUtil.Ok(req, res, req.user)
})

router.post('/page', (req, res) => {
    //ResponseUtil.Ok(req, res, req.user)
    var pageStr = req.body['page'] + ''
    if (!validator.isInt(pageStr)) {
        pageStr = '1'
    }
    var page = parseInt(pageStr)
    if (page < 1) {
        page = 1
    }
    //
    var pageSizeStr = req.body['pageSize'] + ''
    if (!validator.isInt(pageSizeStr)) {
        pageSizeStr = '20'
    }
    var pageSize = parseInt(pageSizeStr)
    if (pageSize < 1) {
        pageSize = 20
    }
    if (pageSize > 999) {
        pageSize = 999
    }
    var parent = req.body['parent']
    if (!parent) {
        parent = ''
    }
    let userId = req.user.uuid
    userFileService.rpc.listDirectoryPage(parent, userId, 0, page, pageSize).then((result) => ResponseUtil.Ok(req, res, result))
        .catch((error) => {
            if (error['innerCode']) {
                ResponseUtil.ApiError(req, res, new ApiException(error['innerMessage'], 400, error['innerMessage']))
            } else {
                ResponseUtil.Error(req, res, error)
            }
        })
})

router.post('/createDirectory', (req, res) => {
    // ResponseUtil.Ok(req, res, req.user)
    var parent = req.body['parent']
    if (!parent) {
        parent = ''
    }
    let userId = req.user.uuid
    var name = req.body['name']
    if (!name) {
        name = "New Directory Created by:" + new Date()
    }
    // call rpc
    userFileService.rpc.createDirectory(parent, userId, name).then((result) => ResponseUtil.Ok(req, res, result))
        .catch((error) => {
            if (error['innerCode']) {
                ResponseUtil.ApiError(req, res, new ApiException(error['innerMessage'], 400, error['innerMessage']))
            } else {
                ResponseUtil.Error(req, res, error)
            }
        })
})

module.exports = router