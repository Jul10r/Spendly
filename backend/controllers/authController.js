const { getDB } = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const getUsers = () => getDB().collection('users');

const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "Please provide all fields." })
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters." })
        }

        if (await getUsers().findOne({ email: email.toLowerCase().trim() })) {
            return res.status(400).json({ message: "Email already registered." })
        }

        const salt = await bcrypt.genSalt(10);
        const psw = await bcrypt.hash(password, salt);

        const newUser = {
            name: name.trim(),
            email: email.toLowerCase().trim(),
            password: psw,
            createdAt: new Date()
        }

        const result = await getUsers().insertOne(newUser);

        const token = jwt.sign(
            { id: result.insertedId },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        return res.status(201).json({
            token,
            user: {
                id: result.insertedId,
                name,
                email
            }
        })

    } catch (err) {
        console.error("Failed to SignUp ", err);
        return res.status(500).json({ message: "Server error in creating the account." })
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Please provide email and password!" })
        }

        const user = await getUsers().findOne({ email: email.toLowerCase().trim() })

        if (!user) {
            return res.status(400).json({ message: "Invalid email or password!" })
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch == false) {
            return res.status(400).json({ message: "Invalid email or password!" })
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        return res.status(200).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        })

    } catch (err) {
        console.error("Error logging in", err)
        return res.status(500).json({ message: "Server error logging in" })
    }
}

module.exports = { signup, login };