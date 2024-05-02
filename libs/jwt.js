const jwt = require("jsonwebtoken");
require('dotenv').config();

function createAccessToken(payload) {
    return new Promise((resolve, reject) => {
        jwt.sign(payload, process.env.TOKEN_SECRET, { expiresIn: "1d" }, (err, token) => {
            if (err) reject(err);
            console.log("fireit!");
            resolve(token);
        });
    });
}

module.exports = {
    createAccessToken
};