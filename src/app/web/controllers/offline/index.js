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
const download = require('download')
var parseTorrent = require('parse-torrent')


router.post('/torrent', (req, res) => {
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

const getTorrentFileData = (req, res, fileHash) => {
    // get detail.
    cloudStoreRpc.getFile(fileHash).then(torrentFileData => {
        // get G 
        let time = (new Date()).getTime().toString()
        let fileKey = torrentFileData['fileKey']
        let fileSize = torrentFileData['fileSize']
        // let mime = torrentFileData['mime']
        let url = 'http://other.qiecdn.com/'
            + fileKey
            + '?key='
            + time
            + '&userId=-1'
        //let name = result['name']
        downloadTorrentFile(req, res, fileHash, url, fileSize)
    }).catch(error => ResponseUtil.RenderStandardRpcError(req, res, error))
}

const downloadTorrentFile = (req, res, hash, url, size) => {
    fileSize = IceUtil.iceLong2Number(size)
    download(url).then(data => {
        //fs.writeFileSync('dist/foo.jpg', data)
        Response.Ok(req,res,parseTorrent(data))
    }).catch(error => {
        console.error(error)
        ResponseUtil.ApiError(req, res, new ApiException("FETCH_TORRENT_FAILED", 500, "Download torrent failed."))
    })
}

module.exports = router