const nodemailer = require('nodemailer');
const admin = require('firebase-admin');

const sendBookingConfirmationEmail = async (email, bookingDetails) => {
  const { restaurantName, date, time, people } = bookingDetails;

  const emailContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h1 style="color: #2563eb;">Booking Confirmed! 🎉</h1>
      <p>Your table has been successfully booked at ${restaurantName}.</p>
      
      <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h2 style="color: #1f2937; margin-top: 0;">Booking Details</h2>
        <p><strong>Date:</strong> ${date}</p>
        <p><strong>Time:</strong> ${time}</p>
        <p><strong>Number of People:</strong> ${people}</p>
        <p><strong>Restaurant:</strong> ${restaurantName}</p>
      </div>
      
      <p style="color: #4b5563;">
        If you need to modify or cancel your reservation, please contact the restaurant directly.
      </p>
      
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
        <p style="color: #6b7280; font-size: 14px;">
          This is an automated message, please do not reply to this email.
        </p>
      </div>
    </div>
  `;

  try {
    // Create a transporter using Gmail SMTP
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
      }
    });

    // Send email
    await transporter.sendMail({
      from: '"Reserv8" <noreply@reserv8.com>',
      to: email,
      subject: 'Your Restaurant Booking Confirmation',
      html: emailContent
    });

    console.log('✉️ Confirmation email sent successfully');
    return true;
  } catch (error) {
    console.error('❌ Error sending confirmation email:', error);
    return false;
  }
};

const sendVerificationEmail = async (email) => {
  console.log('📧 Starting email verification process for:', email);
  try {
    // Generate Firebase verification link first
    const actionCodeSettings = {
      url: 'http://localhost:3000/verify-email',
      handleCodeInApp: true
    };

    console.log('🔗 Generating Firebase verification link...');
    const verificationLink = await admin.auth().generateEmailVerificationLink(email, actionCodeSettings);
    console.log('✅ Verification link generated successfully');

    // Create email content with the verification link
    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #2563eb;">Verify Your Email Address</h1>
        <p>Thank you for signing up with Reserv8! Please verify your email address by clicking the button below:</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationLink}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
            Verify Email
          </a>
        </div>
        
        <p style="color: #4b5563;">
          If the button doesn't work, you can copy and paste this link into your browser:
          <br>
          ${verificationLink}
        </p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 14px;">
            This is an automated message, please do not reply to this email.
          </p>
        </div>
      </div>
    `;

    // Create a transporter using Gmail SMTP
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
      }
    });

    // Send email
    await transporter.sendMail({
      from: '"Reserv8" <noreply@reserv8.com>',
      to: email,
      subject: 'Verify Your Email - Reserv8',
      html: emailContent
    });

    console.log('✉️ Verification email sent successfully');
    return true;
  } catch (error) {
    console.error('❌ Error sending verification email:', error);
    if (error.code === 'EAUTH') {
      console.error('🔐 Gmail authentication failed. This usually means the app password is incorrect.');
      console.error('Please generate a new app password from Google Account settings.');
    }
    return false;
  }
};

module.exports = {
  sendBookingConfirmationEmail,
  sendVerificationEmail
};
