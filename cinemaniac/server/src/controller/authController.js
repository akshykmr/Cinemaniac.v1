require("dotenv").config();
const User = require("./../models/authenticationSchema");
const bcrypt = require("bcrypt");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const { Vonage } = require("@vonage/server-sdk");
const vonage = new Vonage({
  apiKey: process.env.VONAGE_API_KEY,
  apiSecret: process.env.VONAGE_SECRET_KEY,
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_COUND_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

////////////// CREATE USER API

const createUser = async (req, res) => {
  try {

    const {email, mobileNo} = req.body;
    console.log("userdata", req.body);

    const existingUserWithEmail = await User.findOne({ email });
    const existingUserWithMobile = await User.findOne({ mobileNo });

    if (existingUserWithEmail) {
      console.log("User with this email already exists");
      return res.json({
        success: false,
        message: "Email already exists, please choose another email",
        action : "email"
      });
    } else if (existingUserWithMobile) {
      console.log("User with this mobile number already exists");
      return res.json({
        success: false,
        message:
          "Mobile number already exists, please choose another mobile number",
      });
    } 
    console.log("0")
    const {password} = req.body;

      const hashedPassword = await bcrypt.hash(password, 10);
      console.log("1")
      const profileImg = req.file;
      console.log("2")

      const imagePath = profileImg.path;
      console.log("3")

      const imgResult = await cloudinary.uploader.upload(imagePath);
      console.log("4")

      const user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: hashedPassword,
        mobileNo: req.body.mobileNo,
        profilePic: {
          imgUrl: imgResult.url,
          imgPublic_Id: imgResult.public_id,
        },
        loggedInWithGoogle: false,
      });
      console.log("5")


      const token = await user.generateAuthToken();
      console.log("6")

      const response = await user.save();
      console.log("7")

      res.json({
        success: true,
        message: "User successfully registered",
        response,
        token,
      });
      console.log("User successfully registered");
      const path = imagePath;
      fs.unlink(path, (err) => {
        if (err) {
          console.error("Error deleting temporary file:", err);
        } else {
          console.log("Temporary file deleted successfully:");
        }
      });
    
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while registering the user." });
  }
};

const logInWithGoogle = async (req, res) => {
  try {
    const email = req.body.email;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const token = await existingUser.generateAuthToken();
      console.log("Google Log In Successfull");
      return res.json({ success: true, message: "Login successful!", token });
    }
    const user = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      profilePic: {
        imgUrl: req.body.profilePic,
        imgPublic_Id: null,
      },
      loggedInWithGoogle: true,
    });
    const token = await user.generateAuthToken();
    const response = await user.save();
    console.log("User successfully registered With Google LogIn");
    return res.json({
      success: true,
      message: "User successfully registered",
      response,
      token,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "An error occurred while registering the user." });
  }
};

////////////////////////////////// LOG IN

const logInUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      console.log("Email Not Found");
      res.json({ success: false, message: "Email Not Found" });
    } else {
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        console.log("Invalid Password");
        res.json({ success: false, message: "Invalid Password" });
      } else {
        const token = await user.generateAuthToken();
        res.json({ success: true, message: "Login successful!", user, token });
        console.log("Login successful!");
      }
    }
  } catch (error) {
    res.status(500).json({ error: "An error occurred while logging in." });
  }
};

//////////////////////////UPDATA THE PLYALIST
const dataTransmitter = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
    } else {
      res.json({
        success: true,
        data: {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          playlist: user.playlists,
          profilePic: user.profilePic,
          mobileNo: user.mobileNo,
          loggedInWithGoogle: user.loggedInWithGoogle,
        },
      });
    }
    console.log("Data Transfered");
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while retrieving the data",
    });
  }
};




