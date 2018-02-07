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
    if(!req.body){
        console.warn("Wcs callback empty.")
    }
    jsonStr = Buffer.from(req.body, 'base64').toString('utf8')
    console.log(jsonStr)
    ResponseUtil.Ok(req, res, {})
})

router.get('/play', (req, res) => {
    //console.log(res.format())
    res.send("123456789012345A")
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