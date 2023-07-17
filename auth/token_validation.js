const { verify } = require('jsonwebtoken')
const pool = require('../database/database')

module.exports = {
  checkToken: (req, res, next) => {
    let token = req.get('authorization')
    pool.query(
      `SELECT * FROM users WHERE user_token = ?`,
      [token.slice(7)],
      (error, results, fields) => {
        if (results?.length > 0) {
          if (results[0].user_token) {
            verify(
              results[0].user_token,
              process.env.PASS_KEY,
              (err, decode) => {
                if (err) {
                  return res.status(400).json({
                    success: 0,
                    message: 'Invalid token',
                  })
                } else {
                  next()
                }
              }
            )
          }
        } else {
          res.status(400).json({
            success: 0,
            message: 'Access denied! Unauthorized user',
          })
        }
      }
    )
  },
}
