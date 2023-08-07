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
  tokens: [{
    token:{
      type: String, required: true,
    }
  }],
  playlists: [
    {
      name: { type: String, required: true },
      isPublic: { type: Boolean, default: true },
      movies: [{ type: String }],
    },
  ],
});

authenticationSchema.methods['generateAuthToken'] = async function(){
  try {
    const token = jwt.sign({_id:this._id.toString()},JWT_SECRET_KEY);
    this.tokens = this.tokens.concat({token});
    await this.save();
    return token;
  }
  catch(error){
    res.send("error", error);
    console.log("error in token", error)
  }
}


const User = mongoose.model('User', authenticationSchema);
module.exports = User;
