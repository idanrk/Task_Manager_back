const express = require('express')
const TaskModel = require('../models/task')

const router = express.Router()

router.post('/tasks', async(req, res) => { //create task
    const task = new TaskModel(req.body)
    try {
        await task.save()
        res.status("201").send(task)
    } catch (error) {
        res.status(400).send("Could not create new task, error:\n" + error)
    }
})
router.get('/tasks', async(req, res) => { //get tasks
    try {
        const tasks = await TaskModel.find({})
        res.send(tasks)
    } catch (error) {
        res.status(500).send(error)
    }
})

router.get('/tasks/:id', async(req, res) => { //get specific task
    if (req.params.id.length != 24) { return res.status(400).send("task id must be 24 characters") }
    try {
        const task = await TaskModel.findById(req.params.id)
        if (!task)
            return res.status(404).send("Task not found")
        res.send(task)
    } catch (error) {
        res.status(500).send(error)
    }
})
router.patch('/tasks/:id', async(req, res) => { //update specific task
    if (req.params.id.length != 24)
        return res.status(400).send("id must be 24 characters")

    const updates = Object.keys(req.body)
    const allowedUpdates = ["description", "completed"]
    const valid = updates.every((update) => allowedUpdates.includes(update))
    if (!valid)
        return res.status(400).send(`Update request denied: Invalid update arguments.
    Allowed arguments: ${allowedUpdates}`)


    try {
        //const task = await TaskModel.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        const task = await TaskModel.findById(req.params.id)
        if (!task)
            return res.status(404).send("Task not found")
        updates.forEach((update) => task[update] = req.body[update])
        await task.save()
        res.send(task)
    } catch (error) {
        res.status(400).send(error)
    }

})

router.delete('/tasks/:id', async(req, res) => { //delete specific task
    if (req.params.id.length != 24)
        return res.status(400).send("id must be 24 characters")

    try {
        const task = await TaskModel.findByIdAndDelete(req.params.id)
        if (!task)
            return res.status(404).send("Task not found")
        res.send("Deleted the task:\n" + task)
    } catch (error) {
        res.status(400).send(error)
    }

})

module.exports = router