const mongoose = require('mongoose');

const authenticationSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
      },
      lastName: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
        unique: true, 
      },
      password: {
        type: String,
        required: true,
      },
    });

const User = mongoose.model('User', authenticationSchema);
 module.exports = User;