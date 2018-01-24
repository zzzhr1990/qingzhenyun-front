const express = require('express')
const router = express.Router()
const ApiException = require('../../../exception/api_exception')
const ApiValidateException = require('../../../exception/api_validate_exception')
const StringUtil = require('../../../util/string_util')
const ResponseUtil = require('../../../util/response_util')
let UserFileServiceRpc = require('../../../service/user_file')
let userFileService = new UserFileServiceRpc(process.argv)



// List User Files...
router.post('/list', (req, res) => {
    ResponseUtil.Ok(req, res, req.user)
})

module.exports = router