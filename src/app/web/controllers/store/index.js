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


router.post('/token', (req, res) => {
    let userId = req.user.uuid
    var name = req.body.name
    var parent = req.body.parent
    var hash = req.body.hash
    if (!hash) {
        hash = req.body.fileHash
    }
    if (!parent) {
        parent = ''
    }
    if (!name) {
        name = "qzy-upload-noname." + (new Date()).getTime().toString() + ".tmp"
    }
    // check file exists.
    userFileRpc.couldCreateFile(parent, userId, name, CONSTANTS.FILE_TYPE).then(cdata => {
        //could create
        if (hash) {
            cloudStoreRpc.getFile(hash).then(fileData => {
                // exists,moving file...
                // result['exists'] = true
                // move file...
                createUserFile(req,
                    res,
                    parent,
                    userId,
                    name,
                    hash,
                    fileData['fileSize'],
                    fileData['mime'],
                    fileData['preview'],
                    0
                )
            }).catch(exception => {
                createNewFileToken(req, res, parent, userId, name)
            })
        } else {
            createNewFileToken(req, res, parent, userId, name)
        }

    }).catch(error => {
        if (error['innerCode']) {
            ResponseUtil.ApiError(req, res, new ApiException(error['innerMessage'], 400, error['innerMessage']))
        } else {
            ResponseUtil.Error(req, res, error)
        }
    })
})

const createNewFileToken = (req, res, parent, userId, name) => {
    cloudStoreRpc.createUploadToken(userId, parent, name).then((result) => {
        ResponseUtil.Ok(req, res, result)
    }).catch((error) => {
        if (error['innerCode']) {
            ResponseUtil.ApiError(req, res, new ApiException(error['innerMessage'], 400, error['innerMessage']))
        } else {
            ResponseUtil.Error(req, res, error)
        }
    })
}

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
        let callbackCode = callback['code']
        if (callbackCode != 3) {
            console.error("Task %s failed convert(code %s). info %s",
                taskId, callbackCode, JSON.stringify(callback))
        }
        let previewData = {
            'taskId': taskId,
            'maxClear': maxReslov,
            'encodeKey': encodeKey
        }
        var durationCount = 0
        let videos = []
        for (let single of callback["items"]) {
            if (single["code"] != "3" || !single['key']) {
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

router.get('/play/:encoded', (req, res) => {
    var key = "2033a59f29d8750"
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    try {
        let encode = JSON.parse(
            AwesomeBase64.decode(req.params.encoded)
            .toString('utf8')
        )
        let fileHash = encode['hash']
        cloudStoreRpc.getFile(fileHash).then(fileData => {
            let previewAddon = fileData['previewAddon']
            let preview = fileData['preview']
            if (preview != 100) {
                res.send(key)
                return
            }
            var decodeObj = {}
            try {
                decodeObj = JSON.parse(previewAddon)
            } catch (err) {
                console.error(err)
                res.send(key)
                return
            }
            if (decodeObj['encodeKey']) {
                key = decodeObj['encodeKey']
            }
            res.send(key)
        }).catch(error => {
            console.error(error)
            res.send(key)
        })
    } catch (error) {
        console.error(error)
        res.send(key)
    }
})

const createUserFile = (req, res, parent, userId, name, storeId, size, mime, preview, fileType) => {
    userFileRpc.createUserFile(parent, userId, name, storeId, size, mime, preview, fileType).then(fileData => {
        ResponseUtil.Ok(req, res, fileData)
    }).catch(fileError => {
        if (fileError['innerCode']) {
            ResponseUtil.ApiErrorAsOk(req, res, new ApiException(fileError['innerMessage'], 400, fileError['innerMessage']))
        } else {
            ResponseUtil.Error(req, res, fileError)
        }
    })
}

router.post('/callback/wcs', (req, res) => {
    // console.log('WCS Callback %s', req.body.callbackBody)
    // save file
    cloudStoreRpc.uploadFile(req.body.callbackBody).then(data => {
        //
        // result = { 'callbackTime': (new Date()).getTime }
        //res.json(data)
        let names = data.originalFilename.split("|@qzy_inner@|")
        let parent = names[0]
        let name = names[1]
        let userId = data.uploadUser
        let storeId = data.fileHash
        let size = data.fileSize
        let mime = data.mime
        let preview = data.preview
        let fileType = 0
        if (userId > -1) {
            createUserFile(req, res, parent, userId, name, storeId, size, mime, preview, fileType)
        } else {
            ResponseUtil.Ok(req, res, data)
        }

    }).catch(error => {
        if (error['innerCode']) {
            ResponseUtil.ApiErrorAsOk(req, res, new ApiException(error['innerMessage'], 400, error['innerMessage']))
        } else {
            ResponseUtil.Error(req, res, error)
        }
    })

})

module.exports = router