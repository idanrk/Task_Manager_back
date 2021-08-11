const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

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
    }

})
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