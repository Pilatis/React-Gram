const express = require("express");
const router = express.Router();

const { registerUser, loginUser, getCurrentUser, updateUser, getUserById } = require("../controllers/UserController");

//middlewares
const validate = require("../middlewares/handleValidation");
const { userCreateValidation, loginValidation, userUpdateValidation } = require("../middlewares/userValidations");
const authGuard = require("../middlewares/authGuard");
const { imageUpload } = require("../middlewares/imageUpload");

// routes
router.post("/register", userCreateValidation(), validate, registerUser);
router.post("/login", loginValidation(), validate, loginUser);
router.get("/profile", authGuard, getCurrentUser);
router.put("/", authGuard, userUpdateValidation(), validate, imageUpload.single("profileImage"), updateUser);
router.get("/:id", getUserById);

module.exports = router;
