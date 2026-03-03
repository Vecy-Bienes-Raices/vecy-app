import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const FloatingAiWidget = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();

    // Hide widget if explicitly on the support/AI page
    if (location.pathname === '/abogado-eddu-ai') return null;

    const handleWidgetClick = (e) => {
        if (!user) {
            e.preventDefault();
            navigate('/login');
        } else {
            e.preventDefault();
            navigate('/abogado-eddu-ai');
        }
    };

    return (
        <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-[100]"
        >
            <button onClick={handleWidgetClick} className="relative group block">
                {/* Main Widget Button */}
                <div className="relative transition-all duration-300 transform hover:-translate-y-1 active:scale-95 z-10">
                    <div className="relative w-14 h-14 md:w-20 md:h-20 rounded-full overflow-hidden border-2 border-[#d4af37] shadow-[0_0_20px_rgba(212,175,55,0.7)] group-hover:shadow-[0_0_35px_rgba(212,175,55,1)] group-hover:border-[#fcf6ba] bg-[#050505] transition-all">
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
                        className="absolute right-full mr-4 top-1/2 -translate-y-1/2 hidden md:block opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
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
            </button>
        </motion.div>
    );
};

export default FloatingAiWidget;
