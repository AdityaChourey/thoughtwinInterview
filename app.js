require('dotenv').config()
const express = require('express')
const app = express()
const userRouter = require('./api/users/user.router')
const questionRouter = require('./api/Questions/questions.router')

app.use(express.json())
app.use('/api/users', userRouter)
app.use('/api/users', userRouter)

app.listen(process.env.APP_PORT, () => {
  console.log('server started')
})
