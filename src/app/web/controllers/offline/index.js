const express = require('express')
const router = express.Router()
const ApiException = require('../../../exception/api_exception')
const ApiValidateException = require('../../../exception/api_validate_exception')
const StringUtil = require('../../../util/string_util')
const ResponseUtil = require('../../../util/response_util')
const RequestUtil = require('../../../util/request_util')
const IceUtil = require('../../../util/ice_util')
const UrlUtil = require('../../../util/url_utils')
const cloudStoreRpc = require('../../../const/rpc').cloudStoreRpc
const userFileRpc = require('../../../const/rpc').userFileRpc
const offlineRpc = require('../../../const/rpc').offlineRpc
const TaskDetailResponse = require('../../../ice/offline').offline.TaskDetailResponse
const OfflineTaskInfoResponse = require('../../../ice/offline').offline.OfflineTaskInfoResponse
const CONSTANTS = require('../../../const/constants')
const download = require('download')
const parseTorrent = require('parse-torrent')
const md5 = require('md5');
const TASK_HASH_VALIDATE_KEY = '6065772'
const AwesomeBase64 = require('awesome-urlsafe-base64')
const HASH_SPLIT = '.qzy-sp-token@6cs92d-token.'
let validator = require('validator')


const calcTaskHash = ((taskHash, fileId, taskName) => {
    return AwesomeBase64.encodeString(taskHash +
        HASH_SPLIT +
        fileId.toString() +
        HASH_SPLIT +
        AwesomeBase64.encodeString(taskName) +
        HASH_SPLIT +
        _calcHash(taskHash))
})

const _calcHash = (taskHash => {
    return md5(TASK_HASH_VALIDATE_KEY + taskHash)
})

const decodeTaskHash = (taskHash => {
    if (!taskHash) {
        return undefined
    }
    try {
        taskHash = AwesomeBase64.decodeString(taskHash)
        // console.log(taskHash)
    } catch (exc) {
        return undefined
    }
    let arr = taskHash.split(HASH_SPLIT)
    if (arr.length < 3) {
        return undefined
    }
    let tt = AwesomeBase64.decodeString(arr[2])
    return _calcHash(arr[0], arr[1], tt) === arr[3] ? [arr[0], arr[1], tt] : undefined
})

router.post('/page', (req, res) => {
    //ResponseUtil.Ok(req, res, req.user)
    var pageStr = req.body['page'] ? req.body['page'] + '' : ''
    //var pageStr = req.body['taskHas'] ? req.body['page'] : []
    if (!validator.isInt(pageStr)) {
        pageStr = '1'
    }
    var page = parseInt(pageStr)
    if (page < 1) {
        page = 1
    }
    //
    var pageSizeStr = req.body['pageSize'] ? req.body['pageSize'] + '' : ''
    if (!validator.isInt(pageSizeStr)) {
        pageSizeStr = '20'
    }
    var pageSize = parseInt(pageSizeStr)
    if (pageSize < 1) {
        pageSize = 20
    }
    if (pageSize > 999) {
        pageSize = 999
    }
    let userId = req.user.uuid
    var orderStr = req.body['order'] ? req.body['order'] + '' : ''
    if (!validator.isInt(orderStr)) {
        orderStr = '0'
    }
    userFileRpc.listOfflinePage(userId, page, pageSize, parseInt(orderStr)).then(data => {
        ResponseUtil.Ok(req, res, data)
    }).catch(ex => ResponseUtil.RenderStandardRpcError(req, res, ex))
})

router.post('/remove', (req, res) => {
    //ResponseUtil.Ok(req, res, req.user)
    var taskHash = req.body['taskHash'] ? req.body['taskHash'] : []
    let userId = req.user.uuid
    if (Array.isArray(taskHash)) {
        taskHash = taskHash.map((v) => v.toString())
    } else {
        taskHash = [taskHash + '']
    }
    userFileRpc.removeOfflineTask(userId, taskHash).then(data => {
        ResponseUtil.Ok(req, res, data)
    }).catch(ex => ResponseUtil.RenderStandardRpcError(req, res, ex))
    offlineRpc.removeTask(userId, taskHash)
        .then((data) => {})
        .catch(ex => console.error(ex))
})

router.post('/parseTorrent', (req, res) => {
    var uuid = req.body['uuid'] ? req.body['uuid'] + '' : ''
    var path = req.body['path'] ? req.body['path'] + '' : ''
    if (!uuid && !path) {
        throw new ApiValidateException("File uuid required", '{UUID}_REQUIRED')
    }
    let userId = req.user.uuid
    //get
    userFileRpc.get(uuid, userId, path).then((result) => {
        // first,try to parse.
        getTorrentFileData(req, res, result['storeId'])
    }).catch(error => {
        ResponseUtil.RenderStandardRpcError(req, res, error)
    })
})

