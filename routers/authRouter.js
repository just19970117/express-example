const router = require("express").Router();
const authController = require("../controllers/authController.js");

router.get("/login", authController.loginHtml);

router.post("/login", authController.login);

router.get("/isLogin", authController.isLogin);

router.get("/register",authController.registerHtml);

router.post("/register",authController.register);

module.exports = router;