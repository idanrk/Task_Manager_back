const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const UserModel = require('../../src/models/user')
const TaskModel = require('../../src/models/task')


const testUserId = new mongoose.Types.ObjectId()
const testUser = {
    _id: testUserId,
    name: 'test',
    email: 'test@test.com',
    password: 'test123!',
    tokens: [{
        token: jwt.sign({ _id: testUserId }, process.env.JWT_SECRET)
    }]
}
const testUserTwoId = new mongoose.Types.ObjectId()
const testUserTwo = {
    _id: testUserTwoId,
    name: 'test',
    email: 'testing@testing.com',
    password: 'test123!',
    tokens: [{
        token: jwt.sign({ _id: testUserTwoId }, process.env.JWT_SECRET)
    }]
}

const taskOne = {
    _id: new mongoose.Types.ObjectId(),
    description: "first Task",
    completed: false,
    owner: testUser._id
}

const taskSecond = {
    _id: new mongoose.Types.ObjectId(),
    description: "second Task",
    completed: true,
    owner: testUser._id
}

const taskThree = {
    _id: new mongoose.Types.ObjectId(),
    description: "third Task",
    completed: false,
    owner: testUserTwo._id
}


const setupDataBase = async() => {
    await UserModel.deleteMany({})
    await TaskModel.deleteMany({})
    await new UserModel(testUser).save()
    await new UserModel(testUserTwo).save()
    await new TaskModel(taskOne).save()
    await new TaskModel(taskSecond).save()
    await new TaskModel(taskThree).save()
}

module.exports = { testUser, testUserId, testUserTwo, taskThree, setupDataBase }