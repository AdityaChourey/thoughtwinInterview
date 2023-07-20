const { uploadQuestions } = require('./questions.controller')
const router = require('express').Router()
const { checkToken } = require('../../auth/token_validation')

router.post('/uploadQuestion', checkToken, uploadQuestions)

module.exports = router
