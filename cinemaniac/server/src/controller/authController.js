require("dotenv").config();
const User = require("./../models/authenticationSchema");
const bcrypt = require('bcrypt');



////////////// CREATE USER API

const createUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          return res.status(400).json({ error: 'Email already exists. Please use a different email.' });
        }
        console.log("working 1")
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            firstName:req.body.firstName,
            lastName :req.body.lastName ,
            email    :req.body.email,
            password :hashedPassword ,
        })
        console.log("working 2",user)
        const token = await user.generateAuthToken();
        console.log("working 3",token)
        const response = await user.save();
        res.json({ message: 'User registered successfully!', response });
      } catch (error) {
        res.status(500).json({ error: 'An error occurred while registering the user.' });
      }
    };

////////////////////////////////// LOG IN 

const logInUser = async (req, res) => {
    try {
        const { email, password } = req.body;
    
        const user = await User.findOne({ email });
    
        if (!user) {
            console.log("Email Not Found");
            return res.status(404).json({ message: 'Email Not Found' });
          }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            console.log("Invalid Password");
            return res.status(401).json({ message: 'Invalid Password' });
          }
        // const token = await user.generateAuthToken();

        res.json({ status:200, message: 'Login successful!', user });
      } catch (error) {
        res.status(500).json({ error: 'An error occurred while logging in.' });
      }
    };



  const updatePlaylist = async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(404).json({ error: 'User not found.' });
      }
  
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid password.' });
      }
  
      res.json({ message: 'Login successful!', user });
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while logging in.' });
    }
  };

module.exports = {
  createUser,
  logInUser,
  updatePlaylist,
};
