const express = require('express')
const auth_middleware = require('../middleware/auth')
const { createTask, updateTask, deleteTask, getTasks, getTaskById } = require('../controllers/taskController')
const router = express.Router()

router.post('/tasks', auth_middleware, createTask)
router.patch('/tasks/:id', auth_middleware, updateTask)
router.delete('/tasks/:id', auth_middleware, deleteTask)

router.get('/tasks', auth_middleware, getTasks)
router.get('/tasks/:id', auth_middleware, getTaskById)

module.exports = router