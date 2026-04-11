const nodemailer = require('nodemailer');

// Create transporter for email service
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Send verification email with token link
 */
const sendVerificationEmail = async (email, token, userName) => {
  try {
    const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Verify Your Email - EduFlow',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #6366f1 0%, #10b981 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
              .content { background: #f9fafb; padding: 20px; }
              .button { display: inline-block; background: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
              .footer { text-align: center; color: #6b7280; font-size: 12px; margin-top: 20px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Welcome to EduFlow!</h1>
              </div>
              <div class="content">
                <p>Hi ${userName},</p>
                <p>Thanks for signing up! Please verify your email address by clicking the button below:</p>
                <a href="${verificationLink}" class="button">Verify Email</a>
                <p>Or copy and paste this link in your browser:</p>
                <p><code>${verificationLink}</code></p>
                <p>This link expires in 1 hour.</p>
                <p>If you didn't create this account, please ignore this email.</p>
              </div>
              <div class="footer">
                <p>&copy; ${new Date().getFullYear()} EduFlow. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`Verification email sent to ${email}`);
    return true;
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw error;
  }
};

/**
 * Send password reset email with token link
 */
const sendPasswordResetEmail = async (email, token, userName) => {
  try {
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset Request - EduFlow',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #6366f1 0%, #10b981 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
              .content { background: #f9fafb; padding: 20px; }
              .button { display: inline-block; background: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
              .warning { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; }
              .footer { text-align: center; color: #6b7280; font-size: 12px; margin-top: 20px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Password Reset Request</h1>
              </div>
              <div class="content">
                <p>Hi ${userName},</p>
                <p>We received a request to reset the password for your EduFlow account. Click the button below to reset it:</p>
                <a href="${resetLink}" class="button">Reset Password</a>
                <p>Or copy and paste this link in your browser:</p>
                <p><code>${resetLink}</code></p>
                <p>This link expires in 1 hour.</p>
                <div class="warning">
                  <strong>⚠️ Important:</strong> If you didn't request this, please ignore this email or contact support immediately. Your account is not compromised.
                </div>
                <p>Never share this link with anyone.</p>
              </div>
              <div class="footer">
                <p>&copy; ${new Date().getFullYear()} EduFlow. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`Password reset email sent to ${email}`);
    return true;
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw error;
  }
};

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail,
};
