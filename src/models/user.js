const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const TaskModel = require('../models/task')

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
    }],
    avatar: {
        type: Buffer,
    }

}, { timestamps: true })

userSchema.virtual('tasks', { //referencing tasks schema
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.methods.toJSON = function() { //not providing sensetive info
    const user = this
    const userObject = user.toObject()
    delete userObject.password
    delete userObject.tokens
    return userObject
}

userSchema.methods.generateAuthToken = async function() {
    const user = this
    const token = await jwt.sign({ _id: user["_id"].toString() }, "SecretKey", { expiresIn: '2days' })
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

userSchema.pre('save', async function(next) { //pre-save middleware
    const user = this
    if (user.isModified('password'))
        user.password = await bcrypt.hash(user.password, 8)
    next()
})

userSchema.pre('remove', async function(next) { //pre-remove middleware -> cascade remove tasks
    const user = this
    await TaskModel.deleteMany({ owner: user._id })
    next()
})

const UserModel = mongoose.model('User', userSchema)

module.exports = UserModel