const express = require('express');
const router = express.Router();
const authController = require('./../controller/authController');

router.post('/register', authController.createUser);

router.post('/login', authController.logInUser);

router.put('/updatePlaylist', authController.updatePlaylist);

module.exports = router;