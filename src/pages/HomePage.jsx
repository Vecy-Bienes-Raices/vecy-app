import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    Award, ChevronDown, Scale, AlertTriangle, Shield, Check, XCircle,
    Smartphone, FileText, CheckCircle, Mail, Gavel, FileCheck, BookOpen
} from 'lucide-react';
import { PageTransition } from '../components/Layout/Shared';

const HomePage = () => {
    const location = useLocation();

    useEffect(() => {
        if (location.hash) {
            const id = location.hash.replace('#', '');
            const element = document.getElementById(id);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }, [location]);

    const theme = {
        goldGradient: 'linear-gradient(135deg, #bf953f 0%, #fcf6ba 25%, #b38728 50%, #fbf5b7 75%, #aa771c 100%)',
    };

    return (
        <PageTransition>
            {/* HERO SECTION */}
            <section className="relative min-h-screen flex items-center justify-center pt-24 pb-12 overflow-hidden">
                <div className="absolute inset-0 z-0 opacity-15"><div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div></div>
                <div className="relative z-10 max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
                    <div className="text-left">
                        <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full border border-[#bf953f]/50 bg-[#bf953f]/10 backdrop-blur-md">
                            <Award className="w-4 h-4 text-[#bf953f]" />
                            <span className="text-[#d4af37] text-xs font-bold tracking-[0.1em] uppercase">Nuevo Lanzamiento 2026</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6 leading-tight text-white drop-shadow-xl animate-title-fade">
                            El primer curso virtual de Bienes Raíces <br />
                            <span className="bg-clip-text text-transparent" style={{ backgroundImage: theme.goldGradient }}>guiado 100% por Inteligencia Artificial</span>
                        </h1>
                        <p className="text-lg md:text-xl text-gray-300 mb-8 font-light leading-relaxed">
                            Aprende a cobrar el 100% de tus honorarios. <strong className="text-white font-bold">Que no te vuelvan a robar una comisión</strong> por hacer negocios por WhatsApp. Descubre el poder del correo y elimina los riesgos procesales para siempre.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                            <a href="#curso" className="btn-gold-premium text-center w-full sm:w-auto shadow-[0_0_25px_rgba(212,175,55,0.4)] hover:shadow-[0_0_40px_rgba(212,175,55,0.8)] border border-[#fcf6ba] !text-black font-bold text-lg py-4 px-8 transform hover:-translate-y-1 transition-all duration-300">
                                Ver Contenido del Curso
                            </a>
                            <a href="#planes" className="text-gray-400 hover:text-white flex items-center gap-2 text-sm font-semibold tracking-widest transition-colors uppercase mt-4 sm:mt-0 sm:ml-4">
                                Ver Planes Premium <ChevronDown className="w-4 h-4" />
                            </a>
                        </div>
                    </div>
                    <div className="relative animate-fade-in flex justify-center mt-12 md:mt-0">
                        <div className="absolute inset-0 bg-[#bf953f] blur-[100px] opacity-20 rounded-full animate-pulse duration-3000"></div>
                        <img
                            src="/curso.png"
                            alt="Curso Máster Inmobiliario VECY"
                            className="relative z-10 w-full max-w-md md:max-w-lg lg:max-w-xl object-contain drop-shadow-[0_0_30px_rgba(212,175,55,0.3)] transform hover:scale-[1.02] transition-transform duration-700"
                        />
                    </div>
                </div>
            </section>

            {/* EL RIESGO SECTION */}
            <section id="riesgo" className="py-16 md:py-24 relative bg-[#050505] border-t border-[#222]">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-serif font-bold mb-6">
                            <span className="text-white">¿Por qué sigues perdiendo </span>
                            <span className="text-red-500">Comisiones</span>?
                        </h2>
                        <p className="text-gray-400 max-w-3xl mx-auto font-light text-lg">
                            Un "Ok" en WhatsApp no tiene validez instantánea ante un juez. Cuando el propietario o un colega decide saltarte, tus chats no son un título ejecutivo contundente. Necesitas convertir <strong className="text-[#bf953f]">La Ley 527 de 1999</strong> en tu principal aliada.
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="bg-[#111] p-8 md:p-10 rounded-xl border border-red-500/30 relative overflow-hidden group hover:border-red-500/50 transition-colors">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 blur-[50px] rounded-full"></div>
                            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                <AlertTriangle className="w-8 h-8 text-red-500" />
                                El Peligro de WhatsApp
                            </h3>
                            <ul className="space-y-4 text-gray-400">
                                <li className="flex gap-3"><XCircle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" /> <span className="text-left">Mensajes que la otra parte puede "Eliminar para todos" en cualquier momento.</span></li>
                                <li className="flex gap-3"><XCircle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" /> <span className="text-left">Cuentas ligadas a números prepago o SIMs desechables que pierden rastreabilidad.</span></li>
                                <li className="flex gap-3"><XCircle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" /> <span className="text-left">Requiere costosos peritajes técnicos forenses para ser admitido en juzgados.</span></li>
                                <li className="flex gap-3"><XCircle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" /> <span className="text-left">Los "emojis" (👍) no constituyen aceptación explícita de un contrato de corretaje.</span></li>
                            </ul>
                        </div>

                        <div className="bg-gradient-to-br from-[#1c1c1c] to-[#0a0a0a] p-8 md:p-10 rounded-xl border border-[#bf953f]/50 relative overflow-hidden shadow-[0_0_30px_rgba(212,175,55,0.1)] hover:shadow-[0_0_40px_rgba(212,175,55,0.2)] transition-shadow">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#bf953f]/20 blur-[50px] rounded-full"></div>
                            <h3 className="text-2xl font-bold text-[#fcf6ba] mb-6 flex items-center gap-3 font-serif">
                                <Shield className="w-8 h-8 text-[#bf953f]" />
                                Tu As Bajo la Manga: El Correo
                            </h3>
                            <ul className="space-y-4 text-gray-300">
                                <li className="flex gap-3"><CheckCircle className="w-5 h-5 text-[#10b981] mt-0.5 shrink-0" /> <span className="text-left"><strong className="text-white">Inalterable:</strong> Queda registrado en servidores globales (Google, Microsoft) de forma inmutable.</span></li>
                                <li className="flex gap-3"><CheckCircle className="w-5 h-5 text-[#10b981] mt-0.5 shrink-0" /> <span className="text-left"><strong className="text-white">Identidad Digital:</strong> Vinculado a credenciales únicas y direcciones IP rastreables.</span></li>
                                <li className="flex gap-3"><CheckCircle className="w-5 h-5 text-[#10b981] mt-0.5 shrink-0" /> <span className="text-left"><strong className="text-white">Presunción de Ley:</strong> (Ley 527) Tiene idéntica validez probatoria que un documento físico firmado.</span></li>
                                <li className="flex gap-3"><CheckCircle className="w-5 h-5 text-[#10b981] mt-0.5 shrink-0" /> <span className="text-left"><strong className="text-white">Mérito Ejecutivo:</strong> Facilita el embargo rápido de bienes si el propietario decide no pagarte.</span></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* EL CURSO SECTION */}
            <section id="curso" className="py-16 md:py-24 relative bg-[#0a0a0a] overflow-hidden">
                <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')] opacity-20 pointer-events-none"></div>
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="order-2 md:order-1 relative animate-fade-in flex justify-center">
                            <div className="absolute inset-0 bg-[#bf953f] blur-[120px] opacity-10 rounded-full"></div>
                            <div className="relative z-10 p-2 sm:p-4 bg-[#050505] border border-[#bf953f]/30 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                                <img
                                    src="/maestro_eddu_ai.png"
                                    alt="Maestro Eddu AI - Tutor del Curso"
                                    className="w-full max-w-sm md:max-w-md object-contain rounded-xl bg-black"
                                />
                                <div className="absolute -bottom-6 -right-2 sm:-right-6 bg-[#1c1c1c] border border-[#bf953f] p-3 sm:p-4 rounded-xl shadow-2xl z-20 animate-bounce" style={{ animationDuration: '3s' }}>
                                    <p className="text-[#fcf6ba] font-bold text-xs sm:text-sm flex items-center gap-2"><CheckCircle className="w-4 h-4" /> Se actualiza con la Ley</p>
                                </div>
                            </div>
                        </div>

                        <div className="order-1 md:order-2 text-left">
                            <h2 className="text-3xl md:text-5xl font-serif font-bold mb-6 text-white leading-tight">
                                Conoce a tu Tutor: <br />
                                <span className="text-[#d4af37]">El Maestro Eddu AI</span>
                            </h2>
                            <p className="text-lg text-gray-300 mb-8 font-light leading-relaxed">
                                Olvídate de los cursos grabados que quedan obsoletos en un mes. Este es el único <strong>Máster en Derecho Inmobiliario Digital</strong> vivo.
                            </p>
                            <div className="space-y-6 mb-10">
                                <div className="flex gap-4">
                                    <div className="mt-1 bg-black p-2 rounded-full border border-[#333] shrink-0 h-fit"><BookOpen className="w-5 h-5 text-[#bf953f]" /></div>
                                    <div>
                                        <h4 className="text-xl font-bold text-white mb-2 text-left">Casos Reales y Prácticos</h4>
                                        <p className="text-gray-400 text-sm text-left">Aprende paso a paso cómo blindar corretajes, alianzas de puntas compartidas y proteger tus clientes de forma inexpugnable.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="mt-1 bg-black p-2 rounded-full border border-[#333] shrink-0 h-fit"><Gavel className="w-5 h-5 text-[#bf953f]" /></div>
                                    <div>
                                        <h4 className="text-xl font-bold text-white mb-2 text-left">Evaluación Socrática</h4>
                                        <p className="text-gray-400 text-sm text-left">Eddu te hará preguntas, evaluará tus respuestas por voz o texto, y te preparará como si estuvieras en un juicio real.</p>
                                    </div>
                                </div>
                            </div>
                            <Link to="/academia" className="btn-gold-premium inline-block shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_35px_rgba(212,175,55,0.6)] !py-3 !px-8 text-base">
                                Iniciar el Máster Ahora
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* PLANES PREMIUM SECTION (UPSELL) */}
            <section id="planes" className="py-16 md:py-24 bg-[#050505] relative border-t border-[#222]">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <div className="mb-16">
                        <span className="text-[#bf953f] text-sm font-bold tracking-[0.2em] uppercase mb-4 block">Más allá del Curso</span>
                        <h2 className="text-3xl md:text-5xl font-serif text-white font-bold mb-6">
                            Eleva tu Operación con la <span className="bg-clip-text text-transparent" style={{ backgroundImage: theme.goldGradient }}>Suscripción Premium</span>
                        </h2>
                        <p className="text-gray-400 max-w-2xl mx-auto text-lg">Desbloquea dos herramientas de Inteligencia Artificial que trabajan para ti 24/7. El equipo legal que todo agente top necesita de bolsillo.</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
                        {/* ABOGADO IA */}
                        <div className="bg-[#111] border border-[#333] rounded-2xl p-6 sm:p-8 hover:border-[#bf953f]/50 transition-all duration-300 group shadow-lg overflow-hidden relative flex flex-col items-center">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-[#bf953f]/5 blur-[80px] rounded-full group-hover:bg-[#bf953f]/10 transition-colors"></div>
                            <div className="h-48 sm:h-64 mb-6 sm:mb-8 flex items-center justify-center w-full">
                                <img src="/Abogado-Eddu-AI.png" alt="El Abogado IA" className="h-full object-contain transform group-hover:scale-[1.03] transition-transform duration-500 drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-4">El Abogado IA</h3>
                            <p className="text-gray-400 mb-6 text-sm leading-relaxed max-w-xs mx-auto">Olvídate de pagar costosas consultas urgentes. Hazle consultas ilimitadas 24/7 sobre derecho inmobiliario y obtén respuestas precisas al instante.</p>
                            <Link to="/abogado-eddu-ai" className="block w-full max-w-[250px] mx-auto py-3 px-6 bg-black border border-[#bf953f] text-[#d4af37] font-bold uppercase tracking-widest rounded-sm hover:bg-[#bf953f] hover:text-black transition-colors text-xs sm:text-sm">
                                Probar Abogado IA
                            </Link>
                        </div>

                        {/* REDACTOR JURIDICO */}
                        <div className="bg-[#111] border border-[#333] rounded-2xl p-6 sm:p-8 hover:border-[#bf953f]/50 transition-all duration-300 group shadow-lg overflow-hidden relative flex flex-col items-center">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-[#bf953f]/5 blur-[80px] rounded-full group-hover:bg-[#bf953f]/10 transition-colors"></div>
                            <div className="h-48 sm:h-64 mb-6 sm:mb-8 flex items-center justify-center w-full">
                                <img src="/redactor_juridico.png" alt="El Redactor Jurídico" className="h-full object-contain transform group-hover:scale-[1.03] transition-transform duration-500 drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-4">El Redactor Universal</h3>
                            <p className="text-gray-400 mb-6 text-sm leading-relaxed max-w-xs mx-auto">Dile adiós a las plantillas genéricas. Cuéntale qué negocio vas a cerrar y redactará promesas, permutas, correos certificados y cobros en segundos.</p>
                            <Link to="/redactor-juridico" className="block w-full max-w-[250px] mx-auto py-3 px-6 bg-black border border-[#bf953f] text-[#d4af37] font-bold uppercase tracking-widest rounded-sm hover:bg-[#bf953f] hover:text-black transition-colors text-xs sm:text-sm">
                                Probar Redactor IA
                            </Link>
                        </div>
                    </div>

                    {/* FINAL CALL TO ACTION */}
                    <div className="mt-8 border border-[#bf953f] rounded-2xl p-8 sm:p-12 bg-gradient-to-br from-[#1c1c1c] to-[#0a0a0a] shadow-[0_0_40px_rgba(212,175,55,0.15)] relative overflow-hidden max-w-4xl mx-auto">
                        <div className="absolute left-0 top-0 w-full h-1 bg-gradient-to-r from-transparent via-[#bf953f] to-transparent"></div>
                        <h2 className="text-3xl font-serif text-white font-bold mb-4">¿Listo para unirte a la Élite Inmobiliaria?</h2>
                        <p className="text-gray-400 mb-8 max-w-xl mx-auto text-sm sm:text-base">Protege tus ingresos, automatiza tus procesos legales y nunca más pierdas un centavo por no usar correctamente el correo electrónico como prueba.</p>
                        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
                            <Link to="/academia" className="btn-gold-premium shadow-[0_0_20px_rgba(212,175,55,0.4)] w-full sm:w-auto text-center !py-4">Comprar el Curso</Link>
                            <button className="w-full sm:w-auto px-8 py-4 border-2 border-[#bf953f] text-[#fcf6ba] font-bold uppercase tracking-widest rounded-sm hover:bg-[#bf953f]/10 transition-colors shadow-lg text-sm">Suscribirse al Plan Premium</button>
                        </div>
                    </div>
                </div>
            </section>
        </PageTransition>
    );
};

export default HomePage;
