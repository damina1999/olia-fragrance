import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState('form'); // form | verify
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleRegister = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) return toast.error('Les mots de passe ne correspondent pas');
    setLoading(true);
    try {
      await api.post('/auth/register', { name: form.name, email: form.email, password: form.password });
      toast.success('Code envoyé sur votre email !');
      setStep('verify');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/verify-email', { email: form.email, otp });
      login(data.token, data.user);
      toast.success('Email vérifié ! Bienvenue 🎉');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Code invalide');
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    try {
      await api.post('/auth/resend-otp', { email: form.email });
      toast.success('Code renvoyé');
    } catch (err) {
      toast.error('Erreur');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 to-dark-800 flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <img src="/logo.jpg" alt="Olia Fragrance" className="h-20 w-20 rounded-full object-cover mx-auto mb-3 shadow-lg" />
          <h1 className="font-serif text-3xl text-dark-900">Olia Fragrance</h1>
          <p className="text-gold-500 text-xs tracking-widest uppercase mt-1">The Essence of Beauty</p>
          <p className="text-gray-500 mt-2 text-sm">
            {step === 'form' ? 'Créer un compte' : 'Vérification email'}
          </p>
        </div>

        {step === 'form' ? (
          <form onSubmit={handleRegister} className="space-y-4">
            <input id="name" name="name" required placeholder="Nom complet" value={form.name} onChange={e => set('name', e.target.value)} className="input-field" />
            <input id="email" name="email" required type="email" placeholder="Adresse email" value={form.email} onChange={e => set('email', e.target.value)} className="input-field" />
            <input id="password" name="password" required type="password" placeholder="Mot de passe (min. 6 caractères)" value={form.password} onChange={e => set('password', e.target.value)} className="input-field" minLength={6} />
            <input id="confirm" name="confirm" required type="password" placeholder="Confirmer le mot de passe" value={form.confirm} onChange={e => set('confirm', e.target.value)} className="input-field" />
            <button type="submit" disabled={loading} className="btn-primary w-full py-3">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  Création...
                </span>
              ) : 'Créer mon compte'}
            </button>
          </form>
        ) : (
          <div>
            <div className="bg-gold-50 border border-gold-200 rounded-xl p-4 mb-5 text-center">
              <p className="text-sm text-gray-600">Un code à 6 chiffres a été envoyé à</p>
              <p className="font-semibold text-gray-900">{form.email}</p>
            </div>
            <form onSubmit={handleVerify} className="space-y-4">
              <input
                required
                placeholder="Code à 6 chiffres"
                value={otp}
                onChange={e => setOtp(e.target.value)}
                className="input-field text-center text-2xl tracking-widest font-bold"
                maxLength={6}
              />
              <button type="submit" disabled={loading} className="btn-primary w-full py-3">
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                    Vérification...
                  </span>
                ) : 'Vérifier mon email'}
              </button>
            </form>
            <button onClick={resendOtp} className="w-full text-center text-sm text-gray-500 hover:text-gold-500 mt-3 transition">
              Renvoyer le code
            </button>
          </div>
        )}

        <p className="text-center text-sm text-gray-500 mt-6">
          Déjà un compte ?{' '}
          <Link to="/login" className="text-gold-500 hover:underline font-medium">Se connecter</Link>
        </p>
      </div>
    </div>
  );
}
