const QcloudSms = require("qcloudsms_js");
const randomstring = require("randomstring");

class SmsSender {
    constructor(appid, appkey) {
        this.qcloudsms = QcloudSms(appid, appkey);
        this.appid = appid
        this.appkey = appkey
        console.log("Init QcloudSms %s:%s", appid, appkey)
    }
    
    async sendRegisterMessage(phoneNumber, validateCode,countryCode = '86', expireInMinutes = 5) {
        let templId = "94257"
        return this.sendWithParam(countryCode, phoneNumber, templId, [validateCode, expireInMinutes.toString()])
    }
    async sendCommonMessage(phoneNumber, validateCode,templId,countryCode = '86', expireInMinutes = 5) {
        return this.sendWithParam(countryCode, phoneNumber, templId, [validateCode, expireInMinutes.toString()])
    }
    sendWithParam(countryCode, phoneNumber, templId, args) {
        let ssender = this.qcloudsms.SmsSingleSender();
        let messageId = randomstring.generate(12)
        return new Promise((reslove, reject) => {
            ssender.sendWithParam(countryCode, phoneNumber, templId, args, "", "", messageId, (err, res, resData) => {
                let success = false
                if(resData){
                    success = resData['result'] === 0
                }
                if(success){
                    reslove(resData)
                }else{
                    let code = 0
                    if(err){
                        console.error(err)
                    }
                    if(resData){
                        console.error("Return fail")
                        code = resData['result']
                        console.error(resData)
                    }
                    reject(code)
                }
            })
        })
    }

}
module.exports = SmsSender