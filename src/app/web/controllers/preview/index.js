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
const m3u8Parser = require('m3u8-parser')
const fetch = require('node-fetch')

router.post('/m3u8', (req, res) => {
    // play m3u8
    // Body.text()
    let src = "http://other.qiecdn.com/play_preview/79/lrt6AI-1Py6JNUVNONIgyWIgFPsg/lrt6AI-1Py6JNUVNONIgyWIgFPsg-320.m3u8"
    fetch(src).then(function (response) {
        if (response.ok) {
            return response.text();
        }
        throw new Error('Network response was not ok.');
    }).then(function (text) {
        // i need av
        var parser = new m3u8Parser.Parser();
        parser.push(text);
        parser.end();
        console.log(parser.manifest)

    }).catch(function (error) {
        console.log('There has been a problem with your fetch operation: ', error.message);
    });
})

router.post(['/video', '/audio'], (req, res) => {
    var uuid = req.body['uuid'] ? req.body['uuid'] + '' : ''
    var path = req.body['path'] ? req.body['path'] + '' : ''
    if (!uuid && !path) {
        throw new ApiValidateException("File uuid required", '{UUID}_REQUIRED')
    }
    let userId = req.user.uuid
    //get
    userFileRpc.get(uuid, userId, path).then((result) => {
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
                "FILE_NOT_FOUND"))
            return
        }
        cloudStoreRpc.getFile(storeId).then(fileData => {
            let previewAddon = fileData['previewAddon']
            let preview = fileData['preview']
            if (preview != 100 && preview != 200) {
                ResponseUtil.ApiError(req, res, new ApiException("PREVIEW_NOT_SUCCESS",
                    400,
                    "PREVIEW_NOT_SUCCESS"))
                return
            }
            var decodeObj = {}
            try {
                decodeObj = JSON.parse(previewAddon)
            } catch (err) {
                ResponseUtil.ApiError(req, res, new ApiException("PREVIEW_NOT_SUCCESS",
                    400,
                    "PREVIEW_NOT_SUCCESS"))
                return
            }
            let name = result['name']
            let responseObj = {
                'name': name,
                'duration': decodeObj["duration"],
                'maxClear': decodeObj['maxClear']
            }
            let videos = preview == 100 ? decodeObj['video'] : decodeObj['audio']
            if (!videos) {
                ResponseUtil.ApiError(req, res, new ApiException("PREVIEW_NOT_SUCCESS",
                    400,
                    "PREVIEW_NOT_SUCCESS"))
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