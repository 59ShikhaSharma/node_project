const express = require("express");
const jwt = require('jsonwebtoken');
const app = express();
const port = 3000;
const secretKey = "secretkey";

app.get("/", (req, res) => {
    res.json({
        message: "a sample api"
    })
})

app.post('/login', (req, res) => {
    const user = {
        id: 1,
        username: "Shikha",
        email: "abc@gmail.com"
    }
    jwt.sign({ user }, secretKey, { expiresIn: '300s' }, (err, token) => {
        res.json({
            token
        })

    })
})

app.post('/profile', verifyToken, (req, res) => {
    jwt.verify(req.token, secretKey, (err, authData) => {
        if (err) {
            res.send({ result: "Invalid Token" })
        } else {
            res.json({
                message: "profile accessed",
                authData
            })
        }
    })

})

function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(" ");
        const token = bearer[1];
        req.token = token;
        next();

    } else {
        res.send({
            result: "Token is not valid"
        })
    }
}

app.listen(port, () => {
    console.log(`App is running on ${port}`);

})