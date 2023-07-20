const pool = require('../../database/database')

module.exports = {
  uploadQues: (data, callback) => {
    pool.query(
      `insert into questions(id,question,right_option,wrong_option_1,wrong_option_2,wrong_option_3,experience,difficulty)
      values(?,?,?,?,?,?,?,?)`,
      [
        data.id,
        data.question,
        data.right_option,
        data.wrong_option_1,
        data.wrong_option_2,
        data.wrong_option_3,
        data.experience,
        data.difficulty,
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
