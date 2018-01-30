const express = require('express')
const router = express.Router()
const ApiException = require('../../../exception/api_exception')
const ApiValidateException = require('../../../exception/api_validate_exception')
const StringUtil = require('../../../util/string_util')
const ResponseUtil = require('../../../util/response_util')
//let CloudStoreServiceRpc = require('../../../service/cloud_store')
let CommonRpc = require('../../../service/common_rpc')
let cloudStoreServicePrx = require('../../../ice/cloudstore').store.CloudStoreServiceHandlerPrx
let handlerName = "CloudStoreServiceHandler"
let cloudStoreRpc = new CommonRpc(handlerName,cloudStoreServicePrx)

/*
let cloudStoreServiceRpc = new CloudStoreServiceRpc()


router.post('/token', (req, res) => {
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

router.post('/callback/wcs', (req, res) => {
    console.log('WCS Callback %s',req.body.callbackBody)
    result = { 'callbackTime': (new Date()).getTime }
    res.json(result)
})
*/
module.exports = router