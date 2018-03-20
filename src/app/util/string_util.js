const TASK_HASH_VALIDATE_KEY = '6065772'
const AwesomeBase64 = require('awesome-urlsafe-base64')
const HASH_SPLIT = '.qzy-sp-token@6cs92d-token.'
const md5 = require('md5')
class StringUtil {
    static isEmpty(str) {
        if (!str) {
            return true
        }
        if (typeof (str) != 'string') {
            return true
        }
        if (str.length < 1) {
            return true
        }
        return false
    }

    static decodeThunder(thunderUrl) {
        let content = thunderUrl.replace(/\n/g, '')
        if (content.indexOf('thunder://') === -1) {
            throw new Error('url format error')
        }
        content = content.substring(10, content.length)
        let result = Buffer.from(content, 'base64').toString('utf8')
        return result.substr(2, result.length - 4)
    }

    static encodeHashStrings(...strings){
        let result = ''
        for(let xArg of strings){
            result += (AwesomeBase64.encodeString(xArg + '') + HASH_SPLIT)
        }
        console.log(result + TASK_HASH_VALIDATE_KEY)
        return AwesomeBase64.encodeString(result + md5(result + TASK_HASH_VALIDATE_KEY))
    }

    static decodeHashStrings(value){
        if(!value){
            return undefined
        }
        if(typeof(value) !== 'string'){
            return undefined
        }
        // This Decode
        try {
            value = AwesomeBase64.decodeString(value)
            // console.log(taskHash)
        } catch (exc) {
            return undefined
        }
        let arr = value.split(HASH_SPLIT)
        if(arr.length < 2){
            return undefined
        }
        let hashed = arr[arr.length - 1]
        let before = ''
        let result = []
        for(let i = 0;i< arr.length -1;i++){
            try{
                let val = AwesomeBase64.decodeString(arr[i])
                result.push(val)
                before += val + HASH_SPLIT
            }catch(error){
                console.error(error)
                return undefined
            }
        }
        console.log(before + TASK_HASH_VALIDATE_KEY)
        console.log(hashed)
        let validate = md5(before + TASK_HASH_VALIDATE_KEY) === hashed
        return validate ? result : undefined
        /*
        let result = ''
        for(let xArg of strings){
            result += (xArg + '' + HASH_SPLIT)
        }
        return result + md5(result + TASK_HASH_VALIDATE_KEY)
        */
    }
}
module.exports = StringUtil