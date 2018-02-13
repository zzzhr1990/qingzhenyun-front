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
        let content = thunderUrl.replace(/\n/g, '');
        if (content.indexOf('thunder://') === -1) {
            throw new Error('url format error');
        }
        content = content.substring(10, content.length);
        let result = Buffer.from(content, 'base64').toString('utf8');
        return result.substr(2, result.length - 4);
    }
}
module.exports = StringUtil