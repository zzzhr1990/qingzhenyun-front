const express = require('express')
const router = express.Router()
const ApiException = require('../../../exception/api_exception')
const ApiValidateException = require('../../../exception/api_validate_exception')
const StringUtil = require('../../../util/string_util')
const ResponseUtil = require('../../../util/response_util')
let cloudStoreRpc = require('../../../const/rpc').cloudStoreRpc
let userFileRpc = require('../../../const/rpc').userFileRpc
const CONSTANTS = require('../../../const/constants')


router.post('/token', (req, res) => {
    let userId = req.user.uuid

    var name = req.body.name
    var parent = req.body.parent
    if (!parent) {
        parent = ''
    }
    if (!name) {
        name = "qzy-upload-noname." + (new Date()).getTime().toString() + ".tmp"
    }
    // check file name and directory.
    userFileRpc.couldCreateFile(parent, userId, name, CONSTANTS).then(cdata => {
        cloudStoreRpc.createUploadToken(userId, parent, name).then((result) => ResponseUtil.Ok(req, res, result))
            .catch((error) => {
                if (error['innerCode']) {
                    ResponseUtil.ApiError(req, res, new ApiException(error['innerMessage'], 400, error['innerMessage']))
                } else {
                    ResponseUtil.Error(req, res, error)
                }
            })
    }).catch(error => {
        if (error['innerCode']) {
            ResponseUtil.ApiError(req, res, new ApiException(error['innerMessage'], 400, error['innerMessage']))
        } else {
            ResponseUtil.Error(req, res, error)
        }
    })
})

router.post('/callback/wcs', (req, res) => {
    console.log('WCS Callback %s', req.body.callbackBody)
    result = { 'callbackTime': (new Date()).getTime }
    res.json(result)
})

module.exports = router