var path = require('path')
var PROTO_PATH = path.join(__dirname, '/../../proto/grpc/user.proto')
var grpc = require('grpc')
var Service = grpc.load(PROTO_PATH)
class UserService extends Service.com.qingzhenyun.grpc.user.UserService {
    
    constructor(address) {
        super(address, grpc.credentials.createInsecure())
        let client = new grpc.Client(address,grpc.credentials.createInsecure())
        let xx = new Service.com.qingzhenyun.grpc.user.UserService()
        //super(client)
        //grpc.status.NOT_FOUND
        //grpc.Client()
        //console.log(this)
    }

    

    //new example.RouteGuide('localhost:50051', grpc.credentials.createInsecure());
    test(){
        this.getUserByName({'name':''},(err,data)=>{
            if(err){
                console.log(err)
                console.log(err.code)
                console.log(err.metadata)
                console.log(err.message)
            }else{
                console.log(data)
            }
        })
    }
}
module.exports = new UserService('127.0.0.1:8964')