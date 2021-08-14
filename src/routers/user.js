const express = require("express")
const UserModel = require("../models/user")
const auth_middleware = require('../middleware/auth')
const auth = require("../middleware/auth")
const router = new express.Router()

router.post('/users/login', async(req, res) => {
    try {
        const user = await UserModel.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch (error) {
        res.status(400).send()
    }

})

router.post('/users', async(req, res) => { //create user
    const user = new UserModel(req.body)
    try {
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    } catch (error) {
        res.status(400).send(error)
    }
})
router.post('/users/logout', auth_middleware, async(req, res) => {

    try {
        const user = req.user
        const _token = req.token
        user.tokens = user.tokens.filter((token) => {
            return (token.token !== _token)
        })
        await user.save()
        res.send()
    } catch (error) { res.status(500).send(error) }
})
router.post('/users/logoutAll', auth_middleware, async(req, res) => {

    try {
        const user = req.user
        user.tokens = []
        await user.save()
        res.send()
    } catch (error) { res.status(500).send(error) }
})

router.get('/users/profile', auth_middleware, async(req, res) => { //get users
    try {
        const user = req.user
        res.send(user)
    } catch (error) {
        res.status(500).send(error)
    }
})


router.patch('/users/me', auth_middleware, async(req, res) => { //update specific user
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
})

router.delete('/users/me', auth_middleware, async(req, res) => { //delete specific user
    try {
        await req.user.remove()
        res.send("Deleted the user:\n" + req.user)
    } catch (error) {
        res.status(400).send(error)
    }

})

module.exports = router