const User = require("../models/User");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { mongoose } = require("mongoose");
const { ObjectId } = mongoose.Types

const jwtSecret = process.env.JWT_SECRET;

const generatePasswordHash = async (password) => {
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    return passwordHash;
}

const generateToken = (id) => {
    return jwt.sign({ id }, jwtSecret, {
        expiresIn: "7d",
    });
};

const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    const user = await User.findOne({ email });

    if (user) {
        res.status(422).json({
            erros: [
                "Este e-mail já está cadastrado. Por favor, utilize outro e-mail",
            ],
        });

        return;
    }

    // const salt = await bcrypt.genSalt();
    // const generatePasswordHash = await bcrypt.hash(password, salt);
    const passwordHash = await generatePasswordHash(password);

    const createNewUser = await User.create({
        name,
        email,
        password: passwordHash,
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

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        res.status(404).json({ errors: ["Usuário não encontrado."] });

        return;
    }

    if (!(await bcrypt.compare(password, user.password))) {
        res.status(422).json({ erros: ["Senha inválida"] })

        return
    }

    res.status(201).json({
        _id: user._id,
        profileImage: user.profileImage,
        token: generateToken(user._id)
    })
}

const getCurrentUser = async (req, res) => {
    const user = req.user;

    res.status(200).json(user);
};

const updateUser = async (req, res) => {
    const { name, password, bio } = req.body;

    let profileImage = null;

    if (req.file) {
        profileImage = req.file.filename;
    };

    const reqUser = req.user;

    const user = await User.findById(new ObjectId(reqUser._id)).select("-password")

    if (name) {
        user.name = name;
    }

    if (password) {
        const passwordHash = await generatePasswordHash(password);

        user.password = passwordHash
    }

    if (profileImage) {
        user.profileImage = profileImage
    };

    if (bio) {
        user.bio = bio;
    };

    await user.save();

    res.status(200).json(user)
};

const getUserById = async(req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findById(new ObjectId(id)).select("-password");

        if (!user) {
            res.status(404).json({ errors: ["Usuário não encontrado"] })
        }

        res.status(200).json(user)
    } catch (error) {
        res.status(404).json({ errors: ["Usuário não encontrado."] });

        return;
    }


};

module.exports = { registerUser, loginUser, getCurrentUser, updateUser, getUserById };
