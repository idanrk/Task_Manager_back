const jwt = require('jsonwebtoken')
const UserModel = require('../models/user')
const auth = async(req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '')
    try {
        const decoded_id = await jwt.verify(token, 'SecretKey')
        const user = await UserModel.findOne({
            "_id": decoded_id,
            "tokens.token": token
        })
        if (!user)
            throw new Error()
        req.token = token
        req.user = user
        next()
    } catch (error) {
        res.status(400).send({ "error": "Please Authenticate." })
    }


}
module.exports = auth