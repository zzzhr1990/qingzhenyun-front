/**
 * Module dependencies.
 */
var app = require('./app')
var debug = require('debug')('wxapp-monitor-server:server')
var http = require('http')
var program = require('commander')
const Constants = require('./app/const/constants')
const SmsSender = require('./app/service/sms_sender')

// get port
program.version('0.1.0')
    .option('-p, --port <n>', 'Port, Default 3000')
    .option('-k, --appkey', 'Message app key, Default None')
    .option('-i, --appid', 'Message app id, Default None')
    .parse(process.argv)
/**
 * Get port from environment and store in Express.
 */
let port = normalizePort(process.env.PORT || program.port || '3000')
let appkey = program.appkey
let appid = program.appid
if(!appkey){
    console.log('Set k first before run this application.')
    return
}
if(!appid){
    console.log('Set i first before run this application.')
    return
}
Constants.SMS_SENDER = new SmsSender(appid,appkey)
app.set('port', port)

console.log('Server listen on %d.', port)

/**
 * Create HTTP server.
 */

var server = http.createServer(app)

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port)
server.on('error', onError)
server.on('listening', onListening)

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
    var port = parseInt(val, 10)

    if (isNaN(port)) {
        // named pipe
        return val
    }

    if (port >= 0) {
        // port number
        return port
    }

    return false
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error
    }

    var bind = typeof port === 'string' ?
        'Pipe ' + port :
        'Port ' + port

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges')
            process.exit(1)
        case 'EADDRINUSE':
            console.error(bind + ' is already in use')
            process.exit(1)
        default:
            throw error
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    var addr = server.address()
    var bind = typeof addr === 'string' ?
        'pipe ' + addr :
        'port ' + addr.port
    debug('Listening on ' + bind)
}