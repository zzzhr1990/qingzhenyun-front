const Ice = require("ice").Ice
class CommonRpc{
    constructor(ice,adapterName,prx){
        let base = ice.stringToProxy(adapterName)
        prx.checkedCast(base).then(data => {
            if(data != null){
                console.log('%s comfirmed.',adapterName)
                for(let functionName in data){
                    let f = data[functionName]
                    if(typeof(f) == 'function'){
                        if(!functionName.startsWith("ice_")){
                            this[functionName] = (...args) => f(...args)
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