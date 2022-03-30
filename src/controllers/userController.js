const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const { find } = require("../models/userModel");


const createUser = async function (req, res) {
    try {
        let data = req.body;

        const { title, name, phone, email, password, address } = data

        //Mandatory validation
        if (!data) {
            return res.status(400).send({ status: false, msg: "No Parameter Passed" })
        }
        if (!title) {
            return res.status(400).send({ status: false, msg: "No Title is Passed" })
        }
        if (!name) {
            return res.status(400).send({ status: false, msg: "Name is required" })
        }
        if (!phone) {
            return res.status(400).send({ status: false, msg: "phone is required" })
        }
        if (!email) {
            return res.status(400).send({ status: false, msg: "email is required" })
        }
        if (!password) {
            return res.status(400).send({ status: false, msg: "password is required" })
        }
        if (!address) {
            return res.status(400).send({ status: false, msg: "address is required" })
        }

        //format validation
        if (!(/^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[789]\d{9}$/.test(phone))) {
            return res.status(400).send({ status: false, msg: "Not a valid Number provide valid phone Number" })
        }

        if (!(/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(email))) {
            return res.status(400).send({ status: false, msg: "Not a valid Email provide valid email" })
        }

        if (!(password.length > 8 && password.length < 15)) {
            return res.status(400).send({ status: false, msg: "Invalid Password" })
        }

        //unique validation
        let searchPhone = await userModel.findOne({ phone })
        if (searchPhone) {
            return res.status(400).send({ status: false, msg: "Phone Number is already present" })
        }

        let searchEmail = await userModel.findOne({ email })
        if (searchEmail) {
            return res.status(400).send({ status: false, msg: "Email is already present" })
        }

        let saveData = await userModel.create(data)
        return res.status(201).send({ status: false, msg: "User Created Successfully", data: saveData })
    }
    catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }
}


const userLogin = async function (req, res) {
    try {
        let data = req.body;
        let data1 = req.body.email;
        let data2 = req.body.password;
        
        //mandatory validation
        if(Object.keys(data).length == 0){
            return res.status(400).send({ status: false, msg: "No Parameters Passed in requestBody" })
        }
        if (!data1) {
           return res.status(400).send({ status: false, msg: "email is required" })
        }
        if (!data2) {
           return res.status(400).send({ status: false, msg: "password is required" })
        }

        //format validaion
        if (!(/^\w+([\.-]?\w+)@\w+([\. -]?\w+)(\.\w{2,3})+$/.test(data1))) {
            return res.status(400).send({ status: false, msg: "Not a valid Email provide valid email" })
        }
        if (!(data2.length > 8 && data2.length < 15)) {
            return res.status(400).send({ status: false, msg: "Invalid Password" })
        }

        let findUser = await userModel.findOne({ email: data1, password: data2 })
        if (!findUser) {
           return res.status(404).send({ status: false, msg: "Invalid Credentials" })
        } else {
            let geneToken = jwt.sign({
                userId: findUser._id,
                iat: Math.floor(Date.now() / 1000),
                exp: Math.floor(Date.now() / 1000) + 30 * 60
            }, "group26");
           return res.status(201).send({ status: true, msg: "token Created Successfully", Token: geneToken })
        }
    }
    catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }
}

module.exports.createUser = createUser;
module.exports.userLogin = userLogin;