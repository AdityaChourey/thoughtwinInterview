const pool = require('../../database/database')

module.exports = {
  create: (data, callback) => {
    pool.query(
      `SELECT * FROM users WHERE firstName = ? or email = ? `,
      [data.firstname, data.email],
      (error, results, fields) => {
        if (results.length > 0) {
          return callback(null, {
            success: 0,
            message: 'Name or email already exists!',
          })
        } else {
          pool.query(
            `insert into users(id,firstname,lastname,email,number,password,created_at,updated_at)
                  values(?,?,?,?,?,?,?,?)`,
            [
              data.id,
              data.firstname,
              data.lastname,
              data.email,
              data.number,
              data.password,
              data.created_at,
              data.updated_at,
            ],
            (error, results, fields) => {
              if (error) {
                return callback(error)
              } else {
                return callback(null, results)
              }
            }
          )
        }
      }
    )
  },
  getUsers: (callback) => {
    pool.query(
      `select id,firstname,lastname,email,number from users`,
      [],
      (error, results, fields) => {
        if (error) {
          return callback(error)
        }
        return callback(null, results)
      }
    )
  },
  getUserById: (id, callback) => {
    pool.query(
      `select id,firstname,lastname,email,number from users where id = ?`,
      [id],
      (error, results, fields) => {
        if (error) {
          return callback(error)
        }
        return callback(null, results[0])
      }
    )
  },
  updateUser: (data, callback) => {
    pool.query(
      `update users set firstname = ?,lastname = ?,email = ?,number = ?,updated_at = ? where id = ?`,
      [
        data.firstname,
        data.lastname,
        data.email,
        data.number,
        data.updated_at,
        data.id,
      ],
      (error, results, fields) => {
        if (error) {
          return callback(error)
        }
        return callback(null, results[0])
      }
    )
  },
  deleteUser: (data, callback) => {
    pool.query(
      `delete from users where id = ?`,
      [data.id],
      (error, results, fields) => {
        if (error) {
          return callback(error)
        }
        return callback(null, results[0])
      }
    )
  },
  getUserByFirstName: (firstname, callback) => {
    pool.query(
      `select * from users where firstname = ?`,
      [firstname],
      (error, results, fields) => {
        if (error) {
          return callback(error)
        }
        return callback(null, results[0])
      }
    )
  },
}
