import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Loader, Lock, Mail, ShieldCheck } from 'lucide-react';
import { PageTransition } from '../components/Layout/Shared';

const AuthView = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { signIn, signUp } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isLogin) {
                const { error } = await signIn(email, password);
                if (error) throw error;
                navigate('/academia');
            } else {
                const { error } = await signUp(email, password);
                if (error) throw error;
                // Supabase sends a confirmation email by default unless turned off.
                // For VECY MVP, we can just login directly if confirm email is off, or show a toast.
                setIsLogin(true);
                setError('Cuenta creada. Si requiere confirmación, revisa tu correo. Si no, ¡inicia sesión!');
            }
        } catch (err) {
            setError(err.message || "Ha ocurrido un error durante la autenticación");
        } finally {
            setLoading(false);
        }
    };

    return (
        <PageTransition>
            <div className="min-h-screen pt-32 px-6 pb-20 flex flex-col items-center justify-center w-full bg-[#050505] relative overflow-hidden">

                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#bf953f]/5 rounded-full blur-[120px] pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#10b981]/5 rounded-full blur-[120px] pointer-events-none"></div>

                <div className="w-full max-w-md bg-[#0a0a0a] border border-[#333] p-8 md:p-10 rounded-xl relative shadow-[0_0_50px_rgba(0,0,0,0.5)] z-10">

                    <Link to="/" className="absolute top-8 left-8 text-gray-500 hover:text-[#d4af37] transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>

                    <div className="text-center mb-10 mt-4">
                        <div className="inline-flex items-center justify-center p-3 bg-gradient-to-br from-[#1c1c1c] to-[#0a0a0a] rounded-full border border-[#d4af37]/30 mb-6 shadow-[0_0_20px_rgba(212,175,55,0.15)]">
                            <ShieldCheck className="w-8 h-8 text-[#d4af37]" />
                        </div>
                        <h1 className="text-3xl font-serif font-bold text-white mb-2">VECY Academia</h1>
                        <p className="text-sm text-gray-400 font-light">
                            {isLogin ? 'Accede a tus herramientas y cursos' : 'Crea tu cuenta de Agente'}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">Correo Electrónico</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-[#111] border border-[#333] rounded-lg py-3 pl-12 pr-4 text-white focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] outline-none transition-all placeholder-gray-600 text-sm"
                                    placeholder="tucorreo@ejemplo.com"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">Contraseña</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-[#111] border border-[#333] rounded-lg py-3 pl-12 pr-4 text-white focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] outline-none transition-all placeholder-gray-600 text-sm"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        {error && (
                            <div className={`p-4 rounded-lg text-sm border ${error.includes('Cuenta creada') ? 'bg-[#10b981]/10 border-[#10b981]/30 text-[#10b981]' : 'bg-red-500/10 border-red-500/30 text-red-500'}`}>
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-gradient-to-r from-[#bf953f] to-[#fcf6ba] text-black font-bold uppercase tracking-widest text-sm rounded-lg hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all disabled:opacity-50 flex items-center justify-center"
                        >
                            {loading ? <Loader className="w-5 h-5 animate-spin" /> : (isLogin ? 'Iniciar Sesión' : 'Crear Cuenta')}
                        </button>
                    </form>

                    <div className="mt-8 text-center border-t border-[#222] pt-6">
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className="text-gray-400 hover:text-white text-sm transition-colors"
                        >
                            {isLogin ? '¿No tienes cuenta? Registrate aquí' : '¿Ya tienes cuenta? Inicia Sesión'}
                        </button>
                    </div>

                </div>
            </div>
        </PageTransition>
    );
};

export default AuthView;
