import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Scale, Server } from 'lucide-react';
import { PageTransition } from '../components/Layout/Shared';

export const LegalView = () => (
    <PageTransition>
        <div className="min-h-screen pt-24 px-6 pb-12 w-full bg-[#050505]">
            <Link to="/" className="flex items-center text-[#d4af37] mb-8 hover:text-white transition-colors"><ArrowLeft className="w-5 h-5 mr-2" /> Volver</Link>
            <div className="max-w-4xl mx-auto bg-[#1c1c1c] p-12 rounded-sm border border-[#333] shadow-2xl">
                <h1 className="text-3xl font-serif font-bold text-white mb-8 border-b border-[#333] pb-6 flex items-center gap-3"><Scale className="w-8 h-8 text-[#d4af37]" /> Aviso Legal</h1>
                <div className="space-y-8 text-gray-400 text-sm leading-7 text-justify">
                    <p><strong>1. NATURALEZA DEL SERVICIO:</strong> VECY BIENES RAÍCES ofrece esta herramienta educativa sobre la Ley 527 de 1999.</p>
                    <p><strong>2. RESPONSABILIDAD:</strong> El uso de los documentos generados es responsabilidad exclusiva del agente.</p>
                </div>
            </div>
        </div>
    </PageTransition>
);

export const DataPolicyView = () => (
    <PageTransition>
        <div className="min-h-screen pt-24 px-6 pb-12 w-full bg-[#050505]">
            <Link to="/" className="flex items-center text-[#d4af37] mb-8 hover:text-white transition-colors"><ArrowLeft className="w-5 h-5 mr-2" /> Volver</Link>
            <div className="max-w-4xl mx-auto bg-[#1c1c1c] p-12 rounded-sm border border-[#333] shadow-2xl">
                <h1 className="text-3xl font-serif font-bold text-white mb-8 border-b border-[#333] pb-6 flex items-center gap-3"><Server className="w-8 h-8 text-[#10b981]" /> Política de Datos</h1>
                <div className="space-y-6 text-gray-400 text-sm leading-relaxed">
                    <p>Cumplimiento de la <strong>Ley 1581 de 2012</strong>. VECY promueve una política de <strong>CERO PAPEL</strong>.</p>
                </div>
            </div>
        </div>
    </PageTransition>
);
