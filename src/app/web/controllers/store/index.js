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
const AwesomeBase64 = require('awesome-urlsafe-base64');


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
    userFileRpc.couldCreateFile(parent, userId, name, CONSTANTS.FILE_TYPE).then(cdata => {
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

router.post('/callback/wcsm3u8', (req, res) => {
    if (!req.body) {
        console.warn("Wcs callback empty.")
    }
    jsonStr = Buffer.from(req.body, 'base64').toString('utf8')
    console.log(jsonStr)
    ResponseUtil.Ok(req, res, {})
})

router.post('/callback/wcsm3u8/:encoded', (req, res) => {
    if (!req.body) {
        console.warn("Wcs callback empty.")
    }

    //jsonStr = Buffer.from(req.body, 'base64').toString('utf8')
    try {
        let encode = JSON.parse(
            AwesomeBase64.decode(req.params.encoded)
                .toString('utf8')
        )
        let callback = JSON.parse(
            AwesomeBase64.decode(req.body).toString('utf8')
        )
        // generate play info
        let taskId = encode['task_id']
        let maxReslov = encode['reslov']
        let fileHash = encode['hash']
        let fileBucket = encode['hash']
        let encodeKey = encode['key']
        var success = false
        let wcsTaskId = callback['id']
        let callbackCode = callback['id']
        if (callbackCode != 3) {
            console.error("Task %s failed convert(code %s). info %s",
                taskId, code, JSON.stringify(callback))
        }
        let previewData = {
            'taskId': taskId,
            'maxClear': maxReslov,
            'encodeKey': encodeKey
        }
        var durationCount = 0
        let videos = []
        for (let single of callback["items"]) {
            if (single["code"] != "3" && single['key']) {
                console.error("Task piece %s failed convert.code %s info %s",
                 taskId, single["code"],
                 JSON.stringify(single))
            } else {
                success = true
                let duration = parseFloat(single["duration"])
                if (durationCount < duration) {
                    durationCount = duration
                }
                let rawKey = single['key']
                let idx = rawKey.indexOf(':')
                let bucket = rawKey.substring(0, idx)
                let key = rawKey.substring(idx + 1, rawKey.length)
                let storeType = 0
                let clear = rawKey.substring(rawKey.lastIndexOf('-') + 1, rawKey.lastIndexOf('.'))
                videos.push({
                    'duration': duration,
                    'bucket': bucket,
                    'key': key,
                    'storeType': storeType,
                    'clear': clear
                })
            }
        }
        previewData['duration'] = durationCount
        previewData['video'] = videos
        let successCode = success ? 100 : -100
        let previewType = 38
        let previewAddonData = JSON.stringify(previewData)
        // PreviewTaskResponse updatePreviewTaskStatus(long taskId,string fileHash,int preview,int previewType,string message) throws RemoteOperationFailedException;
        cloudStoreRpc.updatePreviewTaskStatus(IceUtil.number2IceLong(taskId), fileHash, successCode, previewType, previewAddonData).then(data => {
            if (data['fileHash'] != fileHash) {
                console.error("%s file hash does not match.", taskId)
            }
        }).catch(error => {
            console.error(error)
        })

    } catch (error) {
        console.log(error)
    }
    ResponseUtil.Ok(req, res, {})
})

router.get('/play', (req, res) => {
    let dat = '{"id":"2033a59f29d8750a41f6a7c405df9d7cde58","code":3,"inputkey":"cloud_store/FuUiV649pTiy9QyAr5Ybyv113TU1.mp4","channelname":null,"inputbucket":"other-storage","inputfsize":783469,"desc":"fileOperateSucceed","separate":0,"items":[{"cmd":"avthumb/m3u8/hlsKey/Asvibu2nTuqcgQ-vXWOTiCswSwudJz7A2hNqvv8ngYZbnvYLOdwBz_atMl6z5juaAn5XVjdKUBKu-YjatXEEKLiViAHTk5tb4ablphkxPyJju9eyRT8NqVw643WPL3KbFm8TgvB7_uvsWkUd2IBL75wUQWoVFzS_diOU7kvRBXeTMf_Zh1iQmyjKGaqdrcRFuykBfGsXc3PtsYt7nxLG3Mugp34dAr_HBtwOzFQWTFcMUhNNTU-WDlK-Pz_3cWB1tzCfCUsPK4DiBCnni7BJIBveQF70oQ8uRNROMGGkwROYszFqJrPsv2YU5uLlXoDguXkB58yWxi8s_TRdXw==/hlsKeyUrl/aHR0cDovL2FwaS5ibG9nMTIwLmNvbS92MS9zdG9yZS9wbGF5L2V5Sm9ZWE5vSWpvZ0lrWjFWV2xXTmpRNWNGUnBlVGxSZVVGeU5WbGllWFl4TVROVVZURWlMQ0FpZEdGemExOXBaQ0k2SURJMGZRPT0=/segtime/5/vcodec/libx264/acodec/libfaac/s/922x678/autoscale/1|saveas/b3RoZXItc3RvcmFnZTpwbGF5X3ByZXZpZXcvMjQvRnVVaVY2NDlwVGl5OVF5QXI1WWJ5djExM1RVMS9GdVVpVjY0OXBUaXk5UXlBcjVZYnl2MTEzVFUxLTcyMC5tM3U4","code":"3","costTime":0,"desc":"fileOperateSucceed","error":null,"fsize":357,"hash":"FlRP-JizVG8SCGbdE-ESpTwJ6Gav","key":"other-storage:play_preview/24/FuUiV649pTiy9QyAr5Ybyv113TU1/FuUiV649pTiy9QyAr5Ybyv113TU1-720.m3u8","url":"http://other.qiecdn.com/play_preview/24/FuUiV649pTiy9QyAr5Ybyv113TU1/FuUiV649pTiy9QyAr5Ybyv113TU1-720.m3u8","duration":8.467,"bit_rate":"357396","resolution":"922X678","detail":[{"fsize":357,"hash":"FlRP-JizVG8SCGbdE-ESpTwJ6Gav","key":"other-storage:play_preview/24/FuUiV649pTiy9QyAr5Ybyv113TU1/FuUiV649pTiy9QyAr5Ybyv113TU1-720.m3u8","url":"http://other.qiecdn.com/play_preview/24/FuUiV649pTiy9QyAr5Ybyv113TU1/FuUiV649pTiy9QyAr5Ybyv113TU1-720.m3u8","duration":8.467,"bit_rate":"357396","resolution":"922X678"}]}]}'
    let callback = JSON.parse(dat)
    var success = false
    let videos = []
    var durationCount = 0
    for (let single of callback["items"]) {
        if (single["code"] != "3" && single['key']) {
            console.error("Task piece %s failed convert. info %s", taskId, JSON.stringify(single))
        } else {
            success = true
            let duration = parseFloat(single["duration"])
            if (durationCount < duration) {
                durationCount = duration
            }
            let rawKey = single['key']
            let idx = rawKey.indexOf(':')
            let bucket = rawKey.substring(0, idx)
            let key = rawKey.substring(idx + 1, rawKey.length)
            let storeType = 0
            let clear = rawKey.substring(rawKey.lastIndexOf('-') + 1, rawKey.lastIndexOf('.'))
            videos.push({
                'duration': duration,
                'bucket': bucket,
                'key': key,
                'storeType': storeType,
                'clear': clear
            })
        }
    }

    console.log(JSON.stringify(videos))
    res.send("1234567890123456")
})

router.post('/callback/wcs', (req, res) => {
    console.log('WCS Callback %s', req.body.callbackBody)
    // save file
    cloudStoreRpc.uploadFile(req.body.callbackBody).then(data => {
        //
        // result = { 'callbackTime': (new Date()).getTime }
        //res.json(data)
        // createUserFile(string parent,long userId,string name,string storeId,long size,string mime,int fileType);
        let names = data.originalFilename.split("|@qzy_inner@|")
        let parent = names[0]
        let name = names[1]
        let userId = data.uploadUser
        let storeId = data.fileHash
        let size = data.fileSize
        let mime = data.mime
        let fileType = 0
        userFileRpc.createUserFile(parent, userId, name, storeId, size, mime, fileType).then(fileData => {
            ResponseUtil.Ok(req, res, fileData)
        }).catch(fileError => {
            if (fileError['innerCode']) {
                ResponseUtil.ApiErrorAsOk(req, res, new ApiException(fileError['innerMessage'], 400, fileError['innerMessage']))
            } else {
                ResponseUtil.Error(req, res, fileError)
            }
        })

    }).catch(error => {
        if (error['innerCode']) {
            ResponseUtil.ApiErrorAsOk(req, res, new ApiException(error['innerMessage'], 400, error['innerMessage']))
        } else {
            ResponseUtil.Error(req, res, error)
        }
    })

})

module.exports = router