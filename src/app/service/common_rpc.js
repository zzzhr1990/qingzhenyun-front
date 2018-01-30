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
                for(let func of Object.keys(data)){
                    console.log("%s - %s",func, typeof(data[func]))
                }
            }else{
                console.log('%s failed.(Server responses null)',adapterName)
                //this._inited = false
            }

        }).catch((ex)=>{
            console.log('%s failed.',adapterName)
            console.log(ex)
        })
    }
}

module.exports = CommonRpc