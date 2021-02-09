// User model here
const mongoose = require("mongoose");

let UserNameSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true
    },
    password:{
      type: String,
     require: true
    }
  
  })
  
  // 2. Define your model
  
  let UserNameModel =mongoose.model ('user',UserNameSchema)
  
  // 3. Export your Model with 'module.exports'
  module.exports =UserNameModel
  