router.post('/parseMagnet', (req, res) => {
    var url = req.body['url'] ? req.body['url'] + '' : ''
    if (!url) {
        throw new ApiValidateException("Url required", '{URL}_REQUIRED')
    }
    var torrentInfo = {}
    try {
        torrentInfo = parseTorrent(url)
        // RPC get files...
        // throw new ApiValidateException("Url required", '{URL}_REQUIRED')

    } catch (torrentError) {
        // console.error(torrentError)
        // console.error(url)
        throw new ApiValidateException("Magnet parse fail", 'MAGNET_URL_INVALID')
    }
    let taskHash = torrentInfo['infoHash']
    result = {
        'infoHash': torrentInfo['infoHash'],
    }
    result['name'] = torrentInfo['name'] ? torrentInfo['name'] : torrentInfo['infoHash']
    result['taskHash'] = calcTaskHash(torrentInfo['infoHash'], url, result['name'])
    if (torrentInfo['files']) {
        result['files'] = torrentInfo['files']
    }
    result['server'] = false
    // call rpc to get detail files.
    offlineRpc.getTaskDetailList(taskHash).then(data => {
        // render and format
        if (data.length < 1) {
            ResponseUtil.Ok(req, res, result)
        } else {
            result['server'] = true
            result['files'] = []
            for (let single of data) {
                // convert it to libtorrent 
                let obj = {
                    "path": single['taskUrl'],
                    "name": single['filename'],
                    "length": single['fileSize'],
                    "offset": -1
                }
                result['files'].push(obj)
            }
            ResponseUtil.Ok(req, res, result)
        }
    }).catch(offlineError => {
        console.error(offlineError)
        ResponseUtil.Ok(req, res, result)
    })
    //decode first

    //let userId = req.user.uuid
    //get
    /*
    userFileRpc.get(uuid, userId, path).then((result) => {
        // first,try to parse.
        getTorrentFileData(req, res, result['storeId'])
    }).catch(error => {
        ResponseUtil.RenderStandardRpcError(req, res, error)
    })*/
})

//let renderMagnetResult = (req,res,dar)

router.post('/start', (req, res) => {
    // let fileStoreId = req.body['fileStoreId'] ? req.body['fileStoreId'] + '' : ''
    var url = req.body['url'] ? req.body['url'] + '' : ''
    let savePath = req.body['savePath'] ? req.body['savePath'] + '' : ''
    let saveUuid = req.body['saveUuid'] ? req.body['saveUuid'] + '' : ''
    var taskHashDecode = decodeTaskHash(req.body['taskHash'] ? req.body['taskHash'] + '' : '')
    let files = req.body['files'] ? req.body['files'] + '' : '*'
    var name = req.body['name'] ? req.body['name'] + '' : ''
    var type = parseInt(req.body['type'] ? req.body['type'] + '' : '0')
    var taskHash = taskHashDecode ? taskHashDecode[0] : ''
    let fileStoreId = taskHashDecode ? taskHashDecode[1] : ''
    let userId = req.user.uuid
    let ip = RequestUtil.getIp(req)
    if (!name) {
        name = taskHashDecode ? taskHashDecode[2] : ''
    }
    if (isNaN(type)) {
        throw new ApiValidateException("Type required", '{TYPE}_REQUIRED')
    }
    type = parseInt(type)
    let addon = {}
    if (type === 10) {
        if (!url) {
            url = fileStoreId
        }
        if (!url) {
            throw new ApiValidateException("Task hash [" + url + "] invaliad", '{TASK_HASH}_INVALID')
        }
    }
    if (type === 0) {
        addon['file'] = fileStoreId
        if (!taskHash) {
            throw new ApiValidateException("Task hash required", '{TASK_HASH}_REQUIRED')
        }
        if (!fileStoreId) {
            throw new ApiValidateException("Task hash invalid", '{TASK_HASH}_INVALID')
        }
        url = 'magnet:?xt=urn:btih:' + taskHash
        type = 0
    } else if (url) {
        let urlLow = url.toLocaleLowerCase()
        if (urlLow.startsWith('thunder://')) {
            try {
                url = StringUtil.decodeThunder(url)
                urlLow = url.toLocaleLowerCase()
            } catch (thunderError) {
                throw new ApiValidateException("Thunder parse fail", 'THUNDER_URL_INVALID')
            }
        }
        addon['url'] = url
        if (url.startsWith('magnet:')) {
            type = 10
            try {
                let torrentInfo = parseTorrent(url)
                if (torrentInfo['infoHash'] != taskHash) {
                    taskHash = torrentInfo['infoHash']
                }
            } catch (magnetError) {
                throw new ApiValidateException("Magnet parse fail", 'MAGNET_URL_INVALID')
            }
        } else if (urlLow.startsWith('http://') || urlLow.startsWith('https://') || urlLow.startsWith('ftp://') || urlLow.startsWith('sftp://')) {
            type = 20
            taskHash = md5(url)
            let ldex = url.lastIndexOf('/')
            if (ldex > -1) {
                let sb = url.substring(ldex + 1)
                if (sb) {
                    let odex = sb.lastIndexOf('?')
                    if (odex > -1) {
                        let be = sb.substring(0, odex)
                        if (be) {
                            name = decodeURIComponent(be)
                        }
                    }
                }
            }
        } else {
            console.warn('Cannot decode %s', url)
            throw new ApiValidateException("Url not supported.",
                'URL_INVALID')
        }
    } else {
        throw new ApiValidateException("Url or fileStoreId is needed",
            'URL_OR_FILE_STORE_ID_INVALID')
    }
    //(userId: Long, taskHash: String?, path: String?, name: String?, uuid: String?, current: Current?)
    //
    let iceZero = IceUtil.number2IceLong(0)
    userFileRpc.createOfflineTask(userId,
            taskHash,
            savePath == '' ? null : savePath,
            name ? name : taskHash, files,
            saveUuid == '' ? null : saveUuid)
        .then(data => {
            let current = IceUtil.number2IceLong((new Date().getTime()))
            let createReq = new OfflineTaskInfoResponse(
                taskHash,
                0,
                iceZero,
                iceZero,
                iceZero,
                name,
                type,
                JSON.stringify(addon),
                "",
                current,
                current,
                "", 0,
                userId,
                ip,
                0
            )
            offlineRpc.addTask(createReq).then(createReqResponse => {
                delete createReqResponse['serverId']
                delete createReqResponse['createTime']
                delete createReqResponse['createUser']
                delete createReqResponse['createIp']
                delete createReqResponse['cmds']
                delete createReqResponse['updateTime']
                ResponseUtil.Ok(req, res, createReqResponse)
            }).catch(createError => ResponseUtil.RenderStandardRpcError(req, res, createError))

            // add listeners table..
        }).catch(err => ResponseUtil.RenderStandardRpcError(req, res, err))
})

