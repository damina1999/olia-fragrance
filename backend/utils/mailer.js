const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === 'true', // true for 465, false for 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * Send verification email with OTP code
 */
exports.sendVerificationEmail = async (to, name, otp) => {
  await transporter.sendMail({
    from: `"Olia Fragrance" <${process.env.SMTP_USER}>`,
    to,
    subject: 'Vérifiez votre adresse email — Olia Fragrance',
    html: `
      <div style="font-family: Georgia, serif; max-width: 520px; margin: auto; background: #fff; border: 1px solid #e5e5e5; border-radius: 12px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #1a1a2e, #0f0f1a); padding: 32px; text-align: center;">
          <h1 style="color: #d4a843; font-size: 28px; margin: 0; letter-spacing: 2px;">OLIA FRAGRANCE</h1>
          <p style="color: rgba(255,255,255,0.5); font-size: 12px; letter-spacing: 3px; margin: 6px 0 0;">THE ESSENCE OF BEAUTY</p>
        </div>
        <div style="padding: 40px 32px;">
          <p style="color: #333; font-size: 16px;">Bonjour <strong>${name}</strong>,</p>
          <p style="color: #555; line-height: 1.6;">Merci de vous être inscrit sur <strong>Olia Fragrance</strong>. Utilisez le code ci-dessous pour vérifier votre adresse email :</p>
          <div style="text-align: center; margin: 32px 0;">
            <div style="display: inline-block; background: #f9f5ee; border: 2px solid #d4a843; border-radius: 12px; padding: 20px 40px;">
              <span style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #1a1a2e;">${otp}</span>
            </div>
          </div>
          <p style="color: #888; font-size: 13px; text-align: center;">Ce code expire dans <strong>15 minutes</strong>.</p>
          <p style="color: #aaa; font-size: 12px; text-align: center; margin-top: 24px;">Si vous n'avez pas créé de compte, ignorez cet email.</p>
        </div>
        <div style="background: #f9f9f9; padding: 16px; text-align: center; border-top: 1px solid #eee;">
          <p style="color: #bbb; font-size: 11px; margin: 0;">© ${new Date().getFullYear()} Olia Fragrance. Tous droits réservés.</p>
        </div>
      </div>
    `,
  });
};

/**
 * Send password reset email
 */
exports.sendPasswordResetEmail = async (to, name, otp) => {
  await transporter.sendMail({
    from: `"Olia Fragrance" <${process.env.SMTP_USER}>`,
    to,
    subject: 'Réinitialisation de mot de passe — Olia Fragrance',
    html: `
      <div style="font-family: Georgia, serif; max-width: 520px; margin: auto; background: #fff; border: 1px solid #e5e5e5; border-radius: 12px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #1a1a2e, #0f0f1a); padding: 32px; text-align: center;">
          <h1 style="color: #d4a843; font-size: 28px; margin: 0; letter-spacing: 2px;">OLIA FRAGRANCE</h1>
        </div>
        <div style="padding: 40px 32px;">
          <p style="color: #333; font-size: 16px;">Bonjour <strong>${name}</strong>,</p>
          <p style="color: #555;">Voici votre code de réinitialisation de mot de passe :</p>
          <div style="text-align: center; margin: 32px 0;">
            <div style="display: inline-block; background: #f9f5ee; border: 2px solid #d4a843; border-radius: 12px; padding: 20px 40px;">
              <span style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #1a1a2e;">${otp}</span>
            </div>
          </div>
          <p style="color: #888; font-size: 13px; text-align: center;">Ce code expire dans <strong>15 minutes</strong>.</p>
        </div>
      </div>
    `,
  });
};
