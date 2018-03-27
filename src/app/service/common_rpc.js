//const Ice = require('ice').Ice
//const ICE = require('../const/constants').ICE
const logger = require('log4js').getLogger('CommonRpc')
logger.level = 'info'

class CommonRpc{
    constructor(ice,adapterName,prx){
        
        // check
        let base = ice.stringToProxy(adapterName)
        this._data = undefined
        prx.checkedCast(base).then(data => {
            //get sth..
            if(data != null){
                this._data = data
                
                logger.info('%s comfirmed.',adapterName)
                for(let xx in data){
                    let v = data[xx]
                    if(typeof(v) == 'function'){
                        if(!xx.startsWith('ice_')){
                            this[xx] = (...args) => data[xx](...args)
                        }
                    }
                }
                this._inited = true
            }else{
                logger.error('%s failed.(Server responses null)',adapterName)
                this._inited = false
            }

        }).catch((ex)=>{
            logger.error('%s failed.',adapterName)
            logger.error(ex)
            this._inited = false
        })
    }

    get rpc(){
        if(!this._inited){
            throw new Error('RPC not inited.')
        }
        return this._data
    }
}

module.exports = CommonRpc