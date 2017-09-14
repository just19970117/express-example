const router = require("express").Router();
const authController = require("../controllers/authController.js");

router.get("/login", authController.loginHtml);

router.post("/login", authController.login);

router.get("/isLogin", authController.isLogin);

module.exports = router;