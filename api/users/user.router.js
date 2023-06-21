const {
  createUsers,
  getUserByIds,
  getUser,
  updateUsers,
  deleteUsers,
  loginUser,
} = require('./user.controller')
const router = require('express').Router()
const { checkToken } = require('../../auth/token_validation')

router.post('/createUser', createUsers)
router.get('/getAllUser', checkToken, getUser)
router.get('/getUserById/:id', checkToken, getUserByIds)
router.patch('/updateUser', checkToken, updateUsers)
router.delete('/deleteUser', checkToken, deleteUsers)
router.post('/login', loginUser)

module.exports = router
