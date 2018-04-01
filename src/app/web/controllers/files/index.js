const express = require('express')
const router = express.Router()
//const ApiException = require('../../../exception/api_exception')
const ApiValidateException = require('../../../exception/api_validate_exception')
// const _ = require('../../../util/string_util')
//const IceUtil = require('../../../util/ice_util')
const ResponseUtil = require('../../../util/response_util')
//let UserFileServiceRpc = require('../../../service/user_file')
let userFileService = require('../../../const/rpc').userFileRpc
let SimpleFile = require('../../../ice/userfile').SimpleFile
//let cloudStoreRpc = require('../../../const/rpc').cloudStoreRpc
let validator = require('validator')
let CONSTANTS = require('../../../const/constants')



// List User Files...
/*
router.post('/list', (req, res) => {
    ResponseUtil.Ok(req, res, req.user)
})

router.post('/get', (req, res) => {
    var uuid = req.body['uuid'] ? req.body['uuid'] + '' : ''
    var name = req.body['name'] ? req.body['name'] + '' : ''
    if (!uuid && !name) {
        throw new ApiValidateException('File uuid required', '{UUID}_REQUIRED')
    }
    let userId = req.user.uuid
    //get
    userFileService.get(uuid, userId, name).then((result) => ResponseUtil.Ok(req, res, result))
        .catch((error) => {
            if (error['innerCode']) {
                ResponseUtil.ApiError(req, res, new ApiException(error['innerMessage'], 400, error['innerMessage']))
            } else {
                ResponseUtil.Error(req, res, error)
            }
        })
})

router.post('/download', (req, res) => {
    var uuid = req.body['uuid'] ? req.body['uuid'] + '' : ''
    var name = req.body['name'] ? req.body['name'] + '' : ''
    if (!uuid && !name) {
        throw new ApiValidateException('File uuid required', '{UUID}_REQUIRED')
    }
    let userId = req.user.uuid
    //get
    userFileService.get(uuid, userId, name).then((result) => {
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
            let time = (new Date()).getTime().toString()
            let fileKey = fileData['fileKey']
            let fileHash = storeId
            let fileSize = fileData['fileSize']
            let mime = fileData['mime']
            let url = 'http://other.qiecdn.com/' +
                fileKey +
                '?key=' +
                time +
                '&userId=' + IceUtil.iceLong2Number(userId).toString()
            let name = result['name']
            ResponseUtil.Ok(req, res, {
                'fileSize': fileSize,
                'hash': fileHash,
                'name': name,
                'mime': mime,
                'url': url
            })
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



router.post('/rename', (req, res) => {
    var uuid = req.body['uuid']
    if (!uuid) {
        throw new ApiValidateException('File uuid required', '{UUID}_REQUIRED')
    }
    let userId = req.user.uuid
    var name = req.body['name']
    if (!name) {
        throw new ApiValidateException('File name required', '{NAME}_REQUIRED')
    }

    //get
    userFileService.rename(uuid, userId, name).then((result) => ResponseUtil.Ok(req, res, result))
        .catch((error) => {
            if (error['innerCode']) {
                ResponseUtil.ApiError(req, res, new ApiException(error['innerMessage'], 400, error['innerMessage']))
            } else {
                ResponseUtil.Error(req, res, error)
            }
        })
})

router.post('/recycle', (req, res) => {
    let uuid = req.body['uuid']
    let recycle = req.body['recycle']
    if (Array.isArray(uuid)) {
        uuid = uuid.map(a => a.toString())
    } else {
        if (uuid) {
            uuid = [uuid.toString()]
        }
    }
    if (!uuid) {
        throw new ApiValidateException('File uuid required', '{UUID}_REQUIRED')
    }
    if (!recycle) {
        recycle = true
    } else {
        let cx = recycle.toString()
        if (cx == '1' || cx == 'true' || cx == 'yes') {
            recycle = true
        }
    }
    let userId = req.user.uuid
    //get
    userFileService.batchRecycle(uuid, userId, recycle).then((result) => ResponseUtil.Ok(req, res, result))
        .catch((error) => {
            if (error['innerCode']) {
                ResponseUtil.ApiError(req, res, new ApiException(error['innerMessage'], 400, error['innerMessage']))
            } else {
                ResponseUtil.Error(req, res, error)
            }
        })
})

*/
router.post('/test', async (req, res) => {
    try {
        let response = await userFileService.rpc.test([new SimpleFile('a','b')])
        ResponseUtil.Ok(req, res, response)
    } catch (error) {
        ResponseUtil.RenderStandardRpcError(req, res, error)
    }
})

