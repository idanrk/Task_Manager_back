const request = require('supertest')
const app = require('../src/app')
const UserModel = require('../src/models/user')
const { setupDataBase, testUser, testUserId } = require('./fixtures/db')


beforeEach(setupDataBase)

test('Should signup a new user', async() => {
    const response = await request(app)
        .post('/users')
        .send({
            name: 'test test',
            email: 'test@example.com',
            password: 'testpass!'
        })
        .expect(201)

    // Assert that the database was changed correctly
    const user = await UserModel.findById(response.body.user._id)
    expect(user).not.toBeNull()

    // Assertions about the response
    expect(response.body)
        .toMatchObject({
            user: {
                name: 'test test',
                email: 'test@example.com'
            },
            token: user.tokens[0].token
        })
    expect(user.password)
        .not.toBe('testpass!')
})

test('Should login existing user', async() => {
    const response = await request(app)
        .post('/users/login').send({
            email: testUser.email,
            password: testUser.password
        })
        .expect(200)
    const user = await UserModel.findById(testUserId)
    expect(response.body.token)
        .toBe(user.tokens[1].token)
})

test('Should not login nonexistent user', async() => {
    await request(app)
        .post('/users/login')
        .send({
            email: testUser.email,
            password: 'wrongpass'
        })
        .expect(400)
})

test('Should get profile for user', async() => {
    await request(app)
        .get('/users/profile')
        .set('Authorization', `Bearer ${testUser.tokens[0].token}`)
        .send()
        .expect(200)
})

test('Should not get profile for unauthenticated user', async() => {
    await request(app)
        .get('/users/profile')
        .send()
        .expect(401)
})

test('Should delete account for user', async() => {
    await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${testUser.tokens[0].token}`)
        .send()
        .expect(200)
    const user = await UserModel.findById(testUserId)
    expect(user).toBeNull()
})

test('Should not delete account for unauthenticate user', async() => {
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401)
})

test('Should upload avatar image', async() => {
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization', `Bearer ${testUser.tokens[0].token}`)
        .attach('avatar', 'tests/fixtures/profile-pic.jpg')
        .expect(200)
    const user = await UserModel.findById(testUserId)
    expect(user.avatar).toEqual(expect.any(Buffer))
})

test('Should update valid user fields', async() => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${testUser.tokens[0].token}`)
        .send({
            name: 'new name'
        })
        .expect(200)
    const user = await UserModel.findById(testUserId)
    expect(user.name).toEqual('new name')
})

test('Should not update invalid user fields', async() => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${testUser.tokens[0].token}`)
        .send({
            location: 'Mexico'
        })
        .expect(400)
})