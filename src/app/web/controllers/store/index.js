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
const cors = require('cors')

var corsOptions = {
    /*
    origin: '*',
    methods: ['GET', 'PUT', 'POST'],
    allowedHeaders: ["X-Requested-With"],
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
    */

    'origin': '*',
    'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
    'preflightContinue': false,
    'optionsSuccessStatus': 200
}

router.post('/token', async (req, res) => {
    try {
        let userId = req.user.uuid
        var name = req.body.name
        let parent = req.body.parent
        let hash = req.body.hash
        let override = req.body.override + ''
        let path = req.body['path']
        if (path) {
            path += ''
        }
        if (!override) {
            override = req.body.rewrite + ''
        }
        if (!hash) {
            hash = req.body.fileHash
        }
        if (!parent) {
            parent = ''
        }
        if (!name && !path) {
            name = 'qzy-upload-noname.' + (new Date()).getTime().toString() + '.tmp'
        }
        if(!name){
            name = ''
        }
        let overrideFile = 0
        if (override == '1' || override == 'true' || override == 'yes') {
            overrideFile = 1
        }
        // check file exists.
        if (override !== 1) {
            let exists = await userFileRpc.rpc.checkUserFileExists(userId, parent, path, name)
            if (exists) {
                throw new ApiValidateException('File already exist.', 'FILE_AREADY_EXISTS')
            }
        }
        // create file
        // createUploadToken(userId: Long, parent: String,path:String, name: String, override: Int, current: Current?)
        let token = await cloudStoreRpc.createUploadToken(userId, parent, path, name, overrideFile)
        ResponseUtil.Ok(req, res, token)
    } catch (error) {
        ResponseUtil.RenderStandardRpcError(req, res, error)
    }

})




router.post('/callback/wcsm3u8', (req, res) => {
    if (!req.body) {
        console.warn('Wcs callback empty.')
    }
    jsonStr = Buffer.from(req.body, 'base64').toString('utf8')
    console.log(jsonStr)
    ResponseUtil.Ok(req, res, {})
})

router.post('/callback/wcsm3u8/:encoded', (req, res) => {
    if (!req.body) {
        console.warn('Wcs callback empty.')
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
        let convertType = encode['type']
        var success = false
        let wcsTaskId = callback['id']
        let callbackCode = callback['code']
        if (callbackCode != 3) {
            console.error('Task %s failed convert(code %s). info %s',
                taskId, callbackCode, JSON.stringify(callback))
        }
        let previewData = {
            'taskId': taskId,
            'maxClear': maxReslov,
            'encodeKey': encodeKey
        }
        var durationCount = 0
        let videos = []
        for (let single of callback['items']) {
            if (single['code'] != '3' || !single['key']) {
                console.error('Task piece %s failed convert.code %s info %s',
                    taskId, single['code'],
                    JSON.stringify(single))
            } else {
                success = true
                let duration = parseFloat(single['duration'])
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
        if (convertType == 1) {
            previewData['audio'] = videos
        } else {
            previewData['video'] = videos
        }

        let successCode = success ? (convertType == 1 ? 200 : 100) : -100
        let previewType = convertType == 1 ? 48 : 38
        let previewAddonData = JSON.stringify(previewData)
        // PreviewTaskResponse updatePreviewTaskStatus(long taskId,string fileHash,int preview,int previewType,string message) throws RemoteOperationFailedException;
        cloudStoreRpc.updatePreviewTaskStatus(IceUtil.number2IceLong(taskId), fileHash, successCode, previewType, previewAddonData).then(data => {
            if (data['fileHash'] != fileHash) {
                console.error('%s file hash does not match.', taskId)
            }
        }).catch(error => {
            console.error(error)
        })

    } catch (error) {
        console.log(error)
    }
    ResponseUtil.Ok(req, res, {})
})

router.get('/play/:encoded', cors(corsOptions), (req, res) => {
    var key = '2033a59f29d87508'
    // res.header("Access-Control-Allow-Origin", "*");
    // res.header("Access-Control-Allow-Headers", "X-Requested-With");
    // res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    try {
        let encode = JSON.parse(
            AwesomeBase64.decode(req.params.encoded)
            .toString('utf8')
        )
        let fileHash = encode['hash']
        cloudStoreRpc.getFile(fileHash).then(fileData => {
            let previewAddon = fileData['previewAddon']
            let preview = fileData['preview']
            if (preview != 100 && preview != 200) {
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


// copyStoreFileToUserFile(storeId: String?, mime: String?, size: Long, preview: Int, userId: Long, parent: String?, path: String?, name: String?, override: Boolean, current: Current?)
router.post('/callback/wcs', async (req, res) => {
    // console.log('WCS Callback %s', req.body.callbackBody)
    // save file
    try {
        let data = await cloudStoreRpc.uploadFile(req.body.callbackBody)
        let names = data.originalFilename.split('|@qzy_inner@|')
        let parent = names[0]
        let name = names[1]
        let path = names[2]
        let userId = data.uploadUser
        let storeId = data.fileHash
        let size = data.fileSize
        let mime = data.mime
        let preview = data.preview
        // let fileType = 0
        let testUserId = IceUtil.iceLong2Number(userId)
        let override = (data.flag == 1)
        if (testUserId > -1) {
            //createUserFile(req, res, parent, userId, name, storeId, size, mime, preview, fileType,override)
            let createFile = await userFileRpc.copyStoreFileToUserFile(storeId, mime, size, preview, userId, parent, path, name, override)
            ResponseUtil.Ok(req, res, createFile)
        } else {
            ResponseUtil.Ok(req, res, data)
        }
    } catch (error) {
        ResponseUtil.ApiErrorAsOk(req, res, error)
    }
})

module.exports = router