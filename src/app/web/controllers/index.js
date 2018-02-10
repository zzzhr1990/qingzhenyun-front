var express = require('express')
var router = express.Router()
//router.use('/test', require('./test'))
router.use('/user', require('./user'))
router.use('/files', require('./files'))
router.use('/store', require('./store'))
router.use('/preview', require('./preview'))
router.use('/offline', require('./offline'))
module.exports = router