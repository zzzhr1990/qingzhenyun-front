var express = require('express')
// var path = require('path')
// var favicon = require('serve-favicon')
var helmet = require('helmet')
var logger = require('morgan')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')

var app = express()

// common config
app.use(logger('dev'))
app.use(cookieParser())
app.use(helmet())

// parser json to object
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

// controller
app.use(require('./web/controllers'))

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Recource not found.')
    err.status = 404
    err.code = 'RESOURCE_NOT_FOUND'
    next(err)
})

// error handler
app.use(function (err, req, res, next) {
    let status = err.status || 500
    res.status(status)
    let data = { message: err.message }
    if (err['code']) {
        data.code = err["code"]
    }else{
        data.code = 'INTERNAL_SERVER_ERROR'
    }
    data.status = status
    res.json(data)
})

module.exports = app
