const jwt = require("jsonwebtoken")


const authentication = function (req, res, next) {
    try {
        const token = req.headers["x-api-key"]
        if (!token) {
            res.status(404).send({ status: false, msg: "token is Required" })
        }

        let decodeToken = jwt.verify(token, "group26")
        if (!decodeToken) {
            res.status(404).send({ status: false, msg: "Invalid token" })
        }
        req.userId = decodeToken.userId

        next()
    }
    catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }
}



module.exports.authentication = authentication;
