const express = require('express');
const {registerUser, authUser, getUserData, getAllUsers} = require('../controllers/userControllers');

const router = express.Router()

router.route('/register').post(registerUser)
router.route('/login').post(authUser)
router.route('/decodeToken').post(getUserData)
router.route('/get-all-users').get(getAllUsers)

module.exports = router