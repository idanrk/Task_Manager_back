const jwt = require('jsonwebtoken')
const UserModel = require('../models/user')
const auth = async(req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded_id = await jwt.verify(token, process.env.JWT_SECRET)
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
        res.status(401).send({ "error": "Please Authenticate." })
    }
}
module.exports = auth