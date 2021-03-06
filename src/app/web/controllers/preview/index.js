const express = require('express')
const router = express.Router()
const ApiException = require('../../../exception/api_exception')
const ApiValidateException = require('../../../exception/api_validate_exception')
const ResponseUtil = require('../../../util/response_util')
const IceUtil = require('../../../util/ice_util')
let cloudStoreRpc = require('../../../const/rpc').cloudStoreRpc
let userFileRpc = require('../../../const/rpc').userFileRpc
const CONSTANTS = require('../../../const/constants')

router.post(['/pdf', '/image','/text'], async (req, res) => {
    try {
        let uuid = req.body['uuid'] ? req.body['uuid'] + '' : ''
        let path = req.body['path'] ? req.body['path'] + '' : ''
        if (!uuid && !path) {
            throw new ApiValidateException('File uuid required', '{UUID}_REQUIRED')
        }
        let userId = req.user.uuid
        //get
        let result = await userFileRpc.get(userId, uuid, path)
        if (!result) {
            throw new ApiValidateException('File not found', 'FILE_NOT_FOUND')
        }
        let storeId = result['storeId']
        if (result['type'] !== 0) {
            throw new ApiException('PREVIEW_DIRECTORY_NOT_SUPPORTED',
                400,
                'PREVIEW_DIRECTORY_NOT_SUPPORTED')
        }
        let fileData = await cloudStoreRpc.getFileEx(storeId, userId)
        if (!fileData) {
            throw new ApiValidateException('File not found', 'FILE_NOT_FOUND')
        }
        let preview = fileData['preview']
        if (preview != 300 && preview != 400) {
            throw new ApiException('PREVIEW_NOT_SUCCESS',
                400,
                'PREVIEW_NOT_SUCCESS')
        }
        //
        let fileHash = storeId
        let fileSize = fileData['fileSize']
        let mime = fileData['mime']
        let url = fileData['downloadAddress']
        let name = result['name']
        let respData = {
            'fileSize': fileSize,
            'hash': fileHash,
            'name': name,
            'mime': mime,
            'url': url
        }
        ResponseUtil.Ok(req, res, respData)
    } catch (error) {
        ResponseUtil.RenderStandardRpcError(req, res, error)
    }
})

router.post(['/video', '/audio'], (req, res) => {
    var uuid = req.body['uuid'] ? req.body['uuid'] + '' : ''
    var path = req.body['path'] ? req.body['path'] + '' : ''
    if (!uuid && !path) {
        throw new ApiValidateException('File uuid required', '{UUID}_REQUIRED')
    }
    let userId = req.user.uuid
    //get
    userFileRpc.get(userId, uuid, path).then((result) => {
        // get file
        //
        let storeId = result['storeId']
        if (!storeId) {
            if (result['type'] !== 0) {
                ResponseUtil.ApiError(req, res,
                    new ApiException('DOWNLOAD_DIRECTORY_NOT_SUPPORTED',
                        400,
                        'DOWNLOAD_DIRECTORY_NOT_SUPPORTED')
                )
                return
            }
            ResponseUtil.ApiError(req, res, new ApiException('FILE_NOT_FOUND',
                400,
                'FILE_NOT_FOUND'))
            return
        }
        cloudStoreRpc.getFile(storeId).then(fileData => {
            if (!fileData) {
                ResponseUtil.ApiError(req, res, new ApiException('FILE_NOT_FOUND',
                    400,
                    'PREVIEW_NOT_SUCCESS'))
                return
            }
            let previewAddon = fileData['previewAddon']
            let preview = fileData['preview']
            if (preview != 100 && preview != 200) {
                ResponseUtil.ApiError(req, res, new ApiException('PREVIEW_NOT_SUCCESS',
                    400,
                    'PREVIEW_NOT_SUCCESS'))
                return
            }
            var decodeObj = {}
            try {
                decodeObj = JSON.parse(previewAddon)
            } catch (err) {
                ResponseUtil.ApiError(req, res, new ApiException('PREVIEW_NOT_SUCCESS',
                    400,
                    'PREVIEW_NOT_SUCCESS'))
                return
            }
            let name = result['name']
            let responseObj = {
                'name': name,
                'duration': decodeObj['duration'],
                'maxClear': decodeObj['maxClear']
            }
            let videos = preview == 100 ? decodeObj['video'] : decodeObj['audio']
            if (!videos) {
                ResponseUtil.ApiError(req, res, new ApiException('PREVIEW_NOT_SUCCESS',
                    400,
                    'PREVIEW_NOT_SUCCESS'))
                return
            }
            let videoArr = []
            for (let video of videos) {
                videoArr.push({
                    'duration': video['duration'],
                    'url': CONSTANTS.PLAY_PREFIX +
                        video['key'] +
                        '?time=' +
                        (new Date()).getTime().toString() +
                        '&userId=' + IceUtil.iceLong2Number(userId).toString(),
                    'clear': video['clear']
                })
            }
            if (preview == 100) {
                responseObj['video'] = videoArr
            } else {
                responseObj['audio'] = videoArr
            }
            ResponseUtil.Ok(req, res, responseObj)
        }).catch((error) => {
            ResponseUtil.RenderStandardRpcError(req, res, error)
        })
    }).catch((error) => {
        ResponseUtil.RenderStandardRpcError(req, res, error)
    })
})
module.exports = router