const User = require('../models/UserModel')
const bcrypt = require('bcrypt');
const generateToken = require('../utils/generateToken');
const decodeToken = require('../utils/decodeToken');

const getAllUsers = async (req,res) => {
    const allUsersData = await User.find()
    res.json(allUsersData)
}
const getUserData = async(req, res) => {
    let {token} = req.body;
    if(token) {
        const tokenData = await decodeToken(token)
        if (token=="NOTOKEN") {
            res.json({message: 'NOTOKEN'})
        } else {
            const userData = await User.findOne({_id: tokenData._id}).lean()
            res.json(userData) 
        }
    }
}
const registerUser = async (req, res) => {
    let { username, email, birthday, password } = req.body
    const salt = await bcrypt.genSalt(10)

    const hashedPassword = await bcrypt.hash(password, salt)
    password = hashedPassword;    
    let user
    try { user = await User.create({
            username,
            email,
            birthday,
            password,
        })
    } catch (err) { res.end() }
    if (user) {
        const token = await generateToken(user);
        res.status(200).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            birthday: user.birthday,
            pic: user.pic,
            token: token,
        })
    } else { res.end() }
}
const authUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        let user
        if (!username || !password) {
            throw { message: 'Invalid username or password' }
        }
        if (username) {
            user = await User.findOne({ username });
        }
        if (!user) {
            throw { message: 'Invalid username or password' }
        }
        const valid = await bcrypt.compare(password, user.password)
        if (valid) {
            const token = await generateToken(user)
            res.cookie('accessToken', token, { httpOnly: true })
            res.json({
                _id: user._id,
                username: user.username,
                email: user.email,
                birthday: user.birthday,
                pic: user.pic,
                token: token,
            })
        } else { throw { message: 'Invalid username or password' } }
    } catch (error) { res.json(error) }

}

module.exports = { registerUser, authUser , getUserData, getAllUsers}