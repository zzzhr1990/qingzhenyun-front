const Ice = require("ice").Ice
const ICE = require('../const/constants').ICE

class CommonRpc{
    constructor(adapterName,prx){
        if(!ICE){
            console.error("ICE not initialized")
            return
        }
        // check
        let base = ICE.stringToProxy(adapterName)
        prx.checkedCast(base).then(data => {
            //get sth..
            if(data != null){
                //this._inited = true
                console.log('%s comfirmed.',adapterName)
                console.log(typeof(data["createUploadToken"]))
                for(let xx in data){
                    console.log(xx)
                }
            }else{
                console.log('%s failed.(Server responses null)',adapterName)
                //this._inited = false.
            }

        }).catch((ex)=>{
            console.log('%s failed.',adapterName)
            console.log(ex)
        })
    }
}

module.exports = CommonRpc