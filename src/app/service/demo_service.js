const Ice = require("ice").Ice
const Demo = require('../thrift/demo').Demo
//const outer = {}
class DemoService {
    constructor() {
        let ic = Ice.initialize()
        this._out = {}
        let base = ic.stringToProxy("TestAdapter:default -p 9999")
        //let out = {}
        Demo.testPrx.checkedCast(base).then((data) => {
            this._out = data
            this._out.execute("a", "b").then((dat) => {
                console.log('Recv deta %s', dat)
                console.log(dat)
            })
        })
    }
    get out(){
        return this._out
    }
}
module.exports = new DemoService()