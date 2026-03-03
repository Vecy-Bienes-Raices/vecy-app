import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ShieldAlert, Check, ShieldCheck, Scale, FileSignature, Presentation, FileSearch, Building2, Gavel, FileCheck, Users, AlertCircle } from 'lucide-react';
import { PageTransition } from '../components/Layout/Shared';
import AbogadoFloatingWidget from '../components/Layout/AbogadoFloatingWidget';
import SEO from '../components/Layout/SEO';
import { usePayment } from '../context/PaymentContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { openEpaycoCheckout } from '../lib/epayco';

const SupportView = () => {
    const { hasPaidSupport, processPaymentSuccess } = usePayment();
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleCheckout = (plan) => {
        if (!user) {
            navigate('/login');
        } else {
            openEpaycoCheckout(user, plan);
        }
    };

    return (
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

            <div className="min-h-screen pt-32 pb-20 px-6 max-w-7xl mx-auto flex flex-col items-center justify-center">

                {/* Back button */}
                <div className="w-full flex justify-start mb-10">
                    <Link to="/" className="flex items-center text-[#d4af37] hover:text-white transition-colors uppercase tracking-widest text-xs font-bold">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Volver al Inicio
                    </Link>
                </div>

                {/* Hero Section */}
                <div className="w-full flex flex-col md:flex-row items-center gap-12 mb-20 relative">
                    <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-[#bf953f]/5 blur-[120px] rounded-full pointer-events-none"></div>

                    <div className="flex-1 space-y-8 relative z-10 w-full">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#d4af37]/30 bg-[#d4af37]/5 text-[#d4af37] text-xs font-bold uppercase tracking-widest">
                            <ShieldAlert className="w-4 h-4" /> Inteligencia Artificial Jurídica
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white leading-tight">
                            Tu <span className="text-[#d4af37]">Abogado</span> Inmobiliario Digital
                        </h1>
                        <p className="text-lg text-gray-400 font-light leading-relaxed max-w-xl">
                            Accede a la mente legal más avanzada de Colombia preparada para resolver cualquier duda sobre Derecho Inmobiliario, Comercial y herramientas digitales. Disponible 24/7 sin agendar citas.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <a href="#planes-abogado" className="btn-gold-premium px-8 py-4 text-sm whitespace-nowrap text-center">
                                Ver Planes y Precios
                            </a>
                            <a href="#capacidades" className="px-8 py-4 text-sm font-bold text-white uppercase tracking-widest border border-[#333] hover:border-[#bf953f] transition-all rounded-sm text-center">
                                Ver Capacidades
                            </a>
                        </div>
                    </div>

                    <div className="flex-1 relative w-full max-w-lg mx-auto md:max-w-none">
                        <div className="relative aspect-[4/5] rounded-2xl overflow-hidden border border-[#d4af37]/30 shadow-[0_0_50px_rgba(212,175,55,0.15)] group">
                            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent z-10"></div>
                            <img src="/portada-abogado-ai.png" alt="Abogado Eddu AI Portada" className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-700 bg-[#0a0a0a]" />
                        </div>
                    </div>
                </div>

                {/* Capabilities Section */}
                <div id="capacidades" className="w-full max-w-6xl mb-24 relative z-10">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-serif font-bold text-white mb-4">Resolución de Casos de la Vida Real</h2>
                        <p className="text-gray-400 text-sm max-w-2xl mx-auto">Nuestro modelo ha sido entrenado estrictamente con legislación colombiana (Código de Comercio, Código Civil y Ley 527) para resolver problemas críticos que enfrentan los agentes a diario.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            { icon: FileSearch, title: 'Estudio de Títulos', desc: 'Sube los documentos del predio y recibe un análisis exhaustivo de la viabilidad jurídica.' },
                            { icon: FileSignature, title: 'Certificados de Libertad', desc: 'Lectura e interpretación al instante. Validación de gravámenes, embargos o afectaciones a la propiedad.' },
                            { icon: Building2, title: 'Cámaras de Comercio', desc: 'Análisis detallado de representantes legales, capacidades de contratación y viabilidad en negocios B2B.' },
                            { icon: Scale, title: 'Reclamación de Comisiones', desc: 'Análisis probatorio (con o sin corretaje firmado) y estrategias de cobro pre-jurídico efectivas.' },
                            { icon: Gavel, title: 'Guía Procesal Inmobiliaria', desc: 'Acompañamiento experto en procesos de restitución de inmueble, lanzamiento y demandas civiles.' },
                            { icon: FileCheck, title: 'Contratos de Arrendamiento', desc: 'Revisión y solución de controversias con aseguradoras, inquilinos, reparaciones y Ley 820.' },
                            { icon: Users, title: 'Pleitos de Compraventa', desc: 'Solución a discrepancias entre comprador y vendedor, retractos, arras y cláusulas penales.' },
                            { icon: ShieldCheck, title: 'Revisión de Cláusulas Abusivas', desc: 'Blindaje total contra contratos leoninos de constructoras o inmobiliarias deshonestas.' },
                            { icon: AlertCircle, title: 'Ley 527 y Firma Digital', desc: 'Validación de la legalidad de negociaciones por WhatsApp y firmas electrónicas en promesas.' }
                        ].map((cap, idx) => (
                            <div key={idx} className="bg-[#0e0e0e] border border-[#222] hover:border-[#bf953f]/40 p-6 rounded-xl transition-all duration-300 group hover:-translate-y-1">
                                <div className="mb-4 text-[#bf953f] bg-[#bf953f]/10 w-12 h-12 flex items-center justify-center rounded-lg group-hover:scale-110 transition-transform">
                                    <cap.icon className="w-6 h-6" />
                                </div>
                                <h3 className="text-white font-bold mb-2 text-sm">{cap.title}</h3>
                                <p className="text-gray-500 text-xs leading-relaxed">{cap.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="w-full text-center mb-10 relative z-10">
                    <h2 className="text-3xl font-serif font-bold text-white mb-4">Membresías del Bufete</h2>
                    <p className="text-gray-400 text-sm">Elige el plan que mejor se adapte al volumen de tus transacciones.</p>
                </div>

                {/* Pricing / Status Section */}
                <div id="planes-abogado" className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl w-full">

                    {/* Plan Mensual */}
                    <div className="bg-[#0e0e0e] border border-[#333] hover:border-[#bf953f]/50 p-8 rounded-2xl relative overflow-hidden transition-all group">
                        <h3 className="text-2xl font-serif font-bold text-white mb-2">Mensual</h3>
                        <p className="text-sm text-gray-500 mb-6 font-medium">Suscríbete sin permanencia</p>
                        <div className="mb-8">
                            <span className="text-4xl font-bold text-white group-hover:text-[#d4af37] transition-colors">$199.997</span>
                            <span className="text-gray-500 text-sm"> /mes COP</span>
                        </div>

                        <ul className="space-y-4 mb-10 border-t border-[#333] pt-6">
                            {[
                                'Consultoría Jurídica Limitada 24/7',
                                'Análisis de Ley 527 y Código de Comercio',
                                'Reconocimiento de Notas de Voz',
                                'Soporte Técnico Especializado',
                                'ACCESO GRATUITO AL CURSO MÁSTER'
                            ].map((feature, idx) => (
                                <li key={idx} className="flex items-start text-gray-300 text-sm">
                                    <Check className="w-5 h-5 text-[#10b981] mr-3 shrink-0" />
                                    <span dangerouslySetInnerHTML={{ __html: feature.replace("ACCESO GRATUITO AL CURSO MÁSTER", "<strong class='text-[#d4af37]'>ACCESO GRATUITO AL CURSO MÁSTER</strong>") }} />
                                </li>
                            ))}
                        </ul>

                        {hasPaidSupport ? (
                            <div className="w-full py-4 bg-[#10b981]/10 border border-[#10b981]/30 rounded-xl text-[#10b981] font-bold text-center text-sm">
                                Suscripción Activa
                            </div>
                        ) : (
                            <button onClick={() => handleCheckout('abogado_mensual')} className="w-full py-4 border border-[#333] hover:border-[#d4af37] rounded-xl text-white font-bold uppercase tracking-widest text-sm transition-all hover:bg-white/5">
                                {user ? 'Seleccionar Mensual' : 'Inicia Sesión para Comprar'}
                            </button>
                        )}
                    </div>

                    {/* Plan Anual - Destacado */}
                    <div className="bg-gradient-to-br from-[#1c1c1c] via-[#111] to-[#000] border border-[#d4af37]/50 p-8 rounded-2xl relative overflow-hidden transition-all shadow-[0_0_40px_rgba(212,175,55,0.15)] group transform md:-translate-y-4">
                        <div className="absolute top-0 right-0 bg-[#d4af37] text-black text-[10px] font-bold uppercase tracking-[0.2em] px-4 py-1 rounded-bl-xl">
                            2 Meses Gratis
                        </div>

                        <h3 className="text-2xl font-serif font-bold text-[#d4af37] mb-2">Anual Inteligente</h3>
                        <p className="text-sm text-gray-400 mb-6 font-medium">El favorito de los top producers</p>
                        <div className="mb-8">
                            <span className="text-5xl font-bold text-white">$1.999.970</span>
                            <span className="text-gray-500 text-sm"> /año COP</span>
                        </div>

                        <ul className="space-y-4 mb-10 border-t border-[#d4af37]/20 pt-6">
                            {[
                                'Consultoría Jurídica Ilimitada Prioritaria',
                                'Análisis de Documentos Complejos de Ley 527',
                                'Reconocimiento Inteligente de Interacciones',
                                'Soporte VIP Personalizado',
                                'ACCESO GRATUITO AL CURSO MÁSTER (Acceso Vitalicio)'
                            ].map((feature, idx) => (
                                <li key={idx} className="flex items-start text-gray-300 text-sm">
                                    <Check className="w-5 h-5 text-[#d4af37] mr-3 shrink-0" />
                                    <span dangerouslySetInnerHTML={{ __html: feature.replace("ACCESO GRATUITO AL CURSO MÁSTER (Acceso Vitalicio)", "<strong class='text-[#d4af37]'>ACCESO GRATUITO AL CURSO MÁSTER</strong>") }} />
                                </li>
                            ))}
                        </ul>

                        {hasPaidSupport ? (
                            <div className="w-full py-4 bg-[#10b981]/10 border border-[#10b981]/30 rounded-xl text-[#10b981] font-bold text-center text-sm">
                                Suscripción Activa
                            </div>
                        ) : (
                            <button onClick={() => handleCheckout('abogado_anual')} className="w-full btn-gold-premium !rounded-xl !py-4 text-sm">
                                {user ? 'Iniciar Plan Anual' : 'Inicia Sesión para Comprar'}
                            </button>
                        )}
                    </div>
                </div>

                {/* Abogado Floating Widget (Solo visible aquí, abre el Popup Chat) */}
                <AbogadoFloatingWidget />

            </div>
        </PageTransition>
    );
};

export default SupportView;
