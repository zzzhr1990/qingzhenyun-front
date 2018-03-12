const QcloudSms = require("qcloudsms_js");
const randomstring = require("randomstring");

class SmsSender {
    constructor(appid, appkey) {
        this.qcloudsms = QcloudSms(appid, appkey);
    }

    sendRegisterMessage(phoneNumber, validateCode, expireInMinutes = 5) {
        let countryCode = "86"
        let templId = "93861"
        let ssender = this.qcloudsms.SmsSingleSender();
        let messageId = randomstring.generate(12)
        //nationCode, phoneNumber, templId, params, sign, extend, ext, callback
        ssender.sendWithParam(countryCode, phoneNumber, templId, [validateCode, expireInMinutes.toString()], "", "", messageId,
            (err, res, resData) => {
                if (err)
                    console.log("err: ", err);
                else
                    console.log("response data: ", resData);
                if(res){
                    console.log("res: ", res);
                }
            });
    }
}
module.exports = SmsSender