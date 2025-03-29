const User = require("../models/User");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const jwtSecret = process.env.JWT_SECRET;

const generateToken = (id) => {
    return jwt.sign({ id }, jwtSecret, {
        expiresIn: "7d",
    });
};

const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
        res.status(422).json({
            erros: [
                "Este e-mail já está cadastrado. Por favor, utilize outro e-mail",
            ],
        });

        return;
    }

    const salt = await bcrypt.genSalt();
    const generatePasswordHash = await bcrypt.hash(password, salt);

    const createNewUser = await User.create({
        name,
        email,
        password: generatePasswordHash,
    });

    if (!createNewUser) {
        res
            .status(422)
            .json({
                errors: ["Houve um erro, por favor tente novamente mais tarde."],
            });

        return;
    }

    res.status(201).json({
        _id: createNewUser._id,
        token: generateToken(createNewUser._id),
    });
};

const loginUser = (req, res) => {
    res.send("Login")
}

module.exports = { registerUser, loginUser };
