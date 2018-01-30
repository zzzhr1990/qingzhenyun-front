/* ICE USER FILE SERVERCE */
const Ice = require("ice").Ice
const store = require('../ice/cloudstore').store
const ICE = require('../const/constants').ICE
class CloudStoreService{
    constructor(init_str) {
        //--Ice.Default.Locator=IceGrid/Locator:tcp -h localhost -p 4061
        //let ic = Ice.initialize(args)
        this._out = {}
        this._inited = false
        let base = ICE.stringToProxy(init_str?init_str:"CloudStoreServiceHandler")
        //let out = {}
        store.CloudStoreServiceHandlerPrx.checkedCast(base).then((data) => {
            this._out = data
            /*
            this._out.execute("a", "b").then((dat) => {
                console.log('Recv deta %s', dat)
                console.log(dat)
            })
            */
            if(data != null){
                this._inited = true
                console.log('CloudStoreServiceHandlerPrx comfirmed.')
            }else{
                console.log('CloudStoreServiceHandlerPrx failed.(Server responses null)')
                this._inited = false
            }
            
        }).catch((ex)=>{
            this._inited = false
            console.log('CloudStoreServiceHandlerPrx failed.')
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
            throw new Error('CloudStoreServiceHandlerPrx not init.')
        }
        return this._out
    }
    get rpc(){
        return this.caller
    }
}
module.exports = CloudStoreService
