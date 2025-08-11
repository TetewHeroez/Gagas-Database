import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail', // atau service email lain seperti 'outlook', 'yahoo', dll
  auth: {
    user: process.env.EMAIL_USER, // email pengirim
    pass: process.env.EMAIL_PASS, // password aplikasi email
  },
});

export const sendResetPasswordEmail = async (email, resetToken, namaLengkap) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Reset Password - Gagas Database',
    html: `
      <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #333; margin-bottom: 10px;">Reset Password</h1>
          <p style="color: #666; font-size: 16px;">Gagas Database System</p>
        </div>
        
        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <p style="color: #333; font-size: 16px; margin-bottom: 15px;">Halo <strong>${namaLengkap}</strong>,</p>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 15px;">
            Kami menerima permintaan untuk mereset password akun Anda. Jika Anda yang membuat permintaan ini, 
            silakan klik tombol di bawah untuk mereset password Anda.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; 
                      border-radius: 5px; font-size: 16px; font-weight: bold; display: inline-block;">
              Reset Password
            </a>
          </div>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 15px;">
            Atau copy dan paste link berikut di browser Anda:
          </p>
          
          <p style="color: #007bff; word-break: break-all; margin-bottom: 15px;">
            ${resetUrl}
          </p>
          
          <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="color: #856404; margin: 0; font-size: 14px;">
              <strong>Perhatian:</strong> Link ini akan kedaluwarsa dalam 1 jam. 
              Jika Anda tidak meminta reset password, abaikan email ini.
            </p>
          </div>
        </div>
        
        <div style="text-align: center; color: #999; font-size: 12px; border-top: 1px solid #eee; padding-top: 20px;">
          <p>Email ini dikirim secara otomatis, mohon jangan membalas email ini.</p>
          <p>&copy; 2024 Gagas Database System. All rights reserved.</p>
        </div>
      </div>
    `,
  };

  try {
    // Untuk development, log email content instead of sending
    if (process.env.NODE_ENV === 'development' || !process.env.EMAIL_USER || process.env.EMAIL_USER === 'your-email@gmail.com') {
      console.log('📧 DEVELOPMENT MODE - Email would be sent to:', email);
      console.log('🔗 Reset URL:', resetUrl);
      console.log('📝 Email content:', {
        from: process.env.EMAIL_USER,
        to: email,
        subject: mailOptions.subject,
        resetUrl: resetUrl
      });
      return { success: true };
    }

    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
};

export default { sendResetPasswordEmail };
