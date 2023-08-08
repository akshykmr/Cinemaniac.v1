const express = require('express');
const router = express.Router();
const authController = require('./../controller/authController');
const jwt = require('jsonwebtoken');
const { verifyToken } = require('./../controller/verifyauth');

router.post('/register', authController.createUser);

router.post('/login', authController.logInUser);

router.get('/protected', verifyToken, authController.dataTransmitter);

router.put('/update', verifyToken, authController.updatePlaylist);

module.exports = router;