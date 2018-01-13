class ResponseUtil {
    static Ok(req, res, data) {
        res.json({ status: 200, result: data, code: "OK", success: true })
    }
}
module.exports = ResponseUtil