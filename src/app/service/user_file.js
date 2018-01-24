/* ICE USER FILE SERVERCE */
const Ice = require("ice").Ice
const userfile = require('../ice/userfile').userfile
const user = require('../ice/userservice').user
class UserFileService{
    constructor(args,init_str) {
        //--Ice.Default.Locator=IceGrid/Locator:tcp -h localhost -p 4061
        let ic = Ice.initialize(args)
        this._out = {}
        this._inited = false
        let base = ic.stringToProxy(init_str?init_str:"UserFileServiceHandler")
        let base2 = ic.stringToProxy(init_str?init_str:"UserServiceHandler")
        //let out = {}
        userfile.UserFileServiceHandlerPrx.checkedCast(base).then((data) => {
            this._out = data
            /*
            this._out.execute("a", "b").then((dat) => {
                console.log('Recv deta %s', dat)
                console.log(dat)
            })
            */
            this._inited = true
            console.log('UserFileServiceHandlerPrx comfirmed.')
            data.createDirectory('','44ea6235-299e-44bc-93c1-943acc19362d','abc').then(dat => console.log(dat)).catch(exc => console.log(exc))
        }).catch((ex)=>{
            this._inited = false
            console.log('UserFileServiceHandlerPrx failed.')
            console.log(ex)
        })

        user.UserServiceHandlerPrx.checkedCast(base2).then((ppp) => {
            //this._out = data
            /*
            this._out.execute("a", "b").then((dat) => {
                console.log('Recv deta %s', dat)
                console.log(dat)
            })
            */
            ///this._inited = true
            console.log('UserServiceHandlerPrx comfirmed.')
            console.log(ppp)
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
            throw new Error('UserFileServiceHandlerPrx not init.')
        }
        return this._out
    }
    get rpc(){
        return this.caller
    }
}
module.exports = UserFileService
