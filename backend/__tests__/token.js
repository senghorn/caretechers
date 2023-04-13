require('dotenv').config()
const jwt = require('jsonwebtoken')

/**
 * Given a user object, sign it with JWT and access token secret
 * @param {*} user's email to sign
 * @returns 
 */
export default function getToken(email) {
    const user = { id: email };
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' })
}
