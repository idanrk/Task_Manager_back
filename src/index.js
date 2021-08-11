const express = require("express")
const app = express()
const port = process.env.PORT || 3000
require("./db/mongoose")
    // Routers exports
const UserRouter = require('./routers/user')
const TaskRouter = require('./routers/task')

app.use(express.json())
app.use(UserRouter)
app.use(TaskRouter)


app.listen(port, () => { console.log('Listening on: ' + port) })