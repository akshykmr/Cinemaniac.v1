require("dotenv").config();
const User = require("./../models/authenticationSchema");

////////////// CREATE USER API

const createUser = async (req, res) => {
    try {
        const user = new User({
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
          password: req.body.password,
        });
      
        user.save()
          .then((newUser) => {
            res.status(201).json(newUser);
            console.error("User Created Successfully", newUser);
          })
          .catch((err) => {
            console.error("Error saving entry:", err);
            res.status(500).json({ error: "Error saving entry" });
          });
      } catch (e) {
        console.log("Error:", e);
        res.status(500).json({ error: "Internal Server Error" });
      }
}      

/////////////////////// GET API
const getUser = async (req, res) => {
  try {
    if (req) {
      console.log("there is a req");
    }
    res.json("hello");
  } catch (e) {
    console.log("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  createUser,
  getUser,
};
