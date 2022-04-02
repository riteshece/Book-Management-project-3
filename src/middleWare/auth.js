const jwt = require("jsonwebtoken")


const authentication = function (req, res, next) {
    try {
        const token = req.headers["x-api-key"]
        if (!token) {
           return res.status(404).send({ status: false, msg: "token is Required" })
        }

        let decodeToken = jwt.verify(token, "group26",{ignoreExpiration:true})

        let expire = decodeToken.exp
        let iat = Math.floor(Date.now() / 1000)
        if(expire<iat){
           return res.status(401).send({status:false,msg:"token is expired"})
        }

        if (!decodeToken) {
           return res.status(404).send({ status: false, msg: "Invalid token" })
        }
        req.userId = decodeToken.userId

        next()
    }
    catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }
}



module.exports.authentication = authentication;
