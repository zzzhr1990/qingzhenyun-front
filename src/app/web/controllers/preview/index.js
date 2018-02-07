const express = require('express')
const router = express.Router()
const ApiException = require('../../../exception/api_exception')
const ApiValidateException = require('../../../exception/api_validate_exception')
const StringUtil = require('../../../util/string_util')
const ResponseUtil = require('../../../util/response_util')
const IceUtil = require('../../../util/ice_util')
let cloudStoreRpc = require('../../../const/rpc').cloudStoreRpc
let userFileRpc = require('../../../const/rpc').userFileRpc
const CONSTANTS = require('../../../const/constants')
const AwesomeBase64 = require('awesome-urlsafe-base64')

router.post('/video', (req, res) => {
    var uuid = req.body['uuid'] ? req.body['uuid'] + '' : ''
    var name = req.body['name'] ? req.body['name'] + '' : ''
    if (!uuid && !name) {
        throw new ApiValidateException("File uuid required", '{UUID}_REQUIRED')
    }
    let userId = req.user.uuid
    //get
    userFileRpc.get(uuid, userId, name).then((result) => {
        // get file
        //
        let storeId = result["storeId"]
        if (!storeId) {
            if (result["type"] !== 0) {
                ResponseUtil.ApiError(req, res,
                    new ApiException("DOWNLOAD_DIRECTORY_NOT_SUPPORTED",
                        400,
                        "DOWNLOAD_DIRECTORY_NOT_SUPPORTED")
                )
                return
            }
            ResponseUtil.ApiError(req, res, new ApiException("FILE_NOT_FOUND",
                400,
                "FILE_NOT_FOUND")
            )
            return
        }
        cloudStoreRpc.getFile(storeId).then(fileData => {
            let previewAddon = fileData['previewAddon']
            let preview = fileData['preview']
            if (preview != 100) {
                ResponseUtil.ApiError(req, res, new ApiException("PREVIEW_NOT_SUCCESS",
                    400,
                    "PREVIEW_NOT_SUCCESS")
                )
                return
            }
            var decodeObj = {}
            try {
                decodeObj = JSON.parse(previewAddon)
            } catch{
                ResponseUtil.ApiError(req, res, new ApiException("PREVIEW_NOT_SUCCESS",
                    400,
                    "PREVIEW_NOT_SUCCESS")
                )
                return
            }
            let name = result['name']
            let responseObj = {
                'name': name,
                'duration': decodeObj["duration"],
                'maxClear': decodeObj['maxClear']
            }
            if (!decodeObj['video']) {
                ResponseUtil.ApiError(req, res, new ApiException("PREVIEW_NOT_SUCCESS",
                    400,
                    "PREVIEW_NOT_SUCCESS")
                )
                return
            }
            let videoArr = []
            for (let video of decodeObj['video']) {
                videoArr.push({
                    'duration': video['duration'],
                    'url': 'http://other.qiecdn.com/'
                        + video['key']
                        + '?time='
                        + (new Date()).getTime().toString()
                        + '&userId=' + IceUtil.iceLong2Number(userId).toString(),
                    'clear': video['clear']
                })
            }
            responseObj['video'] = videoArr
            ResponseUtil.Ok(req, res, responseObj)
        }).catch((error) => {
            if (error['innerCode']) {
                ResponseUtil.ApiError(req, res, new ApiException(error['innerMessage'], 400, error['innerMessage']))
            } else {
                ResponseUtil.Error(req, res, error)
            }
        })
    }).catch((error) => {
        if (error['innerCode']) {
            ResponseUtil.ApiError(req, res, new ApiException(error['innerMessage'], 400, error['innerMessage']))
        } else {
            ResponseUtil.Error(req, res, error)
        }
    })
})
module.exports = router