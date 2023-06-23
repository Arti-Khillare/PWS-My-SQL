const express = require('express');
const router = express.Router();
const {registerUser, loginUserWithEmailAndPassword} = require('../controllers/authController');


router.route('/')
.post(registerUser);

router.route('/login')
.post(loginUserWithEmailAndPassword);

module.exports = router;