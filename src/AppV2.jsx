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
import FloatingAiWidget from './components/Layout/FloatingAiWidget';

const AppV2 = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const location = useLocation();

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
            `}</style>

            <ScrollToTop />

            {/* NAVBAR */}
            <nav className={`fixed w-full z-50 transition-all duration-500 border-b ${scrolled ? 'bg-[#0a0a0a]/95 backdrop-blur-md border-[#333] shadow-lg' : 'bg-transparent border-transparent'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-24">
                        <Link to="/" className="flex-shrink-0 flex items-center gap-4 cursor-pointer">
                            <div className="relative group">
                                <div className="absolute -inset-1 bg-gradient-to-r from-[#bf953f] to-[#aa771c] rounded-full blur opacity-50 group-hover:opacity-100 transition duration-500"></div>
                                <img src="/logo_academia_juridica.png" alt="VECY Logo" className="relative h-14 w-14 rounded-full bg-black z-10" />
                            </div>
                            <div className="hidden sm:block">
                                <span className="block font-serif text-2xl tracking-widest bg-clip-text text-transparent font-bold" style={{ backgroundImage: theme.goldGradient }}>VECY</span>
                                <span className="block text-xs text-[#d4af37] tracking-[0.3em] uppercase mt-1">Jurídico IA</span>
                            </div>
                        </Link>
                        <div className="hidden md:block">
                            <div className="ml-10 flex items-baseline space-x-8">
                                <Link to="/academia" className="text-gray-400 hover:text-white transition-colors duration-300 text-xs font-semibold uppercase tracking-[0.15em] py-2 border-b-2 border-transparent hover:border-[#bf953f]">Academia VECY</Link>
                                <a href="/#mito" className="text-gray-400 hover:text-white transition-colors duration-300 text-xs font-semibold uppercase tracking-[0.15em] py-2 border-b-2 border-transparent hover:border-[#bf953f]">Riesgos WhatsApp</a>
                                <a href="/#ley" className="text-gray-400 hover:text-white transition-colors duration-300 text-xs font-semibold uppercase tracking-[0.15em] py-2 border-b-2 border-transparent hover:border-[#bf953f]">Marco Legal</a>
                                <a href="/#herramientas" className="text-gray-400 hover:text-white transition-colors duration-300 text-xs font-semibold uppercase tracking-[0.15em] py-2 border-b-2 border-transparent hover:border-[#bf953f]">Herramientas</a>
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
                    <div className="md:hidden absolute top-24 left-0 w-full bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-[#bf953f]/30 animate-fade-in z-40">
                        <div className="px-6 py-8 space-y-4">
                            <Link to="/academia" className="text-white block px-4 py-3 rounded-sm border-l-2 border-[#bf953f] bg-white/5 font-serif text-lg tracking-wide" onClick={() => setMobileMenuOpen(false)}>Academia VECY</Link>
                            <a href="/#mito" className="text-gray-300 hover:text-white block px-4 py-3 text-base" onClick={() => setMobileMenuOpen(false)}>Riesgos WhatsApp</a>
                            <a href="/#ley" className="text-gray-300 hover:text-white block px-4 py-3 text-base" onClick={() => setMobileMenuOpen(false)}>Marco Legal</a>
                            <a href="/#herramientas" className="text-gray-300 hover:text-white block px-4 py-3 text-base" onClick={() => setMobileMenuOpen(false)}>Herramientas</a>
                        </div>
                    </div>
                )}
            </nav>

            <AnimatePresence mode="wait">
                <Routes location={location} key={location.pathname}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/academia" element={<CourseView />} />
                    <Route path="/generador" element={<EmailGeneratorView />} />
                    <Route path="/soporte" element={<SupportView />} />
                    <Route path="/legal" element={<LegalView />} />
                    <Route path="/datos" element={<DataPolicyView />} />
                </Routes>
            </AnimatePresence>

            <FloatingAiWidget />

            <footer className="py-12 bg-black border-t border-[#222] text-center">
                <div className="max-w-4xl mx-auto px-6">
                    <img src="/logo_academia_juridica.png" alt="VECY" className="h-16 w-16 mx-auto rounded-full border border-[#bf953f]/30 mb-6 grayscale hover:grayscale-0 transition-all duration-500 bg-black" />
                    <p className="text-[#d4af37] font-serif text-lg mb-2">VECY BIENES RAÍCES</p>
                    <p className="text-gray-600 text-xs tracking-widest uppercase mb-8">Tecnología + Derecho + Innovación</p>
                    <div className="flex flex-col md:flex-row justify-center gap-6 text-sm text-gray-500">
                        <Link to="/legal" className="hover:text-gray-300 transition-colors text-xs uppercase tracking-widest">Aviso Legal</Link>
                        <Link to="/datos" className="hover:text-gray-300 transition-colors text-xs uppercase tracking-widest">Política de Datos</Link>
                        <Link to="/soporte" className="hover:text-gray-300 transition-colors text-xs uppercase tracking-widest">Bufete Virtual VECY</Link>
                    </div>
                    <p className="text-gray-700 text-xs mt-12">© 2026 VECY. Todos los derechos reservados.</p>
                </div>
            </footer>
        </div>
    );
};

export default AppV2;
