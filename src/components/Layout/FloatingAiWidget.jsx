import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Sparkles } from 'lucide-react';

const FloatingAiWidget = () => {
    const location = useLocation();

    // Hide widget if explicitly on the support/AI page
    if (location.pathname === '/abogado-eddu-ai') return null;

    return (
        <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-[100]"
        >
            <Link to="/abogado-eddu-ai" className="relative group block">
                {/* Pulsing Outer Glow - Intensified */}
                <div className="absolute -inset-1 bg-gradient-to-r from-[#bf953f] to-[#d4af37] rounded-full blur-2xl opacity-60 group-hover:opacity-100 transition-opacity animate-pulse"></div>

                {/* Secondary Pinging Ring */}
                <div className="absolute -inset-4 bg-[#bf953f]/30 rounded-full animate-ping pointer-events-none"></div>

                {/* Main Widget Button - Removed padding to make image fill the ring */}
                <div className="relative bg-black border-2 border-[#d4af37] rounded-full shadow-[0_0_40px_rgba(212,175,55,0.6)] hover:border-[#bf953f] transition-all transform hover:scale-110 active:scale-95 overflow-hidden ring-4 ring-[#bf953f]/20">
                    <div className="relative w-14 h-14 md:w-20 md:h-20 rounded-full overflow-hidden">
                        <img
                            src="/Eddu-AI.png"
                            alt="Eddu-AI"
                            className="w-full h-full object-cover"
                            fetchpriority="high"
                        />
                    </div>
                </div>

                {/* Speech Bubble Tooltip (Desktop Only) */}
                <AnimatePresence>
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1 }}
                        className="absolute right-full mr-4 top-1/2 -translate-y-1/2 hidden md:block"
                    >
                        <div className="bg-black border border-[#333] px-4 py-2 rounded-sm whitespace-nowrap shadow-2xl relative">
                            <span className="text-xs font-bold text-[#bf953f] uppercase tracking-widest">¿Necesitas ayuda jurídica?</span>
                            <div className="text-[10px] text-gray-500 mt-1">Pregúntale a <span className="text-white">Eddu-IA</span></div>

                            {/* Triangle Arrow */}
                            <div className="absolute top-1/2 -right-2 -translate-y-1/2 border-l-8 border-l-[#333] border-y-8 border-y-transparent"></div>
                            <div className="absolute top-1/2 -right-1.5 -translate-y-1/2 border-l-8 border-l-black border-y-8 border-y-transparent"></div>
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Mobile Badge Only - Online Green */}
                <div className="md:hidden absolute -top-1 -left-1 bg-[#10b981] w-3 h-3 rounded-full border border-black animate-bounce shadow-md shadow-[#10b981]/40"></div>
            </Link>
        </motion.div>
    );
};

export default FloatingAiWidget;
