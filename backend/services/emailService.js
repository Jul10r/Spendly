const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: (process.env.EMAIL_PASS || '').replace(/\s+/g, '')
    }
});

const sendVerificationCode = async (toEmail, code) => {
    try {
        await transporter.sendMail({
            from: `"Spendly" <${process.env.EMAIL_USER}>`,
            to: toEmail,
            subject: 'Verify your Spendly account',
            html: `
                <div style="font-family: sans-serif; max-width: 500px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; rounded: 16px;">
                    <h2 style="color: #1e293b;">Welcome to Spendly!</h2>
                    <p style="color: #64748b;">Your 6-digit verification code is:</p>
                    <h1 style="color: #4f46e5; letter-spacing: 5px; font-size: 32px;">${code}</h1>
                    <p style="color: #64748b;">This code will expire in 10 minutes.</p>
                </div>
            `
        });
        console.log(`✅ Verification email sent to ${toEmail}`);
        return { success: true };
    } catch (error) {
        console.error('❌ Error sending verification email:', error);
        throw error;
    }
};

const sendPasswordResetEmail = async (toEmail, code) => {
    try {
        await transporter.sendMail({
            from: `"Spendly" <${process.env.EMAIL_USER}>`,
            to: toEmail,
            subject: 'Reset your Spendly password',
            html: `
                <div style="font-family: sans-serif; max-width: 500px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; rounded: 16px;">
                    <h2 style="color: #1e293b;">Password Reset Request</h2>
                    <p style="color: #64748b;">You requested to reset your password. Use the 6-digit code below:</p>
                    <h1 style="color: #4f46e5; letter-spacing: 5px; font-size: 32px;">${code}</h1>
                    <p style="color: #64748b;">This code will expire in 10 minutes. If you did not request this, please ignore this email.</p>
                </div>
            `
        });
        console.log(`✅ Password reset email sent to ${toEmail}`);
        return { success: true };
    } catch (error) {
        console.error('❌ Error sending password reset email:', error);
        throw error;
    }
};

module.exports = { sendVerificationCode, sendPasswordResetEmail };