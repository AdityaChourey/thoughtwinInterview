const { genSaltSync, hashSync, compareSync } = require('bcrypt')
const pool = require('../../database/database')
const moment = require('moment')
const {
  create,
  getUserById,
  getUsers,
  deleteUser,
  updateUser,
  getUserByFirstName,
} = require('./user.service')

const { sign } = require('jsonwebtoken')
const { verify } = require('jsonwebtoken')

module.exports = {
  createUsers: (req, res) => {
    const jsonToken = sign({ id: req.body.id }, process.env.PASS_KEY, {
      expiresIn: '24h',
    })
    const currentTime = moment().format()
    const body = {
      ...req.body,
      created_at: currentTime,
      updated_at: null,
      user_token: jsonToken,
      role: role ? role : 'user',
    }
    const salt = genSaltSync(10)
    body.password = hashSync(body.password, salt)
    if (
      !body.id ||
      !body.firstname ||
      !body.lastname ||
      !body.email ||
      !body.number ||
      !body.password
    ) {
      return res.status(400).json({
        success: 0,
        message: 'Please fill all fields!',
      })
    }
    if (body.firstname.length > 15 || body.firstname.length < 2) {
      return res.status(400).json({
        success: 0,
        message:
          'Firstname should be more than 1 character and less than 15 characters!',
      })
    }
    if (!/^[a-zA-Z]+$/.test(body.firstname)) {
      return res.status(400).json({
        success: 0,
        message:
          'Firstname should not contain any numbers, special characters and spaces!',
      })
    }
    if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+\.[a-zA-Z]{2,6}$/.test(body.email)) {
      return res.status(400).json({
        success: 0,
        message: 'Please enter valid email!',
      })
    } else {
      create(body, (err, results) => {
        if (err) {
          return res.status(500).json({
            success: 0,
            message: 'Database connection error!',
          })
        } else {
          return res.status(200).json({
            success: 1,
            data: results,
            token: jsonToken,
          })
        }
      })
    }
  },
  getUserByIds: (req, res) => {
    const id = req.params.id
    getUserById(id, (err, results) => {
      if (err) {
        return res.status(500).json({
          success: 0,
          message: 'Database connection error!',
        })
      }
      if (!results) {
        return res.status(400).json({
          success: 0,
          message: 'Record not found!',
        })
      }
      return res.status(200).json({
        success: 1,
        data: results,
      })
    })
  },
  getUser: (req, res) => {
    getUsers((err, results) => {
      if (err) {
        return res.status(500).json({
          success: 0,
          message: 'Database connection error!',
        })
      }
      return res.status(200).json({
        success: 1,
        data: results,
      })
    })
  },
  updateUsers: (req, res) => {
    const currentTime = moment().format()
    const body = { ...req.body, updated_at: currentTime }
    if (
      !body.id ||
      !body.firstname ||
      !body.lastname ||
      !body.email ||
      !body.number
    ) {
      return res.status(400).json({
        success: 0,
        message: 'Please fill all fields!',
      })
    } else {
      updateUser(body, (err, results) => {
        if (err) {
          return res.status(500).json({
            success: 0,
            message: 'Database connection error!',
          })
        }
        return res.status(200).json({
          success: 1,
          data: results,
          message: 'User updated successfully!',
        })
      })
    }
  },
  deleteUsers: (req, res) => {
    const data = req.body
    deleteUser(data, (err, results) => {
      if (err) {
        return res.status(500).json({
          success: 0,
          message: 'Database connection error!',
        })
      }
      if (!results) {
        return res.status(400).json({
          success: 0,
          message: 'Record not found!',
        })
      }
      return res.status(200).json({
        success: 1,
        message: 'Deleted user successfully',
      })
    })
  },
  loginUser: (req, res) => {
    const body = req.body
    let token = req.get('authorization')
    if (token) {
      pool.query(
        `SELECT * FROM users WHERE user_token = ?`,
        [token?.slice(7)],
        (error, results, fields) => {
          if (!results?.length) {
            return res.status(400).json({
              success: 0,
              message: 'User not found!',
            })
          }
          if (results?.length > 0) {
            if (results[0].user_token) {
              verify(results[0].user_token, process.env.PASS_KEY, (err) => {
                if (err) {
                  return res.status(400).json({
                    success: 0,
                    message: 'Invalid token',
                  })
                } else {
                  return res.status(200).json({
                    success: 1,
                    message: 'Logged in SuccessFully',
                    userInfo: {
                      ...results[0],
                      password: undefined,
                      user_token: undefined,
                    },
                    token: results[0].user_token,
                  })
                }
              })
            }
          }
        }
      )
    } else {
      getUserByFirstName(body.firstname, (err, results) => {
        if (err) {
          return res.status(500).json({
            success: 0,
            message: 'Database connection error!',
          })
        }
        if (!results) {
          return res.status(400).json({
            success: 0,
            message: 'Invalid credentials!',
          })
        }
        const result = compareSync(body.password, results.password)
        if (result) {
          results.password = undefined
          const jsonToken = sign({ result: results }, process.env.PASS_KEY, {
            expiresIn: '24h',
          })
          pool.query(
            `update users set user_token = ? where id = ?`,
            [jsonToken, results.id],
            (error, results, fields) => {
              if (error) {
                console.log('error', error)
              } else {
                console.log('results', results)
              }
            }
          )
          return res.status(200).json({
            success: 1,
            message: 'Logged in SuccessFully',
            userInfo: {
              ...results,
              password: undefined,
              user_token: undefined,
            },
            token: jsonToken,
          })
        } else {
          return res.status(400).json({
            success: 0,
            message: 'Invalid password!',
          })
        }
      })
    }
  },
}
