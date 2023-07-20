const { uploadQues } = require('./questions.service')

module.exports = {
  // getUserByIds: (req, res) => {
  //   const id = req.params.id
  //   getUserById(id, (err, results) => {
  //     if (err) {
  //       return res.status(500).json({
  //         success: 0,
  //         message: 'Database connection error!',
  //       })
  //     }
  //     if (!results) {
  //       return res.status(400).json({
  //         success: 0,
  //         message: 'Record not found!',
  //       })
  //     }
  //     return res.status(200).json({
  //       success: 1,
  //       data: results,
  //     })
  //   })
  // },
  // updateUsers: (req, res) => {
  //   const currentTime = moment().format()
  //   const body = { ...req.body, updated_at: currentTime }
  //   if (
  //     !body.id ||
  //     !body.firstname ||
  //     !body.lastname ||
  //     !body.email ||
  //     !body.number
  //   ) {
  //     return res.status(400).json({
  //       success: 0,
  //       message: 'Please fill all fields!',
  //     })
  //   } else {
  //     updateUser(body, (err, results) => {
  //       if (err) {
  //         return res.status(500).json({
  //           success: 0,
  //           message: 'Database connection error!',
  //         })
  //       }
  //       return res.status(200).json({
  //         success: 1,
  //         data: results,
  //         message: 'User updated successfully!',
  //       })
  //     })
  //   }
  // },
  uploadQuestions: (req, res) => {
    const body = req.body
    if (
      !body.id ||
      !body.question ||
      !body.right_option ||
      !body.wrong_option_1 ||
      !body.wrong_option_2 ||
      !body.wrong_option_3 ||
      !body.experience
    ) {
      return res.status(400).json({
        success: 0,
        message: 'Please fill all fields!',
      })
    } else {
      uploadQues(body, (err, results) => {
        if (err) {
          return res.status(500).json({
            success: 0,
            message: 'Database connection error!',
          })
        }
        return res.status(200).json({
          success: 1,
          data: results,
          message: 'Question added successfully!',
        })
      })
    }
  },
}
