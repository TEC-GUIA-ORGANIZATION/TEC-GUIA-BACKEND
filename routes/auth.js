const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController.js")
const middlewareauth = require("../middleware/auth.js")


router.post('/register', authController.register)
router.post('/login', authController.login)
router.get("/verifyToken", authController.verifyToken)
router.post('/logout', authController.logout)

module.exports = router;