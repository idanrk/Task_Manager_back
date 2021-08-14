const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        validate(value) {
            if (!validator.isEmail(value)) { throw new Error("Invalid Email.") }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minLength: 6,
        validate(pass) {
            if (pass.toLowerCase() == 'password') { throw new Error("Password cannot be 'password'.") }
        }
    },
    age: {
        type: Number,
        default: 1
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]

})

userSchema.methods.toJSON = function() {
    const user = this
    const userObject = user.toObject()
    delete userObject.password
    delete userObject.tokens
    return userObject
}

userSchema.methods.generateAuthToken = async function() {
    const user = this
    const token = await jwt.sign(user["_id"].toString(), "SecretKey")
    user.tokens.push({ token })
    await user.save()
    return token
}

userSchema.statics.findByCredentials = async function(email, password) {
    const user = await UserModel.findOne({ email })
    if (!user)
        throw new Error('No Such User Exists')
    const match = await bcrypt.compare(password, user.password)
    if (!match)
        throw new Error('Wrong Password')
    else
        return user


}

userSchema.pre('save', async function(next) {
    const user = this
    if (user.isModified('password'))
        user.password = await bcrypt.hash(user.password, 8)
    next()
})

const UserModel = mongoose.model('User', userSchema)

module.exports = UserModel