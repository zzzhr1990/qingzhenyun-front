let express = require('express')
let router = express.Router()
let ApiException = require('../../../exception/api_exception')
let ResponseUtil = require('../../../util/response_util')
let userService = require('../../../service/user_service')

router.post('/:methodId', (req, res) => {
    let method = req.params.methodId
    ResponseUtil.Ok(req, res, method)
})

router.get('/date', (req, res) => {
    let time = Date.now()
    ResponseUtil.Ok(req, res, time)
})

router.get('/test', (req, res) => {
    let time = Date.now()
    userService.test()
    ResponseUtil.Ok(req, res, time)
})
module.exports = router
