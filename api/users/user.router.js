const { createUsers } = require('./user.controller')
const router = require('express').Router()

router.post('/', createUsers)
module.exports = router
