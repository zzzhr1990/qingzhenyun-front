class UrlUtil {
    static createInternalDownloadUrl(key) {
        let time = (new Date()).getTime().toString()
        let url = 'http://other.qiecdn.com/'
            + fileKey
            + '?key='
            + time
            + '&userId=-1'
        return url
    }
}

module.exports = UrlUtil