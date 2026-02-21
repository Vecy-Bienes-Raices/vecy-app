import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { PageTransition } from '../components/Layout/Shared';
import EdduAIChat from '../components/chat/EdduAIChat';

const SupportView = () => (
    <PageTransition>
        <div className="min-h-screen pt-24 px-6 pb-12 flex flex-col items-center w-full bg-[#050505]">
            <div className="w-full max-w-5xl flex justify-between items-center mb-8">
                <Link to="/" className="flex items-center text-[#d4af37] hover:text-white transition-colors"><ArrowLeft className="w-5 h-5 mr-2" /> Volver al Inicio</Link>
                <div className="text-right hidden md:block">
                    <h2 className="text-2xl font-serif font-bold text-white">Bufete Jurídico Virtual</h2>
                    <p className="text-xs text-gray-500 uppercase tracking-widest">Consultoría Especializada VECY</p>
                </div>
            </div>
            <EdduAIChat />
        </div>
    </PageTransition>
);

export default SupportView;
