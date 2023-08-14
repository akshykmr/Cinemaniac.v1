
require('dotenv').config();
const jwt = require('jsonwebtoken');
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET_KEY);
    req.user = decoded;
    // console.log("user valid");
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

// const verifyToken = async (req, res, next) => {
//   try {
//     const authHeader = req.headers['authorization'];
//     const token = authHeader && authHeader.split(' ')[1];

//     if (token) {
//       const decoded = jwt.decode(token);
//       console.log("token recieved")
//       if (decoded.iss === 'https://accounts.google.com') {
//         console.log("google token")
//       } else {
//         // Handle JWT Token verification
//         const verified = jwt.verify(token, JWT_SECRET_KEY);
//         req.user = verified;
//         console.log("jwt token")
//         // return next();
//       }
//     }

//     res.status(401).json({ success: false, message: 'Invalid token' });
//   } catch (error) {
//     res.status(401).json({ success: false, message: 'Invalid token' });
//   }
// };

// const verifyToken = async (req, res, next) => {
//   try {
//     const authHeader = req.headers['authorization'];
//     const token = authHeader && authHeader.split(' ')[1];

//     if (token) {
//       console.log("step1")
//       const parts = token.split('.');
//       console.log("step12")
//       if (parts.length === 3 && isBase64(parts[0]) && isBase64(parts[1]) && isBase64(parts[2])) {
//         // Assuming that Google Access Tokens have a specific claim, like 'email'
//       console.log("step3")

//         const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf-8'));
//       console.log("token recieved")
//       console.log("step4")
        
//         if (payload.email && payload.email_verified) {
//       console.log("step5")
//           // Handle Google Access Token verification and user creation
//           // ...
//         } else {
//           // Handle JWT Token verification
//           const verified = jwt.verify(token, JWT_SECRET_KEY);
//           req.user = verified;
//       console.log("step6")
//           return next();
//         }
//       }
//     }

//     res.status(401).json({ success: false, message: 'Invalid token' });
//   } catch (error) {
//     res.status(401).json({ success: false, message: 'Invalid token' });
//   }
// };

// function isBase64(str) {
//   try {
//     return Buffer.from(str, 'base64').toString('base64') === str;
//   } catch (err) {
//     return false;
//   }
// }






// const verifyToken = async (req, res, next) => {
//   try {
//     const authHeader = req.headers['authorization'];
//     const token = authHeader && authHeader.split(' ')[1];
    
//     if (token) {
//       try {
//         // Try verifying as a JWT token
//         const decoded = jwt.verify(token, JWT_SECRET_KEY);
//         req.user = decoded;
//         return next();
//       } catch (jwtError) {

//         console.log("Google Access Token detected",token);
//         // Not a valid JWT token, handle as Google Access Token
//         try {

//             console.log("Google Access Token detected2");

//             const userData = axios.get( `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${token}`, {
//               headers: {
//                 Authorization: `Bearer ${token}`,
//                 Accept: "application/json",
//               },
//             });
            
//             // Continue with user creation logic
//             // You'll need to modify the user creation part accordingly
  
//             console.log("Google User Data:", userData);
            
//             return next();
//           // Check if user exists in your database
//           // const user = await User.findOne({ email: userData.email });
          
//           // if (!user) {
//           //   // Create a new user in your database
//           //   const newUser = new User({
//           //     firstName: userData.given_name,
//           //     lastName: userData.family_name,
//           //     email: userData.email,
//           //     password: '', // You might handle this differently for Google users
//           //     playlists: [],
//           //   });
//           //   await newUser.save();
//           // }
          
//           // req.user = userData; // or user, depending on your needs
//           // return next();
//         } catch (googleError) {
//           console.error('Token verification and Google API error:', googleError);
//         }
//       }
//     }

//     res.status(401).json({ success: false, message: 'Invalid token' });
//   } catch (error) {
//     res.status(401).json({ success: false, message: 'Invalid token' });
//   }
// };

// const fetchGoogleUserData = (accessToken) => {
//   try {
//     const response = axios.get( `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${accessToken}`, {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//         Accept: "application/json",
//       },
//     });

//     return response.data;
//   } catch (error) {
//     throw new Error('Error fetching Google user data');
//   }
// };

module.exports = { verifyToken };

// const logInUser = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const user = await User.findOne({ email });

//     if (!user) {
//       console.log("Email Not Found");
//       res.json({ success: false, message: 'Email Not Found' });
//     } else {
//       const isPasswordValid = await bcrypt.compare(password, user.password);
//       if (!isPasswordValid) {
//         console.log("Invalid Password");
//         res.json({ success: false, message: 'Invalid Password' });
//       } else {
//         // Assuming you have the `verifyToken` middleware set up
//         const token = await user.generateAuthToken();
//         res.json( { success: true, message: 'Login successful!', user, token });
//       }
//     }
//   } catch (error) {
//     res.status(500).json({ error: 'An error occurred while logging in.' });
//   }
// };

