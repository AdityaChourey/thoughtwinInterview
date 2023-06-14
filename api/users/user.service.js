const pool = require('../../database/database')

module.exports = {
  create: (data, callback) => {
    pool.query(
      `insert into users(id,firstname,lastname,email,number,password)
            values(?,?,?,?,?,?)`,
      [
        data.id,
        data.firstname,
        data.lastname,
        data.email,
        data.number,
        data.password,
      ],
      (error, results, fields) => {
        if (error) {
          return callback(error)
        } else {
          return callback(null, results)
        }
      }
    )
  },
}
