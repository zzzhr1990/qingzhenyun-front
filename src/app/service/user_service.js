let path = require('path')
const thrift = require('thrift');
const RemoteUserService = require('../thrift/UserService')
const userServiceTypes = require('../thrift/user_service_types')
const assert = require('assert');

const transport = thrift.TFramedTransport
const protocol = thrift.TBinaryProtocol;

class UserService{
    constructor(){
        // init sth
        this.connection = thrift.createConnection("localhost", 9999, {
            transport: transport,
            protocol: protocol
        });
        this.connection.on('error', function (err) {
            // assert(false, err);
            console.error('Connect to %s error. %s','localhost:9999', err)
        });
        this._client = thrift.createClient(RemoteUserService, this.connection)
    }

    get client(){
        return this._client
    }
}

module.exports = new UserService().client

/*
var PROTO_PATH = path.join(__dirname, '/../../proto/grpc/user.proto')
var grpc = require('grpc')
// let validator = require('validator')
// import validator from 'validator'
var Service = grpc.load(PROTO_PATH)

class UserService extends Service.com.qingzhenyun.grpc.user.UserService {

    constructor(address) {
        super(address, grpc.credentials.createInsecure())
    }


    test() {
        this.getUserByName({ 'name': '' }, (err, data) => {
            if (err) {
                console.log(err)
                console.log(err.code)
                console.log(err.metadata)
                console.log(err.message)
            } else {
                console.log(data)
            }
        })
    }
}
module.exports = new UserService('127.0.0.1:8964')
*/