router.post('/test2', async (req, res) => {
    try {
        let response = await userFileService.rpc.test2(new SimpleFile('a','b'))
        ResponseUtil.Ok(req, res, response)
    } catch (error) {
        ResponseUtil.RenderStandardRpcError(req, res, error)
    }
})

router.post('/move', async (req, res) => {
    try {
        let task = []
        let uuid = req.body['uuid']
        if (Array.isArray(uuid)) {
            //uuid = uuid.map(a => a.toString())
            uuid.forEach((k) => task.push(new SimpleFile(k,'')))
            
        } else {
            if (uuid) {
                task.push(new SimpleFile(uuid.toString(),''))
            } 
        } //
        
        let path = req.body['path']
        if (Array.isArray(path)) {
            //path = path.map(a => a.toString())
            path.forEach((k) => task.push(new SimpleFile('',k)))
        } else {
            if (path) {
                task.push(new SimpleFile('',path.toString()))
            } 
        } //
        let userId = req.user.uuid
        let parent = req.body['parent'] ? req.body['parent'] + '' : ''
        let destPath = req.body['destPath'] ? req.body['destPath'] + '' : ''
        let overwrite = req.body['overwrite']
        if (!overwrite) {
            overwrite = false
        } else {
            let cx = overwrite.toString()
            if (cx == '1' || cx == 'true' || cx == 'yes') {
                overwrite = true
            }
        }
        //get
        let response = await userFileService.rpc.move(userId, task, parent, destPath, overwrite)
        ResponseUtil.Ok(req, res, response)
    } catch (error) {
        ResponseUtil.RenderStandardRpcError(req, res, error)
    }
})

router.post('/recycle', async (req, res) => {
    try {
        let task = []
        let uuid = req.body['uuid']
        if (Array.isArray(uuid)) {
            //uuid = uuid.map(a => a.toString())
            uuid.forEach((k) => task.push(new SimpleFile(k,'')))
            
        } else {
            if (uuid) {
                task.push(new SimpleFile(uuid.toString(),''))
            } 
        } //
        
        let path = req.body['path']
        if (Array.isArray(path)) {
            //path = path.map(a => a.toString())
            path.forEach((k) => task.push(new SimpleFile('',k)))
        } else {
            if (path) {
                task.push(new SimpleFile('',path.toString()))
            } 
        } //
        let userId = req.user.uuid
        
        //get
        let response = await userFileService.rpc.recycle(userId, task, task)
        ResponseUtil.Ok(req, res, response)
    } catch (error) {
        ResponseUtil.RenderStandardRpcError(req, res, error)
    }
})

router.post('/remove', async (req, res) => {
    try {
        let task = []
        let uuid = req.body['uuid']
        if (Array.isArray(uuid)) {
            //uuid = uuid.map(a => a.toString())
            uuid.forEach((k) => task.push(new SimpleFile(k,'')))
            
        } else {
            if (uuid) {
                task.push(new SimpleFile(uuid.toString(),''))
            } 
        } //
        
        let path = req.body['path']
        if (Array.isArray(path)) {
            //path = path.map(a => a.toString())
            path.forEach((k) => task.push(new SimpleFile('',k)))
        } else {
            if (path) {
                task.push(new SimpleFile('',path.toString()))
            } 
        } //
        let userId = req.user.uuid
        
        //get
        let response = await userFileService.rpc.remove(userId, task, task)
        ResponseUtil.Ok(req, res, response)
    } catch (error) {
        ResponseUtil.RenderStandardRpcError(req, res, error)
    }
})

router.post('/page', async (req, res) => {
    try {
        let pageStr = req.body['page'] ? req.body['page'] + '' : ''
        if (!validator.isInt(pageStr)) {
            pageStr = '1'
        }
        let page = parseInt(pageStr)
        if (page < 1) {
            page = 1
        }
        let pageSizeStr = req.body['pageSize'] ? req.body['pageSize'] + '' : ''
        if (!validator.isInt(pageSizeStr)) {
            pageSizeStr = '20'
        }
        let pageSize = parseInt(pageSizeStr)
        if (pageSize < 1) {
            pageSize = 20
        }
        if (pageSize > 999) {
            pageSize = 999
        }
        let parent = req.body['parent']
        if (!parent) {
            parent = ''
        } else {
            parent += ''
        }
        let path = req.body['path']
        if (!path) {
            path = ''
        } else {
            path += ''
        }
        let orderBy = parseInt(req.body['orderBy'])
        if (isNaN(orderBy)) {
            orderBy = -1
        }
        let recycle = parseInt(req.body['recycle'])
        if (isNaN(recycle)) {
            recycle = CONSTANTS.NO_RECYCLED
        }
        let typeStr = req.body['type'] !== undefined ? req.body['type'] + '' : '-1'
        if (!validator.isInt(typeStr)) {
            typeStr = '-1'
        }
        let type = parseInt(typeStr)
        // let type = CONSTANTS.DIRECTORY_TYPE
        let userId = req.user.uuid
        // listDirectoryPage(userId: Long, parent: String?, path: String?, fileType: Int, recycle: Int, page: Int, pageSize: Int, orderBy: Int
        let data = await userFileService.listDirectoryPage(userId, parent, path, type, recycle, page, pageSize, orderBy)
        ResponseUtil.Ok(req, res, data)
    } catch (error) {
        ResponseUtil.RenderStandardRpcError(req, res, error)
    }
})

