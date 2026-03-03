import React, { useState } from 'react';
import { MessageSquare, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { usePayment } from '../../context/PaymentContext';
import AcademyTutorChat from './AcademyTutorChat';

const AcademyFloatingWidget = ({ activeModule }) => {
    const [isChatOpen, setIsChatOpen] = useState(false);
    const { user } = useAuth();
    const { hasAccessToCourse } = usePayment();
    const navigate = useNavigate();

    const handleChatOpen = () => {
        if (!user) {
            navigate('/login');
        } else if (!hasAccessToCourse) {
            navigate('/#planes');
        } else {
            setIsChatOpen(true);
        }
    };

    return (
        <>
            {/* Universal Floating Widget: Interactive AI Tutor Chat */}
            {isChatOpen && (
                <div className="
                    fixed z-50 animate-fade-in
                    bottom-4 right-4 left-4 h-[75vh] max-h-[600px] bg-[#0a0a0a]/98 border border-[#bf953f]/30 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.8),_0_0_30px_rgba(212,175,55,0.15)] overflow-hidden flex flex-col
                    md:bottom-6 md:right-6 md:left-auto md:w-[450px] md:h-[700px] md:max-h-[85vh]
                    lg:bottom-24 lg:right-8 lg:w-[450px] lg:h-[700px] lg:max-h-[80vh]
                ">
                    {/* Header & Close Button */}
                    <div className="absolute top-3 right-3 lg:top-4 lg:right-4 z-50">
                        <button
                            onClick={() => setIsChatOpen(false)}
                            className="p-2 bg-gradient-to-br from-[#2a1f00] to-[#1a1400] text-[#bf953f] hover:text-white border border-[#bf953f]/30 rounded-full shadow-[0_0_15px_rgba(212,175,55,0.2)]"
                        >
                            <X className="w-5 h-5 lg:w-4 lg:h-4" />
                        </button>
                    </div>

                    <div className="flex flex-col h-full pt-4 lg:pt-6">
                        <div className="flex items-center gap-2 mb-4 px-2 lg:px-6 flex-shrink-0">
                            <div className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse"></div>
                            <span className="text-[#bf953f] text-xs font-bold uppercase tracking-[0.2em]">Aula Viva VECY</span>
                        </div>
                        <div className="flex-1 overflow-hidden relative">
                            <AcademyTutorChat module={activeModule} />
                        </div>
                    </div>
                </div>
            )}

            {/* Universal Floating Action Button (FAB) - Maestro Eddu AI Style */}
            <div className={`fixed bottom-6 right-6 md:bottom-10 md:right-10 z-[100] transition-opacity duration-300 ${isChatOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                <button
                    onClick={handleChatOpen}
                    className="relative group block"
                >
                    {/* Main Widget Button */}
                    <div className="relative transition-all duration-300 transform hover:-translate-y-1 active:scale-95 z-10">
                        <div className="relative w-14 h-14 md:w-20 md:h-20 rounded-full overflow-hidden border-2 border-[#d4af37] shadow-[0_0_20px_rgba(212,175,55,0.7)] group-hover:shadow-[0_0_35px_rgba(212,175,55,1)] group-hover:border-[#fcf6ba] bg-[#050505] transition-all">
                            <img
                                src="/perfil_maestro_eddu_ai.png"
                                alt="Maestro Eddu AI"
                                className="w-full h-full object-cover object-[center_10%]"
                                fetchpriority="high"
                            />
                        </div>
                    </div>

                    {/* Speech Bubble Tooltip (Desktop Only) */}
                    <AnimatePresence>
                        <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 hidden md:block opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="bg-black border border-[#333] px-4 py-2 rounded-sm whitespace-nowrap shadow-2xl relative">
                                <span className="text-xs font-bold text-[#bf953f] uppercase tracking-widest">¿Dudas en la Academia?</span>
                                <div className="text-[10px] text-gray-500 mt-1">Pregúntale al <span className="text-white">Maestro Eddu</span></div>

                                {/* Triangle Arrow */}
                                <div className="absolute top-1/2 -right-2 -translate-y-1/2 border-l-8 border-l-[#333] border-y-8 border-y-transparent"></div>
                                <div className="absolute top-1/2 -right-1.5 -translate-y-1/2 border-l-8 border-l-black border-y-8 border-y-transparent"></div>
                            </div>
                        </div>
                    </AnimatePresence>

                    {/* Mobile Badge Only - Online Green */}
                    <div className="md:hidden absolute -top-1 -left-1 bg-[#10b981] w-3 h-3 rounded-full border border-black animate-bounce shadow-md shadow-[#10b981]/40"></div>
                </button>
            </div>
        </>
    );
};

export default AcademyFloatingWidget;
