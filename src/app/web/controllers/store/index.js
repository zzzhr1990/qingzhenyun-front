const express = require('express')
const router = express.Router()
const ApiException = require('../../../exception/api_exception')
const ApiValidateException = require('../../../exception/api_validate_exception')
const StringUtil = require('../../../util/string_util')
const ResponseUtil = require('../../../util/response_util')
let CloudStoreServiceRpc = require('../../../service/cloud_store')
let cloudStoreServiceRpc = new CloudStoreServiceRpc()

router.post('/token', (req, res) => {
    /*
    var uuid = req.body['uuid'] ? req.body['uuid'] + '' : ''
    if (!uuid) {
        throw new ApiValidateException("File uuid required", '{UUID}_REQUIRED')
    }
    */
    let userId = req.user.uuid
    //get
    cloudStoreServiceRpc.rpc.createUploadToken(userId).then((result) => ResponseUtil.Ok(req, res, result))
        .catch((error) => {
            if (error['innerCode']) {
                ResponseUtil.ApiError(req, res, new ApiException(error['innerMessage'], 400, error['innerMessage']))
            } else {
                ResponseUtil.Error(req, res, error)
            }
        })
})

module.exports = router