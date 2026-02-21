import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Sparkles } from 'lucide-react';

const FloatingAiWidget = () => {
    const location = useLocation();

    // Hide widget if explicitly on the support/AI page
    if (location.pathname === '/soporte') return null;

    return (
        <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-[100]"
        >
            <Link to="/soporte" className="relative group block">
                {/* Pulsing Outer Glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#bf953f] to-[#aa771c] rounded-full blur-xl opacity-40 group-hover:opacity-80 transition-opacity animate-pulse"></div>

                {/* Secondary Pinging Ring */}
                <div className="absolute -inset-2 bg-[#bf953f]/20 rounded-full animate-ping pointer-events-none"></div>

                {/* Main Widget Button */}
                <div className="relative bg-black border-2 border-[#bf953f]/50 p-1 md:p-1.5 rounded-full shadow-[0_0_30px_rgba(191,149,63,0.3)] hover:border-[#bf953f] transition-all transform hover:scale-110 active:scale-95 overflow-hidden">
                    <div className="relative w-12 h-12 md:w-16 md:h-16 rounded-full overflow-hidden">
                        <img
                            src="/Eddu-AI.png"
                            alt="Eddu-AI"
                            className="w-full h-full object-cover"
                        />
                        <motion.div
                            animate={{
                                scale: [1, 1.5, 1],
                                opacity: [1, 0.5, 1]
                            }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="absolute -top-2 -right-2"
                        >
                            <Sparkles className="w-4 h-4 text-white" />
                        </motion.div>
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

                {/* Mobile Badge Only */}
                <div className="md:hidden absolute -top-1 -left-1 bg-red-500 w-3 h-3 rounded-full border border-black animate-bounce shadow-md"></div>
            </Link>
        </motion.div>
    );
};

export default FloatingAiWidget;
