/* ICE USER SERVERCE */
const Ice = require("ice").Ice
const user = require('../ice/userservice').user
const ICE = require('../const/constants').ICE
class UserService{
    constructor(init_str) {
        //--Ice.Default.Locator=IceGrid/Locator:tcp -h localhost -p 4061
        //let ic = Ice.initialize(args)
        this._out = {}
        this._inited = false
        let base = ICE.stringToProxy(init_str?init_str:"UserServiceHandler")
        //let out = {}
        user.UserServiceHandlerPrx.checkedCast(base).then((data) => {
            this._out = data
            /*
            this._out.execute("a", "b").then((dat) => {
                console.log('Recv deta %s', dat)
                console.log(dat)
            })
            */
            if(data != null){
                this._inited = true
                console.log('UserServiceHandlerPrx comfirmed.')
            }else{
                console.log('UserServiceHandlerPrx failed.(Server responses null)')
                this._inited = false
            }
        }).catch((ex)=>{
            this._inited = false
            console.log('UserServiceHandlerPrx failed.')
            console.log(ex)
        })
        
    }
    /*
    get out(){
        return this._out
    }
    */
    get caller(){
        if(!this._inited){
            throw new Error('UserServiceHandlerPrx not init.')
        }
        return this._out
    }
    get rpc(){
        return this.caller
    }
}
module.exports = UserService
/*
let path = require('path')
const thrift = require('thrift');
const RemoteUserService = require('../thrift/UserService')
const userServiceTypes = require('../thrift/user_service_types')
const assert = require('assert');

const transport = thrift.TFramedTransport
const protocol = thrift.TCompactProtocol;

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
        thrift.createClient
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