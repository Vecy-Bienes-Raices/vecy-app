import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

// Components & Pages
import { ScrollToTop } from './components/Layout/Shared';
import HomePage from './pages/HomePage';
import CourseView from './components/academy/CourseView';
import EmailGeneratorView from './components/generator/EmailGeneratorView';
import SupportView from './pages/SupportView';
import { LegalView, DataPolicyView } from './pages/StaticViews';
import AuthView from './pages/AuthView';
import { useAuth } from './context/AuthContext';
import { usePayment } from './context/PaymentContext';

const AppV2 = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const location = useLocation();
    const { user, signOut } = useAuth();
    const { logout: paymentLogout } = usePayment();

    const handleLogout = async () => {
        await signOut();
        paymentLogout();
    };

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const theme = {
        background: 'radial-gradient(circle at center, #1a1a1a 0%, #0a0a0a 60%, #000000 100%)',
        goldGradient: 'linear-gradient(135deg, #bf953f 0%, #fcf6ba 25%, #b38728 50%, #fbf5b7 75%, #aa771c 100%)',
    };

    return (
        <div className="min-h-screen font-sans text-gray-100 selection:bg-[#aa771c] selection:text-white overflow-x-hidden" style={{ background: theme.background }}>
            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 8px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: #111; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #333; border-radius: 4px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #bf953f; }
                body { background-color: #000000; overflow-x: hidden; }
                img { image-rendering: auto; }
            `}</style>

            <ScrollToTop />

            {/* NAVBAR */}
            <nav className={`fixed w-full z-50 transition-all duration-500 border-b ${scrolled ? 'bg-[#0a0a0a]/95 backdrop-blur-md border-[#333] shadow-lg' : 'bg-transparent border-transparent'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-24">
                        <Link to="/" className="flex-shrink-0 flex items-center gap-4 cursor-pointer">
                            <div className="relative group">
                                <div className="absolute inset-0 bg-[#bf953f] blur-[20px] opacity-40 group-hover:opacity-70 transition duration-500 rounded-full"></div>
                                <img src="/logo_academia_juridica.png" alt="VECY Logo" className="relative h-16 w-16 z-10" fetchpriority="high" />
                            </div>
                            <div className="hidden sm:block">
                                <span className="block font-serif text-2xl tracking-widest bg-clip-text text-transparent font-bold uppercase" style={{ backgroundImage: theme.goldGradient }}>VECY</span>
                                <span className="block text-xs text-[#d4af37] tracking-[0.3em] uppercase mt-1">Academia</span>
                            </div>
                        </Link>
                        <div className="hidden md:block">
                            <div className="ml-10 flex items-center space-x-8">
                                <Link to="/" className="text-gray-400 hover:text-white transition-colors duration-300 text-xs font-semibold uppercase tracking-[0.15em] py-2 border-b-2 border-transparent hover:border-[#bf953f]">Presentación</Link>
                                <a href="/#curso" className="text-gray-400 hover:text-white transition-colors duration-300 text-xs font-semibold uppercase tracking-[0.15em] py-2 border-b-2 border-transparent hover:border-[#bf953f]">El Curso</a>
                                <a href="/#planes" className="text-gray-400 hover:text-white transition-colors duration-300 text-xs font-semibold uppercase tracking-[0.15em] py-2 border-b-2 border-transparent hover:border-[#bf953f]">Herramientas IA</a>
                                {user ? (
                                    <>
                                        <Link to="/academia" className="text-[#bf953f] hover:text-[#0a0a0a] hover:bg-[#bf953f] transition-all duration-300 text-xs font-bold uppercase tracking-[0.15em] py-2 px-4 border border-[#bf953f] rounded-sm shadow-[0_0_10px_rgba(212,175,55,0.2)] hover:shadow-[0_0_20px_rgba(212,175,55,0.6)]">Mi Academia</Link>
                                        <button onClick={handleLogout} className="text-red-400 hover:text-red-300 transition-colors duration-300 text-xs font-semibold uppercase tracking-[0.15em] py-2">Cerrar Sesión</button>
                                    </>
                                ) : (
                                    <Link to="/login" className="text-[#bf953f] hover:text-[#0a0a0a] hover:bg-[#bf953f] transition-all duration-300 text-xs font-bold uppercase tracking-[0.15em] py-2 px-4 border border-[#bf953f] rounded-sm shadow-[0_0_10px_rgba(212,175,55,0.2)] hover:shadow-[0_0_20px_rgba(212,175,55,0.6)]">Iniciar Sesión</Link>
                                )}
                            </div>
                        </div>

                        <div className="md:hidden flex items-center">
                            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-gray-400 hover:text-white focus:outline-none">
                                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </button>
                        </div>
                    </div>
                </div>

                {mobileMenuOpen && (
                    <div className="md:hidden absolute top-24 left-0 w-full bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-[#bf953f]/30 animate-fade-in z-40 shadow-2xl">
                        <div className="px-6 py-8 space-y-4">
                            <Link to="/" className="text-gray-300 hover:text-white block px-4 py-3 text-base border-b border-[#222]" onClick={() => setMobileMenuOpen(false)}>Presentación</Link>
                            <a href="/#curso" className="text-gray-300 hover:text-white block px-4 py-3 text-base border-b border-[#222]" onClick={() => setMobileMenuOpen(false)}>El Curso</a>
                            <a href="/#planes" className="text-gray-300 hover:text-white block px-4 py-3 text-base border-b border-[#222]" onClick={() => setMobileMenuOpen(false)}>Herramientas IA</a>
                            {user ? (
                                <>
                                    <Link to="/academia" className="text-black block px-4 py-3 mt-4 rounded-sm bg-gradient-to-r from-[#bf953f] to-[#fcf6ba] font-bold text-center tracking-wider uppercase shadow-[0_0_15px_rgba(212,175,55,0.4)]" onClick={() => setMobileMenuOpen(false)}>Mi Academia</Link>
                                    <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="text-red-400 w-full text-left block px-4 py-3 font-bold uppercase tracking-wider text-sm mt-2">Cerrar Sesión</button>
                                </>
                            ) : (
                                <Link to="/login" className="text-black block px-4 py-3 mt-4 rounded-sm bg-gradient-to-r from-[#bf953f] to-[#fcf6ba] font-bold text-center tracking-wider uppercase shadow-[0_0_15px_rgba(212,175,55,0.4)]" onClick={() => setMobileMenuOpen(false)}>Iniciar Sesión</Link>
                            )}
                        </div>
                    </div>
                )}
            </nav>

            <AnimatePresence mode="wait">
                <Routes location={location} key={location.pathname}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/academia" element={<CourseView />} />
                    <Route path="/redactor-juridico" element={<EmailGeneratorView />} />
                    <Route path="/abogado-eddu-ai" element={<SupportView />} />
                    <Route path="/legal" element={<LegalView />} />
                    <Route path="/datos" element={<DataPolicyView />} />
                    <Route path="/login" element={<AuthView />} />
                </Routes>
            </AnimatePresence>

            <footer className="py-12 bg-black border-t border-[#222] text-center">
                <div className="max-w-4xl mx-auto px-6">
                    <img src="/logo_academia_juridica.png" alt="VECY" className="h-20 w-20 mx-auto mb-6 grayscale hover:grayscale-0 transition-all duration-500 drop-shadow-[0_0_15px_rgba(191,149,63,0.4)]" loading="lazy" />
                    <p className="text-[#d4af37] font-serif text-lg mb-2">VECY ACADEMIA</p>
                    <p className="text-gray-600 text-xs tracking-widest uppercase mb-8">Tecnología + Derecho + Innovación</p>
                    <div className="flex flex-col md:flex-row justify-center gap-6 text-sm text-gray-500">
                        <Link to="/legal" className="hover:text-gray-300 transition-colors text-xs uppercase tracking-widest">Aviso Legal</Link>
                        <Link to="/datos" className="hover:text-gray-300 transition-colors text-xs uppercase tracking-widest">Política de Datos</Link>
                        <Link to="/abogado-eddu-ai" className="hover:text-gray-300 transition-colors text-xs uppercase tracking-widest">Abogado Virtual VECY</Link>
                    </div>
                    <p className="text-gray-700 text-xs mt-12">© 2026 VECY. Todos los derechos reservados.</p>
                </div>
            </footer>
        </div>
    );
};

export default AppV2;
