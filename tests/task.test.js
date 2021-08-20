const request = require('supertest')
const app = require('../src/app')
const TaskModel = require('../src/models/task')
const { setupDataBase, testUser, testUserTwo, taskThree } = require('./fixtures/db')


beforeEach(setupDataBase)

test("Should create task", async() => {
    const response = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${testUser.tokens[0].token}`)
        .send({
            description: "babaaba",
            completed: false
        })
        .expect(201)
    const task = await TaskModel.findById(response.body._id)
    expect(task).not.toBeNull()
    expect(task.completed).toEqual(false)
})

test("Should get all user's tasks", async() => {
    const response = await request(app)
        .get('/tasks')
        .set('Authorization', `Bearer ${testUser.tokens[0].token}`)
        .send()
        .expect(200)
    expect(response.body.length).toBe(2)
})

test("Should delete second user's first task", async() => {
    const response = await request(app)
        .delete(`/tasks/${taskThree._id}`)
        .set('Authorization', `Bearer ${testUserTwo.tokens[0].token}`)
        .send()
        .expect(200)
    const task = await TaskModel.findById(taskThree._id)
    expect(task).toBeNull()
})


test("Should not delete other user's task", async() => {
    const response = await request(app)
        .delete(`/tasks/${taskThree._id}`)
        .set('Authorization', `Bearer ${testUser.tokens[0].token}`)
        .send()
        .expect(400)
    const task = await TaskModel.findById(taskThree._id)
    expect(task).not.toBeNull()
})