const updateData = async (req, res) => {
  try {
    console.log("1");
    const user = await User.findById(req.user._id);
    console.log("2");

    if (!user) {
      console.log("User not found");
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    console.log("3");
    const { firstName, lastName, mobileNo, movieName } = req.body;
    const profileImg = req.file;
    console.log("4", req.body);

    if (movieName) {
      // Check if the movie already exists in the playlist
      const existingMovie = user.playlists.find((movie) => movie.name === movieName);
      if (existingMovie) {
        return res.json({
          success: true,
          message: "Movie already exists in the playlist",
        });
      } else {
        user.playlists.push({ name: movieName });
        await user.save();
        return res.json({ success: true, message: "Playlist updated successfully" });
      }
    } else {
      if (profileImg) {
        // Delete old profile image from Cloudinary
        console.log("5");
  
        if (user.profilePic.imgPublic_Id !== null) {
          console.log("6");
          const oldImgUrl = user.profilePic.imgPublic_Id;
          await cloudinary.uploader.destroy(oldImgUrl);
          console.log("7");
        }
  
        // Upload new profile image to Cloudinary
        const imagePath = profileImg.path;
        console.log("8");
  
        const imgResult = await cloudinary.uploader.upload(imagePath);
        console.log("9");
  
        user.profilePic = {
          imgUrl: imgResult.url,
          imgPublic_Id: imgResult.public_id,
        };
        console.log("10");
  
        // Delete temporary file
        fs.unlinkSync(imagePath);
        console.log("11");
      }
  
      // Update user data
      user.firstName = firstName;
      user.lastName = lastName;
  
      if (mobileNo === "null" || mobileNo === '') {
        user.mobileNo = null;
      } else if (mobileNo !== "undefined") {
        const existingUserWithMobile = await User.findOne({ mobileNo: mobileNo });
        if (existingUserWithMobile) {
          if(existingUserWithMobile.email !== user.email){
            console.log("User with this mobile number already exists",existingUserWithMobile );
            return res.json({
              success: false,
              message:
                "Mobile number is already registered, please choose another mobile number",
                action : "mobileNo"
            });
          }
        } else {
          user.mobileNo = mobileNo;
        }
      }
      console.log("12");
  
      if (movieName) {
        // Check if the movie already exists in the playlist
        const existingMovie = user.playlists.find((movie) => movie.name === movieName);
        if (existingMovie) {
          return res.json({
            success: true,
            message: "Movie already exists in the playlist",
          });
        } else {
          user.playlists.push({ name: movieName });
          await user.save();
          return res.json({ success: true, message: "Playlist updated successfully" });
        }
      }
  
      await user.save();
      console.log("13");
  
      res.json({ success: true, message: "Profile Updated" });
      console.log("Profile Updated");
      console.log("14");
    }
  } catch (error) {
    console.error("Error:", error); // Add better error logging here
    res.status(500).json({
      success: false,
      message: "An error occurred while updating the profile",
    });
  }
};

const otpGenerator = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    const oldPassword = req.body.oldpassword;
    const email = req.body.email;
    console.log("user", req.body)

    if (!user) {
      console.log("User Not Found");
      res.json({ success: false, message: "User Not Found" });
    } else {
      if (!user.loggedInWithGoogle) {

        if (oldPassword) {
          const isPasswordValid = await bcrypt.compare(
            oldPassword,
            user.password
          );

          if (!isPasswordValid) {
            console.log("Invalid Password");
            res.json({ success: false, message: "Invalid Password" });
          }
        } else {
          const existingUser = await User.findOne({ email });
          if (!existingUser) {
            console.log("Invalid Email");
            res.json({ success: false, message: "Invalid Email" });
          }
        }
        const mobileNumberWithoutCountryCode = user.mobileNo;

        const mobileNumber = "+91" + mobileNumberWithoutCountryCode;
        console.log("mobileNumber",mobileNumber);

        vonage.verify
          .start({
            number: mobileNumber,
            brand: "Vonage",
          })
          .then((resp) => {
            res.status(200).json({
              status: "success",
              message: "Verification request sent successfully",
              requestId: resp.request_id,
            });
          })
          .catch((err) => console.error(err));
      } else {
        console.log("Cant Reset The Password");
        res.json({
          success: false,
          message: "User has logged in with Google",
          user,
          mobileNumber,
        });
      }
    }
  } catch (error) {
    console.log("error", error);
  }
};

const otpVerifier = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    const { newPassword, requestId, otp } = req.body;
    console.log(req.body, "req body");

    const response = await vonage.verify.check(requestId, otp);

    console.log(response);

    if (response && response.status === "0") {
      const isSamePassword = await bcrypt.compare(newPassword, user.password);

      if (isSamePassword) {
        return res.status(400).json({ message: "New password cannot be the same as the old password" });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      user.password = hashedPassword;
      await user.save();

      res.json({ status: "success", message: "Password Updated" });
      console.log("Password Updated", hashedPassword);
    } else {
      res.status(500).json({ message: "Invalid OTP" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const otpGeneratorForForgotPass = async (req, res) => {
  try {
    const mobileNo = req.body.mobileNo;
    const email = req.body.email;
    if (mobileNo) {
      const existingUser = await User.findOne({ mobileNo });
      if (!existingUser) {
        console.log("Mobile No is not found");
        res.json({ success: false, message: "Mobile Number not found" });
      } else {
        const mobileNumberWithoutCountryCode = existingUser.mobileNo;
        const mobileNumber = "+91" + mobileNumberWithoutCountryCode;
        console.log("mobileNumber", mobileNumber);
        const token = await existingUser.generateAuthToken();
        vonage.verify
          .start({
            number: mobileNumber,
            brand: "Vonage",
          })
          .then((resp) => {
            res.status(200).json({
              status: "success",
              message: "Verification request sent successfully",
              requestId: resp.request_id,
              token,
            });
          })
          .catch((err) => console.error(err));
      }
    } else if (email) {
      const existingUser = await User.findOne({ email });

      if (!existingUser) {
        console.log("Invalid Email");
        res.json({ success: false, message: "Email not found" });
      } else {
        const mobileNumberWithoutCountryCode = existingUser.mobileNo;
        const mobileNumber = "+91" + mobileNumberWithoutCountryCode;
        console.log("mobileNumber", mobileNumber);
        const token = await existingUser.generateAuthToken();
        vonage.verify
          .start({
            number: mobileNumber,
            brand: "Vonage",
          })
          .then((resp) => {
            res.status(200).json({
              status: "success",
              message: "Verification request sent successfully",
              requestId: resp.request_id,
              token,
            });
          })
          .catch((err) => console.error(err));
      }
    }
  } catch (error) {
    console.log("error", error);
  }
};


const removePlaylist = async (req, res) => {
  try {
    const userId = req.user._id;
    const playlistId = req.params.id; 
    const result = await User.findByIdAndUpdate(
      userId,
      { $pull: { playlists: { _id: playlistId } } },
      { new: true } 
    );

    if (!result) {
      console.log("User not found or playlist item not found");
      return res.status(404).json({ success: false, message: "User or playlist item not found" });
    }

    res.json({ success: true, message: "Playlist item deleted successfully" });
  } catch (error) {
    console.error("Error deleting playlist item:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};


module.exports = {
  createUser,
  logInUser,
  dataTransmitter,
  updateData,
  logInWithGoogle,
  otpGenerator,
  otpVerifier,
  otpGeneratorForForgotPass,
  removePlaylist,
};
