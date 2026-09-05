const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = 'Spendly <onboarding@resend.dev>';

const sendVerificationCode = async (toEmail, code) => {

    try {
        const data = await resend.emails.send({
            from: FROM_EMAIL,
            to: toEmail,
            subject: 'Verify your Spendly account',
            html: `
                <div style="font-family: sans-serif; max-width: 500px; margin: auto; padding: 20px;">
                    <h2>Welcome to Spendly!</h2>
                    <p>Your 6-digit verification code is:</p>
                    <h1 style="color: #4f46e5; letter-spacing: 4px;">${code}</h1>
                    <p>This code will expire in 10 minutes.</p>
                </div>
            `
        });
        return { success: true, data };
    } catch (error) {
        console.error('Error sending verification email:', error);
        throw error;
    }
};

const sendPasswordResetEmail = async (toEmail, code) => {

    try {

        const data = await resend.emails.send({
            from: FROM_EMAIL,
            to: toEmail,
            subject: 'Reset your Spendly password',
            html: `
                <div style="font-family: sans-serif; max-width: 500px; margin: auto; padding: 20px;">
                    <h2>Password Reset Request</h2>
                    <p>You requested to reset your password. Use the 6-digit code below:</p>
                    <h1 style="color: #4f46e5; letter-spacing: 4px;">${code}</h1>
                    <p>This code will expire in 10 minutes. If you did not request this, you can safely ignore this email.</p>
                </div>
                `
        });
        return { success: true, data };

    } catch (err) {
        console.error("Error sending password reset email:", err)
        throw err;
    }
}

module.exports = { sendVerificationCode, sendPasswordResetEmail };