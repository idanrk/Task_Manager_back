const UserModel = require("../models/user")
const sharp = require('sharp')
const { welcomeEmail, deletionMail } = require('../emails/emails')



exports.createUser = async(req, res) => {
    const user = new UserModel(req.body)
    try {
        const token = await user.generateAuthToken()
        welcomeEmail(user.email, user.name)
        res.status(201).send({ user, token })
    } catch (error) {
        res.status(400).send(error)
    }
}


exports.updateUser = async(req, res) => {
    if (!req.body)
        return res.status(400).send(new Error("No updates provided."))

    const updates = Object.keys(req.body)
    const allowedUpdates = ["name", "age", "password", "email"] // other than that will raise an error 400.
    const valid = updates.every((update) => allowedUpdates.includes(update))
    if (!valid)
        return res.status(400).send(`Update request denied: Invalid update arguments.
             Allowed arguments: ${allowedUpdates}`)

    try {
        const user = req.user
        updates.forEach((update) => user[update] = req.body[update])
        await user.save()
        res.send(user)
    } catch (error) {
        console.log(error)
        res.status(400).send(error)
    }
}

exports.deleteUser = async(req, res) => { //delete specific user
    try {
        const user = req.user
        deletionMail(user.email, user.name)
        await user.remove()
        res.send("Deleted the user:\n" + user)
    } catch (error) {
        res.status(400).send(error)
    }

}



exports.loginUser = async(req, res) => {
    try {
        const user = await UserModel.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch (error) {
        res.status(400).send(error.message)
    }
}


exports.userProfile = async(req, res) => {
    try {
        const user = req.user
        res.send(user)
    } catch (error) {
        res.status(500).send(error)
    }
}


exports.logoutUser = async(req, res) => {
    try {
        const user = req.user
        const _token = req.token
        user.tokens = user.tokens.filter(token => (token.token !== _token))
        await user.save()
        res.send()
    } catch (error) { res.status(500).send(error) }
}

exports.logoutAllSesions = async(req, res) => {

    try {
        const user = req.user
        user.tokens = []
        await user.save()
        res.send()
    } catch (error) { res.status(500).send(error) }
}


// Avatar Picture
// Upload profile pic
exports.uploadAvatar = async(req, res) => {
    const user = req.user
    try {
        user.avatar = await sharp(req.file.buffer).resize(250, 250).png().toBuffer() //normalizing to 250x250 png file.
        await user.save()
        res.send()
    } catch (error) {
        res.status(400).send(error.message)
    }
}

// Get profile pic
exports.getAvatar = async(req, res) => {
    const user = req.user
    try {
        if (!user.avatar)
            throw new Error("Avatar not found")
        res.set("Content-Type", 'image/png')
        res.send(user.avatar)
    } catch (error) {
        res.status(404).send(error.message)
    }
}

// Delete profile pic
exports.deleteAvatar = async(req, res) => {
    const user = req.user
    try {
        if (!user.avatar)
            throw new Error("Avatar not found\n Try upload one before deleting...")
        user.avatar = undefined
        await req.user.save()
        res.send()
    } catch (error) {
        res.status(404).send(error.message)
    }
}