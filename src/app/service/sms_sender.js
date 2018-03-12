const QcloudSms = require("qcloudsms_js");
const randomstring = require("randomstring");

class SmsSender {
    constructor(appid, appkey) {
        this.qcloudsms = QcloudSms(appid, appkey);
        this.appid = appid
        this.appkey = appkey
        console.log("Init QcloudSms %s:%s", appid, appkey)
    }
    
    async sendRegisterMessage(phoneNumber, validateCode, expireInMinutes = 5) {
        let countryCode = "86"
        let templId = "94257"
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
                    if(err){
                        console.error(err)
                    }
                    if(resData){
                        console.error(err)
                    }
                    reject(new Error('SendMessage Error'))
                }
            })
        })
    }

}
module.exports = SmsSender