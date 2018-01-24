var express = require('express')
var router = express.Router()
//router.use('/test', require('./test'))
//router.use('/user', require('./user'))
router.use('/files', require('./files'))
module.exports = router