import React from 'react';
import { Award, Printer, Download, ArrowLeft, ShieldCheck, CheckCircle } from 'lucide-react';
import { PageTransition } from '../Layout/Shared';

const CertificateView = ({ userData, score, onBack }) => {
    const handlePrint = () => {
        window.print();
    };

    const today = new Date().toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    return (
        <PageTransition>
            <div className="max-w-5xl mx-auto px-6 py-12">
                {/* THE CERTIFICATE */}
                <div className="relative bg-white p-6 sm:p-12 md:p-20 shadow-2xl rounded-sm overflow-hidden aspect-auto md:aspect-[1.414/1] min-h-[500px] md:min-h-0 flex flex-col items-center justify-between border-[10px] sm:border-[20px] border-[#bf953f]/20 print:shadow-none print:border shadow-[0_0_60px_rgba(0,0,0,0.5)]">

                    {/* Background Accents */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#bf953f]/5 rounded-bl-full pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#bf953f]/5 rounded-tr-full pointer-events-none"></div>

                    {/* Outer Gold Border */}
                    <div className="absolute inset-4 border-2 border-[#bf953f]/30 pointer-events-none"></div>
                    <div className="absolute inset-6 border border-[#bf953f]/10 pointer-events-none"></div>

                    {/* Content */}
                    <div className="relative z-10 w-full text-center">
                        <div className="flex justify-center mb-8">
                            <div className="relative">
                                <Award className="w-24 h-24 text-[#aa771c] relative z-10" />
                                <div className="absolute inset-0 bg-[#bf953f]/20 blur-2xl rounded-full animate-pulse"></div>
                            </div>
                        </div>

                        <h3 className="text-[#aa771c] font-serif text-xl tracking-[0.4em] uppercase mb-4">Certificación de Excelencia</h3>
                        <h1 className="text-4xl md:text-6xl font-serif font-bold text-black mb-2">Academia VECY</h1>
                        <div className="w-32 h-1 bg-gradient-to-r from-transparent via-[#aa771c] to-transparent mx-auto mb-12"></div>

                        <p className="text-gray-600 font-serif italic text-lg mb-8">Otorga el presente diploma a:</p>

                        <h2 className="text-3xl md:text-5xl font-serif font-bold text-[#111] mb-2 px-4 border-b-2 border-gray-100 pb-4 max-w-2xl mx-auto uppercase tracking-wider">
                            {userData.name}
                        </h2>
                        {userData.idNumber && (
                            <p className="text-gray-500 font-sans text-sm tracking-widest mt-2">D.I. No. {userData.idNumber}</p>
                        )}

                        <div className="mt-12 max-w-3xl mx-auto">
                            <p className="text-[#111] font-sans text-lg leading-relaxed">
                                Por su dominio excepcional como <br />
                                <strong className="text-xl md:text-2xl uppercase tracking-wide text-black block mt-2">
                                    Especialista en Blindaje de Comisiones con Envío Certificado y Herramientas Digitales
                                </strong>
                                <span className="text-gray-600 font-light italic mt-4 block">con una calificación de excelencia del <strong className="font-bold text-black">{score}%</strong></span>
                            </p>
                        </div>
                    </div>

                    {/* Footer of Certificate */}
                    <div className="relative z-10 w-full flex flex-col md:flex-row justify-between items-end mt-12 gap-8 px-12 pb-4">
                        <div className="text-left flex flex-col items-center md:items-start relative">
                            <div className="absolute -top-16 left-0 w-48 pointer-events-none print:block">
                                <img src="/signature-eddu.webp" alt="Firma" className="h-24 object-contain" />
                            </div>
                            <div className="w-48 border-b-2 border-gray-400 mb-2"></div>
                            <p className="text-[#111] font-bold text-sm tracking-widest uppercase">EDUARDO RIVERA (EDDU-AI)</p>
                            <p className="text-gray-500 text-xs font-light">CEO-VECY Academia Jurídica</p>
                        </div>

                        <div className="flex flex-col items-center">
                            <div className="p-4 border-2 border-[#bf953f]/20 rounded-full mb-2 bg-white flex items-center justify-center">
                                <ShieldCheck className="w-12 h-12 text-[#bf953f]" />
                            </div>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Validado Digitalmente</p>
                        </div>

                        <div className="text-right">
                            <p className="text-gray-600 font-serif italic text-sm mb-1">Fecha de Emisión:</p>
                            <p className="text-[#111] font-bold text-sm tracking-widest uppercase">{today}</p>
                        </div>
                    </div>
                </div>

                {/* ACTIONS FOOTER (Moved below and styled) */}
                <div className="flex flex-col sm:flex-row justify-center items-center mt-16 gap-6 print:hidden">
                    <button
                        onClick={onBack}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 border border-[#333] text-gray-400 hover:text-white hover:border-[#bf953f] transition-all rounded-sm font-bold uppercase tracking-widest text-xs group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Regresar al Panel
                    </button>
                    <button
                        onClick={handlePrint}
                        className="btn-gold-premium w-full sm:w-auto flex items-center justify-center gap-3 !px-12 !py-5 !text-sm !font-black"
                    >
                        <Printer className="w-5 h-5" /> Imprimir / PDF
                    </button>
                </div>

                {/* PRINT HELPER */}
                <div className="mt-12 bg-blue-500/10 border border-blue-500/30 p-6 rounded-sm flex items-start gap-4 print:hidden max-w-2xl mx-auto">
                    <CheckCircle className="text-blue-500 w-6 h-6 flex-shrink-0 mt-1" />
                    <div>
                        <p className="text-blue-200 text-sm font-bold mb-1">Recomendación para PDF:</p>
                        <p className="text-blue-100/70 text-xs leading-relaxed">
                            Al hacer clic en "Imprimir / PDF", selecciona **"Guardar como PDF"**. Asegúrate de activar **"Gráficos de fondo"** para mantener el diseño premium de VECY.
                        </p>
                    </div>
                </div>
            </div>

            <style>{`
                @media print {
                    @page { size: auto; margin: 0; }
                    body { background: white !important; margin: 0 !important; padding: 0 !important; }
                    nav, footer, .print\\:hidden, .actions-footer, button { display: none !important; }
                    .max-w-5xl { max-width: 100% !important; margin: 0 !important; width: 100% !important; padding: 0 !important; }
                    .rounded-sm { border-radius: 0 !important; border: none !important; }
                    .shadow-2xl, .shadow-[0_0_60px_rgba(0,0,0,0.5)] { box-shadow: none !important; }
                    .relative.bg-white { 
                        min-height: 100vh !important; 
                        height: 100vh !important; 
                        display: flex !important; 
                        flex-direction: column !important; 
                        justify-content: space-between !important; 
                        padding: 2cm !important;
                        border: none !important;
                    }
                }
            `}</style>
        </PageTransition>
    );
};

export default CertificateView;
