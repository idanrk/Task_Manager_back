const express = require("express")
const UserModel = require("../models/user")

const router = new express.Router()


router.get('/users/login', async(req, res) => {
    try {
        const user = await UserModel.findByCredentials(req.body.email, req.body.password)
        res.send(user)
    } catch (error) {
        res.status(400).send()
    }

})

router.post('/users', async(req, res) => { //create user
    const user = new UserModel(req.body)
    try {
        await user.save()
        res.status(201).send(user)
    } catch (error) {
        res.status(400).send(error)
    }
})
router.get('/users', async(req, res) => { //get users
    try {
        const users = await UserModel.find({})
        res.send(users)
    } catch (error) {
        res.status(500).send(error)
    }
})
router.get('/users/:id', async(req, res) => { //get specific user
    if (req.params.id.length != 24) { return res.status(400).send("user id must be 24 characters") }
    try {
        const user = await UserModel.findById(req.params.id)
        if (!user)
            return res.status(404).send("User not found.")
        res.send(user)
    } catch (error) {
        res.status(500).send(error)
    }
})

router.patch('/users/:id', async(req, res) => { //update specific user
    if (req.params.id.length != 24)
        return res.status(400).send("id must be 24 characters")
    if (!req.body)
        return res.status(400).send(new Error("No updates provided."))


    const updates = Object.keys(req.body)
    const allowedUpdates = ["name", "age", "password", "email"] // other than that will raise an error 400.
    const valid = updates.every((update) => allowedUpdates.includes(update))
    if (!valid)
        return res.status(400).send(`Update request denied: Invalid update arguments.
             Allowed arguments: ${allowedUpdates}`)

    try {
        console.log("hit")
        const user = await UserModel.findById(req.params.id)
        if (!user)
            return res.status(404).send("User not found")
        updates.forEach((update) => user[update] = req.body[update])
        await user.save()
        res.send(user)
    } catch (error) {
        console.log(error)
        res.status(400).send(error)
    }
})

router.delete('/users/:id', async(req, res) => { //delete specific user
    if (req.params.id.length != 24)
        return res.status(400).send("id must be 24 characters")

    try {
        const user = await UserModel.findByIdAndDelete(req.params.id)
        if (!user)
            return res.status(404).send("User not found")
        res.send("Deleted the user:\n" + user)
    } catch (error) {
        res.status(400).send(error)
    }

})

module.exports = router