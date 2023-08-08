// models/authentication.js
const mongoose = require('mongoose');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const authenticationSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  playlists: [
    {
      name: { type: String, required: true },
    },
  ],
});

authenticationSchema.methods['generateAuthToken'] = async function(){
  try {
    const token = jwt.sign({_id:this._id},JWT_SECRET_KEY);
    return token;
  }
  catch(error){
    res.send("error", error);
    console.log("error in token", error)
  }
}


const User = mongoose.model('User', authenticationSchema);
module.exports = User;
