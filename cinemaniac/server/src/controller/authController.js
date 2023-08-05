require("dotenv").config();
const User = require('./../models/authenticationSchema')

////////////// CREATE USER API 

const createUser = async(req, res) =>{
  try{
    if(req){
        console.log("there is a req", req.body);
    }
    res.json(req.body);
  }
  catch(e)
  {
    console.log("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }  
}

const getUser = async(req, res) =>{

    
    try{
      if(req){
          console.log("there is a req");
      }
      res.json("hello");
    }
    catch(e)
    {
      console.log("Error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }  
  }

module.exports = {
    createUser,
    getUser,
}
