require('dotenv').config()

const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')
const axios = require('axios')

function authServer() {

    app.use(express.json())

    // Later we can scale this to be stored in database
    let refreshTokens = []

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

    app.delete('/logout', (req, res) => {
        refreshTokens = refreshTokens.filter(token => token !== req.body.token)
        res.sendStatus(204)
    })

    app.post('/login', async (req, res) => {

        // Authenticate User
        const token = req.body.token;
        console.log(token);
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
        const user = { id: email }
        const accessToken = generateAccessToken(user)
        const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)
        refreshTokens.push(refreshToken)
        console.log(`access token for ${email}: ${accessToken}`)
        res.json({ accessToken: accessToken, refreshToken: refreshToken })
    })

    app.listen(4000, () => { console.log('Auth server listening on port 4000') })
}

function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15s' })
}

module.exports.authServer = authServer;