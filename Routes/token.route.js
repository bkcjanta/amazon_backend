const express = require("express");
const tokenRoute = express.Router();
require("dotenv").config()
const jwt = require("jsonwebtoken")
const { usersModel } = require("../Models/Users.model");
const { generateAccessToken, generateRefreshToken } = require('../Middlewares/generateToken')
tokenRoute.get("/", (req, res) => {
    let x = 1;
    const refreshToken = req.cookies.refreshToken
    console.log("token refrshed")
    console.log("refreshToken", refreshToken)

    if (!refreshToken) {
        // console.log("object")
        res.status(401).send({ msg: "Please Login Again" })
    } else {
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_PRIVATE_KEY, async (err, decoded) => {
            if (err) {
                // console.log(err)
                res.status(401).send({ msg: "Please Login Again" })

            } else {
                // console.log(decoded)
                const user = await usersModel.findById(decoded.userID)
                const accessToken = generateAccessToken(user._id)
                let userObj = {
                    name: user.name,
                    email: user.email,
                    accessToken: accessToken,
                    mobile: user.mobile,
                }
                res.status(200).send({ user: userObj });
            }
        }
        )
    }

})

module.exports = { tokenRoute }