const getTorrentFileData = (req, res, fileHash) => {
    // get detail.
    cloudStoreRpc.getFile(fileHash).then(torrentFileData => {
        // get files.

        let fileKey = torrentFileData['fileKey']
        let fileSize = torrentFileData['fileSize']
        // let mime = torrentFileData['mime']
        let url = UrlUtil.createInternalDownloadUrl(fileKey)
        //let name = result['name']
        downloadTorrentFile(req, res, fileHash, url, fileSize)
    }).catch(error => ResponseUtil.RenderStandardRpcError(req, res, error))
}

const downloadTorrentFile = (req, res, hash, url, size) => {
    fileSize = IceUtil.iceLong2Number(size)
    download(url).then(data => {
        //fs.writeFileSync('dist/foo.jpg', data)
        let parsedData = parseTorrent(data);
        let result = {}
        result['infoHash'] = parsedData['infoHash']

        //console.log('Calc hash %s',result['taskHash'])
        result['files'] = parsedData['files']
        result['name'] = parsedData['name']
        result['taskHash'] = calcTaskHash(parsedData['infoHash'], hash, result['name'])
        result['comment'] = parsedData['comment']
        result['files'] = parsedData['files']
        result['length'] = parsedData['length']
        result['private'] = parsedData['private']
        ResponseUtil.Ok(req, res, result)
        // Update background torrent info.
        let resList = []
        let count = 0
        let current = IceUtil.number2IceLong(parseInt((new Date()).getTime()))
        // constructor(taskHash = "",
        // taskOrder = 0, 
        // filename = "", 
        //fileSize = new Ice.Long(0, 0), 
        //localPath = "", 
        //serverId = "", 
        //taskUrl = "", 
        //taskFastUrl = "", 
        //operation = 0,
        // taskProgress = 0, 
        //createTime = new Ice.Long(0, 0),
        // updateTime = new Ice.Long(0, 0), 
        //storeType = 0, 
        //storeBucket = "", 
        //storeKey = "",
        // addon = "",
        // status = 0)
        let zeroLong = IceUtil.number2IceLong(0)
        for (let file of result['files']) {
            let response = new TaskDetailResponse(
                result['infoHash'],
                count,
                file['name'],
                IceUtil.number2IceLong(file['length']),
                zeroLong,
                zeroLong,
                "",
                "",
                result['infoHash'],
                "",
                0,
                0,
                current,
                current,
                0,
                "",
                "",
                "",
                0
            )
            count++
            resList.push(response)
        }
        offlineRpc.refreshTorrent(resList, false).then(respData => {
            //check
            if (respData.length != resList.length) {
                console.error("Torrent %s validate error", result['infoHash'])
            }
        }).catch(updateError => {
            console.error(updateError)
        })

    }).catch(error => {
        console.error(error)
        ResponseUtil.ApiError(req, res, new ApiException("FETCH_TORRENT_FAILED", 500, "Download torrent failed."))
    })
}


module.exports = router