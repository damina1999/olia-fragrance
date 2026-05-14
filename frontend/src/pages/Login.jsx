import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState('login'); // login | verify | forgot | reset
  const [form, setForm] = useState({ email: '', password: '' });
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pendingEmail, setPendingEmail] = useState('');

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  // Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', form);
      login(data.token, data.user);
      toast.success(`Bienvenue ${data.user.name} !`);
      navigate(data.user.role === 'admin' ? '/admin' : '/');
    } catch (err) {
      if (err.response?.data?.requiresVerification) {
        setPendingEmail(err.response.data.email);
        setMode('verify');
        toast('Vérifiez votre email d\'abord', { icon: '📧' });
      } else {
        toast.error(err.response?.data?.message || 'Identifiants invalides');
      }
    } finally {
      setLoading(false);
    }
  };

  // Verify email after login attempt
  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/verify-email', { email: pendingEmail, otp });
      login(data.token, data.user);
      toast.success('Email vérifié ! Bienvenue 🎉');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Code invalide');
    } finally {
      setLoading(false);
    }
  };

  // Forgot password
  const handleForgot = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email: form.email });
      setPendingEmail(form.email);
      toast.success('Code envoyé sur votre email');
      setMode('reset');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur');
    } finally {
      setLoading(false);
    }
  };

  // Reset password
  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/reset-password', { email: pendingEmail, otp, password: newPassword });
      toast.success('Mot de passe réinitialisé !');
      setMode('login');
      setOtp('');
      setNewPassword('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Code invalide');
    } finally {
      setLoading(false);
    }
  };

  const Logo = () => (
    <div className="text-center mb-8">
      <img src="/logo.jpg" alt="Olia Fragrance" className="h-20 w-20 rounded-full object-cover mx-auto mb-3 shadow-lg" />
      <h1 className="font-serif text-3xl text-dark-900">Olia Fragrance</h1>
      <p className="text-gold-500 text-xs tracking-widest uppercase mt-1">The Essence of Beauty</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 to-dark-800 flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8">
        <Logo />

        {/* LOGIN */}
        {mode === 'login' && (
          <>
            <p className="text-gray-500 text-sm text-center mb-6">Connectez-vous à votre compte</p>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input id="email" name="email" required type="email" placeholder="Adresse email" value={form.email} onChange={e => set('email', e.target.value)} className="input-field pl-10" />
              </div>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input id="password" name="password" required type={showPwd ? 'text' : 'password'} placeholder="Mot de passe" value={form.password} onChange={e => set('password', e.target.value)} className="input-field pl-10 pr-10" />
                <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPwd ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
              <div className="text-right">
                <button type="button" onClick={() => setMode('forgot')} className="text-sm text-gold-500 hover:underline">
                  Mot de passe oublié ?
                </button>
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base">
                {loading ? <span className="flex items-center justify-center gap-2"><span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />Connexion...</span> : 'Se connecter'}
              </button>
            </form>
            <p className="text-center text-sm text-gray-500 mt-6">
              Pas encore de compte ?{' '}
              <Link to="/register" className="text-gold-500 hover:underline font-medium">S'inscrire gratuitement</Link>
            </p>
          </>
        )}

        {/* VERIFY EMAIL */}
        {mode === 'verify' && (
          <>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-5 text-center">
              <p className="text-sm text-gray-600">Code envoyé à</p>
              <p className="font-semibold">{pendingEmail}</p>
            </div>
            <form onSubmit={handleVerify} className="space-y-4">
              <input required placeholder="Code à 6 chiffres" value={otp} onChange={e => setOtp(e.target.value)} className="input-field text-center text-2xl tracking-widest font-bold" maxLength={6} />
              <button type="submit" disabled={loading} className="btn-primary w-full py-3">
                {loading ? 'Vérification...' : 'Vérifier'}
              </button>
            </form>
            <button onClick={() => setMode('login')} className="w-full text-center text-sm text-gray-400 hover:text-gray-600 mt-3">← Retour</button>
          </>
        )}

        {/* FORGOT PASSWORD */}
        {mode === 'forgot' && (
          <>
            <p className="text-gray-500 text-sm text-center mb-6">Entrez votre email pour recevoir un code de réinitialisation</p>
            <form onSubmit={handleForgot} className="space-y-4">
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input required type="email" placeholder="Adresse email" value={form.email} onChange={e => set('email', e.target.value)} className="input-field pl-10" />
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full py-3">
                {loading ? 'Envoi...' : 'Envoyer le code'}
              </button>
            </form>
            <button onClick={() => setMode('login')} className="w-full text-center text-sm text-gray-400 hover:text-gray-600 mt-3">← Retour</button>
          </>
        )}

        {/* RESET PASSWORD */}
        {mode === 'reset' && (
          <>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-5 text-center">
              <p className="text-sm text-gray-600">Code envoyé à</p>
              <p className="font-semibold">{pendingEmail}</p>
            </div>
            <form onSubmit={handleReset} className="space-y-4">
              <input required placeholder="Code à 6 chiffres" value={otp} onChange={e => setOtp(e.target.value)} className="input-field text-center text-2xl tracking-widest font-bold" maxLength={6} />
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input required type={showPwd ? 'text' : 'password'} placeholder="Nouveau mot de passe" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="input-field pl-10 pr-10" minLength={6} />
                <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPwd ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full py-3">
                {loading ? 'Réinitialisation...' : 'Réinitialiser le mot de passe'}
              </button>
            </form>
            <button onClick={() => setMode('login')} className="w-full text-center text-sm text-gray-400 hover:text-gray-600 mt-3">← Retour</button>
          </>
        )}
      </div>
    </div>
  );
}
