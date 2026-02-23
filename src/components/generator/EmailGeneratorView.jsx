import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
    ArrowLeft, Gavel, FileText, Copy, Loader, Scale
} from 'lucide-react';
import { callGemini } from '../../utils/aiUtils';
import { PageTransition, FormatText } from '../Layout/Shared';
import { track } from '@vercel/analytics';

const EmailGeneratorView = () => {
    const [topic, setTopic] = useState('');
    const [customTopic, setCustomTopic] = useState('');
    const [details, setDetails] = useState('');
    const [generatedEmail, setGeneratedEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const previewRef = useRef(null);

    const handleGenerate = async () => {
        if (!topic) return;
        if (topic === 'otro' && !customTopic) return;

        setLoading(true);

        const systemPrompt = `
        ACTÚA COMO: Un Abogado Experto en Derecho Inmobiliario y Civil Colombiano (VECY Legal AI).
        TU OBJETIVO: Redactar documentos jurídicos impecables, blindados y profesionales.

        INSTRUCCIONES DE REDACCIÓN:
        1. TONO: Formal, contundente, pero claro.
        2. FORMATO: Estructura clara con Títulos en Negrita.
        3. RESALTADO: Usa doble asterisco **Texto** para resaltar: Nombres, Fechas, Valores de Dinero, Leyes Citadas, y Plazos.
        4. FUNDAMENTO LEGAL: Cita la normativa colombiana aplicable (Código Civil, Código de Comercio, Ley 1579, etc.).
        5. CLÁUSULAS ESENCIALES: Si es una Promesa, incluye arras, linderos, precio, forma de pago y fecha de firma. Si es Corretaje, incluye comisión, exclusividad (si aplica) y plazo.
        `;

        const finalTopic = topic === 'otro' ? customTopic : topic;
        const userPrompt = `
        SOLICITUD DEL CLIENTE: Redactar un documento tipo: "${finalTopic}".
        DETALLES ESPECÍFICOS: ${details}
        
        Por favor, genera el documento completo listo para copiar y pegar.
        `;

        try {
            const result = await callGemini(userPrompt, systemPrompt);
            setGeneratedEmail(result);
            if (previewRef.current) previewRef.current.scrollTop = 0;

            track('contract_generated', {
                topic: finalTopic,
                details_length: details.length
            });
        } catch (error) {
            console.error("Error generando documento:", error);
            setGeneratedEmail("Hubo un error contactando al bufete virtual. Por favor intenta de nuevo.");
        }
        setLoading(false);
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(generatedEmail);
        track('contract_copied', {
            topic: topic === 'otro' ? customTopic : topic
        });
    };

    return (
        <PageTransition>
            <div className="min-h-screen pt-24 px-6 pb-12 flex flex-col items-center w-full bg-[#050505]">
                <div className="w-full max-w-6xl flex justify-between items-center mb-8">
                    <Link to="/" className="flex items-center text-[#d4af37] hover:text-white transition-colors">
                        <ArrowLeft className="w-5 h-5 mr-2" /> Volver al Bufete
                    </Link>
                    <div className="text-right hidden md:block">
                        <h2 className="text-2xl font-serif font-bold text-white flex items-center justify-end gap-2">
                            Redactor Jurídico VECY <Gavel className="w-5 h-5 text-[#bf953f]" />
                        </h2>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 md:gap-10 w-full max-w-7xl">
                    <div className="bg-[#1c1c1c] p-6 md:p-10 rounded-sm border border-[#333] h-fit shadow-lg">
                        <div className="mb-8">
                            <label className="block text-[#d4af37] text-xs font-bold uppercase tracking-widest mb-3">Tipo de Trámite Legal</label>
                            <select
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                className="w-full bg-black border border-[#333] rounded-sm p-4 text-white focus:border-[#bf953f] outline-none text-sm mb-4 transition-colors"
                            >
                                <option value="">Seleccione una opción...</option>
                                <option value="Presentación Formal de Cliente">Presentación Formal de Cliente</option>
                                <option value="Promesa de Compraventa">Promesa de Compraventa</option>
                                <option value="Contrato de Corretaje Inmobiliario">Corretaje Inmobiliario</option>
                                <option value="Reclamación de Honorarios">Reclamación de Honorarios</option>
                                <option value="Acuerdo de Puntas Compartidas">Acuerdo de Puntas (Colegas)</option>
                                <option value="Terminación de Contrato de Mandato">Terminación de Contrato</option>
                                <option value="otro">OTRO (Redacción Personalizada)</option>
                            </select>

                            {topic === 'otro' && (
                                <input
                                    type="text"
                                    placeholder="Escribe el título del documento"
                                    value={customTopic}
                                    onChange={(e) => setCustomTopic(e.target.value)}
                                    className="w-full bg-[#111] border border-[#bf953f] rounded-sm p-4 text-[#bf953f] placeholder-gray-600 outline-none text-sm animate-fade-in"
                                />
                            )}
                        </div>

                        <div className="mb-8">
                            <label className="block text-[#d4af37] text-xs font-bold uppercase tracking-widest mb-3">Detalles del Caso</label>
                            <textarea
                                value={details}
                                onChange={(e) => setDetails(e.target.value)}
                                placeholder="Nombres de las partes, fechas, valores, direcciones..."
                                className="w-full bg-black border border-[#333] rounded-sm p-4 text-white h-64 focus:border-[#bf953f] outline-none resize-none text-sm leading-relaxed"
                            />
                        </div>
                        <button
                            onClick={handleGenerate}
                            disabled={loading || !topic}
                            className="btn-gold-premium w-full"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2"><Loader className="w-5 h-5 animate-spin" /> Redactando...</span>
                            ) : (
                                'Generar Documento Legal'
                            )}
                        </button>
                    </div>

                    <div className="bg-[#111] p-6 md:p-10 rounded-sm border border-[#333] relative min-h-[500px] md:min-h-[600px] flex flex-col shadow-2xl">
                        <div className="absolute top-0 right-0 p-6 z-10">
                            <button onClick={copyToClipboard} className="text-gray-400 hover:text-[#d4af37] transition-colors" title="Copiar al portapapeles"><Copy className="w-6 h-6" /></button>
                        </div>
                        <h3 className="text-white font-serif font-bold mb-6 border-b border-[#333] pb-4 flex items-center gap-2"><FileText className="w-5 h-5 text-[#bf953f]" /> Vista Previa</h3>
                        {generatedEmail ? (
                            <div ref={previewRef} className="flex-1 overflow-y-auto pr-4 custom-scrollbar">
                                <div className="whitespace-pre-line text-gray-300 text-sm leading-8 font-light font-serif">
                                    <FormatText text={generatedEmail} />
                                </div>
                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-gray-600 opacity-40">
                                <Scale className="w-24 h-24 mb-6 stroke-1" />
                                <p className="text-center text-sm font-light tracking-wide">Esperando instrucciones...</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </PageTransition>
    );
};

export default EmailGeneratorView;
