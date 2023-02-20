const jwt = require('jsonwebtoken')

const generateToken = async (user) => {
    
    const payload = {
        username: user.username,
        _id: user._id,
    };
    const token = await jwt.sign(
        payload, 
        "SOMERANDOMSECRET",
        { expiresIn: '60 days' });
    return token;
}
module.exports = generateToken


