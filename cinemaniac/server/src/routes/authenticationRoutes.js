const express = require('express');
const router = express.Router();
const multer = require('multer');
const authController = require('./../controller/authController');
const { verifyToken } = require('./../controller/verifyauth');

const storage = multer.diskStorage({
    destination: 'assets',
    filename: function (req, file, cb) {
      cb(null, Date.now()+'  '+ file.originalname)
    }
  });
  const upload = multer({storage:storage}); 
  upload.none();


router.post('/register', upload.single('profilePic'), authController.createUser);

router.post('/login', authController.logInUser);


router.post('/generateOtp', verifyToken, authController.otpGenerator);

router.post('/verifyOtp', verifyToken, authController.otpVerifier);

router.post('/googlelogin', authController.logInWithGoogle);

router.get('/protected', verifyToken, authController.dataTransmitter);

router.put('/update', verifyToken, upload.single('profilePic'), authController.updateData);

router.post('/forgotPass', authController.otpGeneratorForForgotPass);

router.delete('/remove/:id', verifyToken, authController.removePlaylist);



module.exports = router;