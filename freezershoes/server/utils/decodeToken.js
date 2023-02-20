const jwt = require('jsonwebtoken')

const decodeToken = async (token) => {
    if (token) {
        let tokenData = await jwt.decode(token,"SOMERANDOMSECRET")
        return tokenData;
    } else {
        return "NOTOKEN"
    }
}
module.exports = decodeToken