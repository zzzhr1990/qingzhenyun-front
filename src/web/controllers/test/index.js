let express = require('express')
let router = express.Router()

router.post('/:methodId', (req, res) => {
    let method = req.params.methodId
    /*
    try {
        res.json({ result: 0, errorMsg: '', data: {'a':'b'} })
    } catch (error) {
        res.json({ result: 1, errorMsg: error })
    }
    */
    throw new Error('F@@@@@@@@K')
})
module.exports = router
