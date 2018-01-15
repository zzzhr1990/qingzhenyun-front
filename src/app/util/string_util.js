class StringUtil {
    static isEmpty(str) {
        if(!str){
            return true
        }
        if(typeof(str) != 'string'){
            return true
        }
        if(str.length < 1){
            return true
        }
        return false
    }
}
module.exports = StringUtil