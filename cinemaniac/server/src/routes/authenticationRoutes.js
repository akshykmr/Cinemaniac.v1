const express = require('express');
const router = express.Router();
const authController = require('./../controller/authController');

router.post('/users', authController.createUser);
router.get('/users', authController.getUser);

module.exports = router;