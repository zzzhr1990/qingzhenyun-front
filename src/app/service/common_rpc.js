const Ice = require("ice").Ice
//const ICE = require('../const/constants').ICE

class CommonRpc{
    constructor(ice,adapterName,prx){
        let base = ice.stringToProxy(adapterName)
        prx.checkedCast(base).then(data => {
            //get sth..
            if(data != null){
                console.log('%s comfirmed.',adapterName)
                for(let xx in data){
                    let v = data[xx]
                    if(typeof(v) == 'function'){
                        if(!xx.startsWith("ice_")){
                            this[xx] = (...args) => data[xx](...args)
                        }
                    }
                }
            }else{
                console.log('%s failed.(Server responses null)',adapterName)
            }

        }).catch((ex)=>{
            console.log('%s failed.',adapterName)
            console.log(ex)
        })
    }
}

module.exports = CommonRpc