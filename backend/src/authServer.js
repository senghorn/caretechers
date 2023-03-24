require('dotenv').config()

const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')
const axios = require('axios')
const sql = require('sql-template-strings');
const db = require('./database');

function authServer() {

    app.use(express.json())

    // Later we can scale this to be stored in database
    let refreshTokens = []

    // Asks for new token
    app.post('/token', (req, res) => {
        const refreshToken = req.body.token
        if (refreshToken == null) return res.sendStatus(401)
        if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403)
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
            if (err) return res.sendStatus(403)
            const accessToken = generateAccessToken({ name: user.name })
            res.json({ accessToken: accessToken })
        })
    })

    app.post('/validate', (req, res) => {
        console.log(req.body);
        const accessToken = req.body.token
        if (accessToken == null) return res.sendStatus(401)
        jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) {
                console.log(err.message);
                return res.sendStatus(403)
            }
            return res.sendStatus(200);
        })
    })

    app.delete('/logout', (req, res) => {
        refreshTokens = refreshTokens.filter(token => token !== req.body.token)
        res.sendStatus(204)
    })

    app.post('/login', async (req, res) => {

        // Authenticate User
        const token = req.body.token;
        let email = "";
        if (token) {
            try {
                const userInfoResponse = await axios.get(
                    'https://www.googleapis.com/userinfo/v2/me',
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                const data = await userInfoResponse.data;
                email = data.email;
            } catch (err) {
                console.error(err);
                return res.sendStatus(401);
            }
        } else {
            return res.sendStatus(401);
        }

        if (email === "") {
            return res.sendStatus(401);
        }
        const user = await getUserData(email);
        const accessToken = generateAccessToken(user)
        const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)
        refreshTokens.push(refreshToken)
        res.json({ accessToken: accessToken, refreshToken: refreshToken })
    })

    app.listen(4000, () => { console.log('Auth server listening on port 4000') })
}

/**
 * Given a user object, sign it with JWT and access token secret
 * @param {*} user object to sign
 * @returns 
 */
function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '10h' })
}

/**
 * Returns user object that contain information user is associated to.
 * @param {*} email 
 */
async function getUserData(email) {
    const query = sql`SELECT * FROM Users WHERE email = ${email};`;
    const [result] = await db.query(query);
    if (!result) {
        return { id: email, curr_group: [] }
    }
    return { id: result.email, curr_group: result.curr_group };
}

module.exports.authServer = authServer;