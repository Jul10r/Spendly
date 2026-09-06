const { getDB } = require('../config/db');
const { sendVerificationCode, sendPasswordResetEmail } = require('../services/emailService')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto')


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

        const normalizedEmail = email.toLowerCase().trim();
        const existingUser = await getUsers().findOne({ email: normalizedEmail });

        if (existingUser) {
            if (existingUser.isVerified) {
                return res.status(400).json({ message: "Email already registered." });
            }

            const salt = await bcrypt.genSalt(10);
            const psw = await bcrypt.hash(password, salt);
            const verificationCode = crypto.randomInt(100000, 999999).toString();
            const verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000);

            await getUsers().updateOne(
                { _id: existingUser._id },
                {
                    $set: {
                        name: name.trim(),
                        password: psw,
                        verificationCode: verificationCode,
                        verificationCodeExpires: verificationCodeExpires,
                        updatedAt: new Date()
                    }
                }
            );

            await sendVerificationCode(existingUser.email, verificationCode);

            return res.status(200).json({
                message: "An unverified account with this email was found. A fresh verification code has been sent!",
                email: existingUser.email,
                requiresVerification: true
            });
        }

        const salt = await bcrypt.genSalt(10);
        const psw = await bcrypt.hash(password, salt);

        const verificationCode = crypto.randomInt(100000, 999999).toString();

        const verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000);

        const newUser = {
            name: name.trim(),
            email: normalizedEmail,
            password: psw,
            isVerified: false,
            verificationCode: verificationCode,
            verificationCodeExpires: verificationCodeExpires,
            createdAt: new Date()
        }

        const result = await getUsers().insertOne(newUser);

        await sendVerificationCode(newUser.email, verificationCode);

        return res.status(201).json({
            message: "Registration successful! Please check your email for the verification code.",
            email: newUser.email,
            requiresVerification: true
        });

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

        const normalizedEmail = email.toLowerCase().trim();
        const user = await getUsers().findOne({ email: normalizedEmail });

        if (!user) {
            return res.status(400).json({ message: "Invalid email or password!" })
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch == false) {
            return res.status(400).json({ message: "Invalid email or password!" })
        }

        if (user.isVerified === false) {
            let message = "Please verify your email before logging in.";

            if (!user.verificationCode || !user.verificationCodeExpires || new Date() > new Date(user.verificationCodeExpires)) {
                const newCode = crypto.randomInt(100000, 999999).toString();
                const newExpires = new Date(Date.now() + 10 * 60 * 1000);

                await getUsers().updateOne(
                    { _id: user._id },
                    {
                        $set: {
                            verificationCode: newCode,
                            verificationCodeExpires: newExpires
                        }
                    }
                );

                await sendVerificationCode(user.email, newCode);
                message = "Your verification code was expired. A fresh code has been sent to your email.";
            }

            return res.status(403).json({
                message,
                requiresVerification: true,
                email: user.email
            });
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

const verifyEmail = async (req, res) => {
    try {
        const { email, code } = req.body;

        if (!email || !code) {
            return res.status(400).json({ message: "Please provide email and verification code. " })
        }

        const user = await getUsers().findOne({ email: email.toLowerCase().trim() });

        if (!user) {
            return res.status(400).json({ message: "User not found. " })
        }

        if (user.isVerified) {
            return res.status(400).json({ message: "Account is already verified. Please log in." })
        }

        if (user.verificationCode !== code.trim()) {
            return res.status(400).json({ message: "Verification code is incorrect!" })
        }

        if (new Date() > new Date(user.verificationCodeExpires)) {
            return res.status(400).json({ message: "Verification code has expired! Please request a new one." })
        }

        await getUsers().updateOne(
            { _id: user._id },
            {
                $set: { isVerified: true },
                $unset: { verificationCode: "", verificationCodeExpires: "" }
            }
        );

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        return res.status(200).json({
            message: "Email verified successfully!",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (err) {
        console.error("Error verifying email: ", err)
        return res.status(500).json({ message: "Server error verifying email." })
    }
}

const resendVerificationCode = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Please provide the email address." })
        }

        const user = await getUsers().findOne({ email: email.toLowerCase().trim() })

        if (!user) {
            return res.status(400).json({ message: "User not found!" })
        }

        if (user.isVerified) {
            return res.status(400).json({ message: "Account already verified." })
        }

        const newCode = crypto.randomInt(100000, 999999).toString();
        const newExpires = new Date(Date.now() + 10 * 60 * 1000);

        await getUsers().updateOne(
            { _id: user._id },
            {
                $set: {
                    verificationCode: newCode,
                    verificationCodeExpires: newExpires
                }
            }
        );

        await sendVerificationCode(user.email, newCode);

        return res.status(200).json({
            message: "A new verification code has been sent to your email."
        });

    } catch (err) {
        console.error("Unable to resend code: ", err);
        return res.status(500).json({ message: "Server error resending the code." })
    }
}

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Please provide your email address." });
        }

        const normalizedEmail = email.toLowerCase().trim();
        const user = await getUsers().findOne({ email: normalizedEmail });

        if (!user) {
            console.log(`ℹ️ [forgotPassword] Password reset requested for unregistered email: "${normalizedEmail}". No account found.`);
            return res.status(200).json({ message: "If an account with that email exists, a reset code has been sent." });
        }

        const resetCode = crypto.randomInt(100000, 999999).toString();
        const resetExpires = new Date(Date.now() + 10 * 60 * 1000);

        await getUsers().updateOne(
            { _id: user._id },
            {
                $set: {
                    resetPasswordCode: resetCode,
                    resetPasswordExpires: resetExpires
                }
            }
        );

        await sendPasswordResetEmail(user.email, resetCode);

        return res.status(200).json({
            message: "If an account with that email exists, a reset code has been sent."
        });

    } catch (err) {
        console.error("Error in forgotPassword:", err);
        return res.status(500).json({ message: "Server error processing password reset request." });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { email, code, newPassword } = req.body;

        if (!email || !code || !newPassword) {
            return res.status(400).json({ message: "Please provide email, code, and new password." });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters." });
        }

        const user = await getUsers().findOne({ email: email.toLowerCase().trim() });

        if (!user || !user.resetPasswordCode) {
            return res.status(400).json({ message: "Invalid or expired reset code." });
        }

        if (user.resetPasswordCode !== code.trim()) {
            return res.status(400).json({ message: "Invalid reset code." });
        }

        if (new Date() > new Date(user.resetPasswordExpires)) {
            return res.status(400).json({ message: "Reset code has expired. Please request a new one." });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        await getUsers().updateOne(
            { _id: user._id },
            {
                $set: { password: hashedPassword },
                $unset: { resetPasswordCode: "", resetPasswordExpires: "" }
            }
        );

        return res.status(200).json({ message: "Password reset successfully! You can now log in." });

    } catch (err) {
        console.error("Error in resetPassword:", err);
        return res.status(500).json({ message: "Server error resetting password." });
    }
};

module.exports = {
    signup,
    login,
    verifyEmail,
    resendVerificationCode,
    forgotPassword,
    resetPassword
};