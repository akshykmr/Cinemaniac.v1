require("dotenv").config();
const User = require("./../models/authenticationSchema");
const bcrypt = require('bcrypt');



////////////// CREATE USER API

const createUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
           res.json({success: false, message: 'Email already exists, please choose another email'});
        }
        else {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            firstName:req.body.firstName,
            lastName :req.body.lastName ,
            email    :req.body.email,
            password :hashedPassword ,
        })
        const token = await user.generateAuthToken();
        const response = await user.save();
        res.json({success: true, message: 'User successfully registered',response,token});
    }
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
            res.json({ success: false, message: 'Email Not Found' });
          } else {
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                console.log("Invalid Password");
                res.json({ success: false, message: 'Invalid Password' });
              } 
              else {
              const token = await user.generateAuthToken();
                res.json( { success: true, message: 'Login successful!', user, token });
              }
          }
        } catch (error) {
          res.status(500).json({ error: 'An error occurred while logging in.' });
        }
      };


//////////////////////////UPDATA THE PLYALIST
  const dataTransmitter = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
          res.status(404).json({ success: false, message: 'User not found' });
        } else {
          res.json({
            success: true,
            data: {
              firstName: user.firstName,
              lastName: user.lastName,
              playlist: user.playlists,
            },
          });
        }
      } catch (error) {
        res.status(500).json({ success: false, message: 'An error occurred while retrieving the data' });
      }
    };

    const updatePlaylist = async (req, res) => {
      try {
        const user = await User.findById(req.user._id); 
        const movieName = req.body.movieName;
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
    } else {
      const existingMovie = user.playlists.find(movie => movie.name === movieName);
      if (existingMovie) {
        res.json({ success: true, message: 'Movie already exists in the playlist' });
      } else {
        user.playlists.push({ name: movieName });
        await user.save();
        res.json({ success: true, message: 'Playlist updated' });
      }
    }
        } catch (error) {
          res.status(500).json({ success: false, message: 'An error occurred while retrieving the data' });
        }
      };

module.exports = {
  createUser,
  logInUser,
  dataTransmitter,
  updatePlaylist,
};

