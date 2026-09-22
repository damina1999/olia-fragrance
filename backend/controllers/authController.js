const { validationResult } = require('express-validator');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const { sendVerificationEmail, sendPasswordResetEmail } = require('../utils/mailer');

const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

const sendToken = (user, res, status = 200) => {
  const token = generateToken(user._id);
  res.status(status).json({
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      isVerified: user.isVerified,
    }
  });
};

// POST /api/auth/register
exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { name, email, password } = req.body;
  try {
    if (await User.findOne({ email })) {
      return res.status(400).json({ message: 'Email déjà utilisé' });
    }

    const user = await User.create({
      name,
      email,
      password,
      isVerified: true, // Auto-verified, no email required
    });

    res.status(201).json({
      message: 'Compte créé avec succès.',
      email,
      requiresVerification: false,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/auth/verify-email
exports.verifyEmail = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'Utilisateur introuvable' });
    if (user.isVerified) return res.status(400).json({ message: 'Email déjà vérifié' });
    if (user.emailOtp !== otp || user.emailOtpExpire < Date.now()) {
      return res.status(400).json({ message: 'Code invalide ou expiré' });
    }

    user.isVerified = true;
    user.emailOtp = undefined;
    user.emailOtpExpire = undefined;
    await user.save();

    sendToken(user, res);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/auth/resend-otp
exports.resendOtp = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'Utilisateur introuvable' });
    if (user.isVerified) return res.status(400).json({ message: 'Email déjà vérifié' });

    const otp = generateOtp();
    user.emailOtp = otp;
    user.emailOtpExpire = new Date(Date.now() + 15 * 60 * 1000);
    await user.save();

    await sendVerificationEmail(email, user.name, otp);
    res.json({ message: 'Code renvoyé' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/auth/login
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !user.password) {
      return res.status(401).json({ message: 'Identifiants invalides' });
    }
    const match = await user.matchPassword(password);
    if (!match) return res.status(401).json({ message: 'Identifiants invalides' });

    if (!user.isVerified) {
      return res.status(403).json({
        message: 'Email non vérifié. Vérifiez votre boîte mail.',
        requiresVerification: true,
        email,
      });
    }

    sendToken(user, res);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/auth/forgot-password
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'Aucun compte avec cet email' });

    const otp = generateOtp();
    user.resetOtp = otp;
    user.resetOtpExpire = new Date(Date.now() + 15 * 60 * 1000);
    await user.save();

    await sendPasswordResetEmail(email, user.name, otp);
    res.json({ message: 'Code de réinitialisation envoyé' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/auth/reset-password
exports.resetPassword = async (req, res) => {
  const { email, otp, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'Utilisateur introuvable' });
    if (user.resetOtp !== otp || user.resetOtpExpire < Date.now()) {
      return res.status(400).json({ message: 'Code invalide ou expiré' });
    }

    user.password = password;
    user.resetOtp = undefined;
    user.resetOtpExpire = undefined;
    await user.save();

    res.json({ message: 'Mot de passe réinitialisé avec succès' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/auth/me
exports.getMe = async (req, res) => {
  res.json(req.user);
};

// PUT /api/auth/me
exports.updateMe = async (req, res) => {
  const { name, avatar } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, avatar },
      { new: true }
    ).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/auth/profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password -verificationToken -resetPasswordToken -resetPasswordExpire -otp -otpExpire');
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/auth/profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select('+password');
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });

    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;

    if (newPassword) {
      if (!currentPassword) return res.status(400).json({ message: 'Mot de passe actuel requis' });
      const isMatch = await user.matchPassword(currentPassword);
      if (!isMatch) return res.status(400).json({ message: 'Mot de passe actuel incorrect' });
      user.password = newPassword;
    }

    await user.save();
    res.json({
      message: 'Profil mis à jour',
      user: { _id: user._id, name: user.name, email: user.email, role: user.role, phone: user.phone },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
