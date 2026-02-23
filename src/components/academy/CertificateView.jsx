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
                <div className="relative bg-white p-6 sm:p-12 md:p-16 shadow-2xl rounded-sm overflow-hidden aspect-auto md:aspect-[1.414/1] min-h-[500px] md:min-h-[700px] flex flex-col items-center justify-between border-[10px] sm:border-[15px] border-[#bf953f]/20 print:shadow-none print:border-none shadow-[0_0_60px_rgba(0,0,0,0.5)] print:m-0 print:p-8">

                    {/* Background Accents */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#bf953f]/5 rounded-bl-full pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#bf953f]/5 rounded-tr-full pointer-events-none"></div>

                    {/* Outer Gold Border */}
                    <div className="absolute inset-4 border-2 border-[#bf953f]/30 pointer-events-none"></div>
                    <div className="absolute inset-6 border border-[#bf953f]/10 pointer-events-none"></div>

                    {/* Content */}
                    <div className="relative z-10 w-full text-center mt-4">
                        <div className="flex justify-center mb-6">
                            <div className="relative">
                                <img src="/logo_academia_juridica.png" alt="Insignia VECY" className="w-32 h-32 object-contain relative z-10 drop-shadow-xl" />
                                <div className="absolute inset-0 bg-[#bf953f]/10 blur-3xl rounded-full"></div>
                            </div>
                        </div>

                        <h3 className="text-[#aa771c] font-serif text-sm tracking-[0.5em] uppercase mb-4">Certificación de Excelencia</h3>
                        <h1 className="text-4xl md:text-5xl font-serif font-bold text-black mb-2">Academia VECY</h1>
                        <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-[#aa771c] to-transparent mx-auto mb-10"></div>

                        <p className="text-gray-500 font-serif italic text-base mb-6">Otorga el presente diploma a:</p>

                        <h2 className="text-3xl md:text-5xl font-serif font-bold text-[#111] mb-2 px-4 border-b border-gray-100 pb-4 max-w-2xl mx-auto uppercase tracking-wide">
                            {userData.name}
                        </h2>
                        {userData.idNumber && (
                            <p className="text-gray-400 font-sans text-[10px] uppercase tracking-[0.4em] mt-2 font-bold">D.I. No. {userData.idNumber}</p>
                        )}

                        <div className="mt-10 max-w-3xl mx-auto">
                            <p className="text-[#333] font-sans text-base leading-relaxed">
                                Por su dominio excepcional como <br />
                                <strong className="text-lg md:text-xl uppercase tracking-wider text-black block mt-3 px-10 leading-tight">
                                    ESPECIALISTA EN BLINDAJE DE COMISIONES CON ENVÍO CERTIFICADO Y HERRAMIENTAS DIGITALES
                                </strong>
                                <span className="text-gray-500 font-light italic mt-6 block text-sm">con una calificación de excelencia del <strong className="font-bold text-black text-lg">{score}%</strong></span>
                            </p>
                        </div>
                    </div>

                    {/* Footer of Certificate - Centered & Premium */}
                    <div className="relative z-10 w-full flex flex-col items-center mt-12 mb-4">
                        {/* Signature Section */}
                        <div className="flex flex-col items-center relative mb-12">
                            <img src="/signature-eddu.png" alt="Firma" className="h-24 object-contain absolute -top-16 pointer-events-none" />
                            <div className="w-56 border-b border-gray-400 mb-3"></div>
                            <p className="text-[#111] font-bold text-xs tracking-[0.2em] uppercase">EDUARDO RIVERA (EDDU-AI)</p>
                            <p className="text-gray-500 text-[10px] uppercase tracking-widest mt-1">CEO - VECY Academia Jurídica</p>
                        </div>

                        {/* Validation & Date in a clean row */}
                        <div className="w-full max-w-2xl flex justify-between items-center px-8 border-t border-gray-100 pt-8">
                            <div className="text-left w-32">
                                <p className="text-gray-400 font-serif italic text-[10px] mb-1">Fecha de Emisión:</p>
                                <p className="text-[#111] font-bold text-[10px] tracking-widest uppercase">{today}</p>
                            </div>

                            <div className="flex flex-col items-center">
                                <div className="p-3 border border-[#bf953f]/30 rounded-full mb-2 bg-white flex items-center justify-center shadow-inner">
                                    <ShieldCheck className="w-8 h-8 text-[#bf953f]" />
                                </div>
                                <p className="text-[8px] text-gray-400 font-bold uppercase tracking-[0.3em] text-center">Validado Digitalmente</p>
                            </div>

                            <div className="text-right w-32">
                                <p className="text-gray-400 font-serif italic text-[10px] mb-1">Registro No:</p>
                                <p className="text-[#111] font-bold text-[10px] tracking-widest uppercase">VECY-{Date.now().toString().slice(-6)}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ACTIONS FOOTER */}
                <div className="flex flex-col sm:flex-row justify-center items-center mt-16 gap-6 print:hidden">
                    <button
                        onClick={onBack}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 border border-[#333] text-gray-400 hover:text-white hover:border-[#bf953f] transition-all rounded-sm font-bold uppercase tracking-widest text-xs group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Regresar
                    </button>
                    <button
                        onClick={handlePrint}
                        className="btn-gold-premium w-full sm:w-auto flex items-center justify-center gap-3 !px-12 !py-5 !text-sm !font-black shadow-[0_0_30px_rgba(191,149,63,0.3)] animate-pulse"
                    >
                        <Printer className="w-5 h-5" /> Imprimir Diploma de Élite
                    </button>
                </div>

                {/* PRINT HELPER */}
                <div className="mt-12 bg-blue-500/10 border border-blue-500/30 p-6 rounded-sm flex items-start gap-4 print:hidden max-w-2xl mx-auto backdrop-blur-sm">
                    <CheckCircle className="text-blue-500 w-6 h-6 flex-shrink-0 mt-1" />
                    <div>
                        <p className="text-blue-200 text-sm font-bold mb-1">Instrucciones para impresión perfecta:</p>
                        <ul className="text-blue-100/70 text-xs leading-relaxed list-disc ml-4 space-y-1">
                            <li>Selecciona **"Guardar como PDF"**.</li>
                            <li>Formato de papel: **A4 o Carta**.</li>
                            <li>Orientación: **Horizontal (Landscape)**.</li>
                            <li>Activa **"Gráficos de fondo"** (Background Graphics).</li>
                            <li>Margen: **Ninguno (None)** para ajuste perfecto a una hoja.</li>
                        </ul>
                    </div>
                </div>
            </div>

            <style>{`
                @media print {
                    @page { size: landscape; margin: 0; }
                    html, body { 
                        margin: 0 !important; 
                        padding: 0 !important; 
                        background: white !important;
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }
                    nav, footer, .print\\:hidden, button, .actions-footer { display: none !important; }
                    .max-w-5xl { max-width: 100% !important; margin: 0 !important; width: 100% !important; padding: 0 !important; }
                    .relative.bg-white { 
                        width: 100vw !important;
                        height: 100vh !important;
                        min-height: 100vh !important;
                        margin: 0 !important;
                        padding: 1.5cm !important;
                        border: none !important;
                        box-shadow: none !important;
                        display: flex !important;
                        flex-direction: column !important;
                        justify-content: space-between !important;
                        align-items: center !important;
                        border-radius: 0 !important;
                    }
                    /* Forzar que el borde dorado no se corte */
                    .absolute.inset-4, .absolute.inset-6 {
                        print-color-adjust: exact !important;
                        -webkit-print-color-adjust: exact !important;
                    }
                }
            `}</style>
        </PageTransition>
    );
};

export default CertificateView;
