const TaskModel = require('../models/task')

exports.createTask = async(req, res) => { //create task
    const task = new TaskModel({...req.body, owner: req.user._id })
    try {
        await task.save()
        res.status(201).send(task)
    } catch (error) {
        res.status(400).send("Could not create new task, error:\n" + error)
    }
}

// get tasks
// get tasks/completed=true
// get tasks/sortBy=createdAt:asc
exports.getTasks = async(req, res) => {
    try {
        const findQuery = { owner: req.user._id }
        const sortQuery = {}
        if (req.query.completed) {
            findQuery.completed = req.query.completed === "true"
        }
        // Set Default Find Options
        const findOptions = {
            limit: 10,
            skip: 0
        }
        if (req.query.limit)
            findOptions.limit = parseInt(req.query.limit)

        if (req.query.skip)
            findOptions.skip = parseInt(req.query.skip)

        if (req.query.sortBy) { // if there is sort requested
            params = req.query.sortBy.split(":")
            sortQuery[params[0]] = params[1]
            findOptions.sort = sortQuery
        }
        const tasks = await TaskModel.find(findQuery, null, findOptions)
        res.send(tasks)
    } catch (error) {
        res.status(500).send(error)
    }
}

exports.getTaskById = async(req, res) => { //get specific task
    try {
        if (req.params.id.length != 24) { return res.status(400).send("task id must be 24 characters") }
        const task = await TaskModel.findOne({ _id: req.params.id, owner: req.user._id })
        if (!task)
            return res.status(404).send("Task not found")
        res.send(task)
    } catch (error) {
        res.status(500).send(error)
    }
}
exports.updateTask = async(req, res) => { //update specific task
    if (req.params.id.length != 24)
        return res.status(400).send("id must be 24 characters")

    const updates = Object.keys(req.body)
    const allowedUpdates = ["description", "completed"]
    const valid = updates.every((update) => allowedUpdates.includes(update))
    if (!valid)
        return res.status(400).send(`Update request denied: Invalid update arguments.
    Allowed arguments: ${allowedUpdates}`)


    try {
        const task = await TaskModel.findOne({ _id: req.params.id, owner: req.user._id })
        if (!task)
            return res.status(404).send("Task not found")
        updates.forEach((update) => task[update] = req.body[update])
        await task.save()
        res.send(task)
    } catch (error) {
        res.status(400).send(error)
    }

}

exports.deleteTask = async(req, res) => { //delete specific task
    if (req.params.id.length != 24)
        return res.status(400).send("id must be 24 characters")

    try {
        const task = await TaskModel.findOneAndDelete({ _id: req.params.id, owner: req.user._id })
        if (!task)
            return res.status(400).send()
        res.send("Deleted the task:\n" + task)
    } catch (error) {
        res.status(400).send(error)
    }

}