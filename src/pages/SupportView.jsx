import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { PageTransition } from '../components/Layout/Shared';
import EdduAIChat from '../components/chat/EdduAIChat';
import SEO from '../components/Layout/SEO';

const SupportView = () => (
    <PageTransition>
        <SEO
            title="Abogado Eddu AI - Consultoría Jurídica Virtual | VECY Academia"
            description="Consultoría jurídica virtual impulsada por IA, especializada en derecho inmobiliario digital y la Ley 527 de 1999. Blinda tus negocios con VECY Academia."
            keywords="VECY, Academia Jurídica, Eddu AI, Derecho Inmobiliario, Ley 527, Colombia, Agente Inmobiliario, Blindaje Digital, Marketing Inmobiliario"
            ogTitle="Abogado Eddu AI - Tu Consultor Jurídico Digital"
            ogDescription="Blinda tus negocios inmobiliarios con la ayuda de Eddu AI. Consultoría experta en blindaje jurídico digital."
            ogImage="/Abogado-Eddu-AI.png"
            ogUrl="https://vecy-academia.vercel.app/abogado-eddu-ai"
        />
        <div className="min-h-screen pt-32 md:pt-36 px-4 md:px-6 pb-6 flex flex-col items-center w-full bg-[#050505]">
            <div className="w-full max-w-7xl flex justify-between items-center mb-6">
                <Link to="/" className="flex items-center text-[#d4af37] hover:text-white transition-colors">
                    <ArrowLeft className="w-5 h-5 mr-2" /> Volver al Inicio
                </Link>
                <div className="text-right hidden md:block">
                    <h2 className="text-xl md:text-2xl font-serif font-bold text-white tracking-tight">Bufete Jurídico Virtual</h2>
                    <p className="text-[10px] md:text-xs text-[#d4af37]/70 uppercase tracking-widest mt-1">Consultoría Especializada VECY</p>
                </div>
            </div>
            <EdduAIChat />
        </div>
    </PageTransition>
);

export default SupportView;