router.post('/list', async (req, res) => {
    try {
        let startStr = req.body['start'] ? req.body['start'] + '' : ''
        if (!validator.isInt(startStr)) {
            startStr = '-1'
        }
        let start = parseInt(startStr)
        if (start < -1) {
            start = -1
        }
        let sizeStr = req.body['size'] ? req.body['size'] + '' : ''
        if (!validator.isInt(sizeStr)) {
            sizeStr = '20'
        }
        let size = parseInt(sizeStr)
        if (size < 1) {
            size = 20
        }
        if (size > 999) {
            size = 999
        }
        let parent = req.body['parent']
        if (!parent) {
            parent = ''
        } else {
            parent += ''
        }
        let path = req.body['path']
        if (!path) {
            path = ''
        } else {
            path += ''
        }
        let orderBy = parseInt(req.body['orderBy'])
        if (isNaN(orderBy)) {
            orderBy = -1
        }
        let recycle = parseInt(req.body['recycle'])
        if (isNaN(recycle)) {
            recycle = CONSTANTS.NO_RECYCLED
        }
        let typeStr = req.body['type'] !== undefined ? req.body['type'] + '' : '-1'
        if (!validator.isInt(typeStr)) {
            typeStr = '-1'
        }
        let type = parseInt(typeStr)
        let userId = req.user.uuid
        // listDirectoryPage(userId: Long, parent: String?, path: String?, fileType: Int, recycle: Int, page: Int, pageSize: Int, orderBy: Int
        let data = await userFileService.listDirectory(userId, parent, path, type, recycle, start, size, orderBy)
        ResponseUtil.Ok(req, res, data)
    } catch (error) {
        ResponseUtil.RenderStandardRpcError(req, res, error)
    }
})

router.post('/get', async (req, res) => {
    // get(userId: Long, uuid: String?, path: String?)
    try {
        let uuid = req.body['uuid'] ? req.body['uuid'] + '' : ''
        let path = req.body['path'] ? req.body['path'] + '' : ''
        let userId = req.user.uuid
        let data = await userFileService.get(userId, uuid, path)
        ResponseUtil.Ok(req, res, data)
    } catch (error) {
        ResponseUtil.RenderStandardRpcError(req, res, error)
    }
})

router.post('/createDirectory', async (req, res) => {
    try {
        let parent = req.body['parent']
        if (!parent) {
            parent = ''
        }
        let userId = req.user.uuid
        let name = req.body['name']
        let path = req.body['path']
        let autoRename = req.body['autoRename']
        if (!name && !path) {
            name = 'New Directory Created by:' + new Date()
        }
        if (!name) {
            name = ''
        }
        if (!path) {
            path = ''
        }
        if (path) {
            if (path.length > 2048) {
                throw new ApiValidateException('File path too long', 'FILE_PATH_TOO_LONG')
            }
            let opath = path.replace(/\\/g, '/')
            let pathSplit = opath.split('/')
            if (pathSplit.length > 1024) {
                throw new ApiValidateException('File path too much', 'FILE_PATH_TOO_MATCH')
            }
        }
        if (!autoRename) {
            autoRename = false
        } else {
            let cx = autoRename.toString()
            if (cx == '1' || cx == 'true' || cx == 'yes') {
                autoRename = true
            }
        }
        //createDirectory(long userId, string path, string name,bool autoRename)
        //(userId: Long, parent:String,path: String?, name: String?, autoRename: Boolean
        let data = await userFileService.createDirectory(userId, parent, path, name, false)
        ResponseUtil.Ok(req, res, data)
    } catch (error) {
        ResponseUtil.RenderStandardRpcError(req, res, error)
    }
})

module.exports = router