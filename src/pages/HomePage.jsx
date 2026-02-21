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
            <section className="relative min-h-screen flex items-center justify-center pt-20">
                <div className="absolute inset-0 z-0 opacity-15"><div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div></div>
                <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
                    <div className="inline-flex items-center gap-2 mb-8 px-6 py-2 rounded-full border border-[#333] bg-[#1c1c1c]/80 backdrop-blur-md">
                        <Award className="w-4 h-4 text-[#bf953f]" />
                        <span className="text-gray-300 text-xs font-bold tracking-[0.2em] uppercase">Máster en Derecho Inmobiliario Digital</span>
                    </div>
                    <h1 className="text-3xl md:text-6xl font-serif font-bold mb-8 leading-tight text-white drop-shadow-lg">El Correo Electrónico: <br /><span className="bg-clip-text text-transparent" style={{ backgroundImage: theme.goldGradient }}>Tu Seguro de Vida Inmobiliario</span></h1>
                    <p className="text-lg md:text-xl text-gray-400 mb-12 max-w-3xl mx-auto font-light leading-relaxed border-l-2 border-[#333] pl-6 text-left md:text-center md:border-l-0 md:border-t-0">En el mundo jurídico, lo que no está escrito no existe. <br className="hidden md:block" />Descubre por qué <span className="text-white font-semibold">WhatsApp es un riesgo procesal</span> y el <span className="text-white font-semibold">Correo es tu salvaguarda patrimonial</span>.</p>
                    <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
                        <Link to="/academia" className="relative px-8 py-4 text-sm font-bold text-black uppercase tracking-widest rounded-sm transition-all duration-300 hover:scale-105 shadow-[0_0_25px_rgba(191,149,63,0.4)]" style={{ backgroundImage: theme.goldGradient }}>Iniciar Curso</Link>
                        <a href="#estrategia" className="text-[#d4af37] hover:text-white flex items-center gap-2 text-sm font-semibold tracking-widest transition-colors uppercase border-b border-[#333] pb-1 hover:border-white">Ver Estrategia VECY <ChevronDown className="w-4 h-4" /></a>
                    </div>
                </div>
            </section>

            {/* TABLE COMPARISON SECTION */}
            <section id="mito" className="py-12 md:py-24 relative bg-[#050505]">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-serif font-bold mb-4">
                            <span className="text-[#d4af37]">Análisis Forense Digital:</span>{' '}
                            <span className="text-white">WhatsApp vs Email</span>
                        </h2>
                        <p className="text-gray-500 max-w-3xl mx-auto font-light">Comparativa técnica basada en los criterios de admisibilidad judicial de la Ley 527.</p>
                    </div>

                    <div className="overflow-x-auto">
                        {/* Desktop View Table */}
                        <div className="hidden md:block min-w-[800px] bg-[#111] rounded-sm border border-[#333] shadow-2xl">
                            <div className="grid grid-cols-3 divide-x divide-[#2d2d2d] bg-[#1c1c1c] border-b border-[#333] text-sm font-bold tracking-widest uppercase">
                                <div className="text-gray-500 flex items-center gap-2 p-6"><Scale className="w-4 h-4" /> Variable Jurídica</div>
                                <div className="text-red-500 flex items-center gap-2 p-6"><AlertTriangle className="w-4 h-4" /> WhatsApp / Chats</div>
                                <div className="text-[#bf953f] flex items-center gap-2 p-6"><Shield className="w-4 h-4" /> Correo Certificado</div>
                            </div>
                            {[
                                { title: "Integridad (Art. 9)", chat: "Modificable por ambas partes. Se puede 'Eliminar para todos'.", email: "Inalterable. El contenido en servidor es definitivo." },
                                { title: "Identidad (Art. 7)", chat: "Vinculado a un número (SIM Card) que puede ser clonado o reciclado.", email: "Vinculado a credenciales únicas y metadatos de IP." },
                                { title: "Costo Probatorio", chat: "Alto. Requiere peritaje forense para certificar no alteración ($$$).", email: "Bajo o Nulo. Goza de presunción de autenticidad automática." },
                                { title: "Disponibilidad (Art. 12)", chat: "Baja. Si pierdes el celular o no tienes backup, pierdes la prueba.", email: "Alta. Almacenamiento en nube redundante e independiente del dispositivo." },
                                { title: "Conducta Concluyente", chat: "Ambigua. Un 'Emoji' o silencio puede malinterpretarse.", email: "Clara. La trazabilidad de apertura y respuesta es inequívoca." },
                            ].map((row, idx) => (
                                <div key={idx} className={`grid grid-cols-3 divide-x divide-[#2d2d2d] border-b-2 border-[#222] text-sm hover:bg-[#161616] transition-colors`}>
                                    <div className="font-bold text-gray-300 p-8 py-7 pr-4">{row.title}</div>
                                    <div className="text-gray-500 flex items-start gap-3 p-8 py-7 pr-4"><XCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" /> {row.chat}</div>
                                    <div className="text-white flex items-start gap-3 p-8 py-7"><Check className="w-5 h-5 text-[#10b981] mt-0.5 flex-shrink-0" /> {row.email}</div>
                                </div>
                            ))}
                        </div>

                        {/* Mobile View Cards */}
                        <div className="md:hidden space-y-6">
                            {[
                                { title: "Integridad (Art. 9)", chat: "Modificable por ambas partes.", email: "Inalterable y definitivo." },
                                { title: "Identidad (Art. 7)", chat: "Vinculado a SIM clonable.", email: "Credenciales únicas e IP." },
                                { title: "Costo Probatorio", chat: "Alto. Requiere peritaje ($$$).", email: "Bajo. Presunción automática." },
                                { title: "Disponibilidad", chat: "Baja. Riesgo de pérdida.", email: "Alta. Nube redundante." },
                            ].map((row, idx) => (
                                <div key={idx} className="bg-[#111] border border-[#333] rounded-sm p-6">
                                    <h4 className="text-[#bf953f] font-serif font-bold text-lg mb-4 border-b border-[#222] pb-2">{row.title}</h4>
                                    <div className="space-y-4">
                                        <div className="flex items-start gap-3">
                                            <XCircle className="w-5 h-5 text-red-600 shrink-0 mt-1" />
                                            <div>
                                                <span className="text-[10px] uppercase tracking-widest text-red-500/50 block font-bold">WhatsApp</span>
                                                <p className="text-gray-400 text-sm">{row.chat}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <CheckCircle className="w-5 h-5 text-[#10b981] shrink-0 mt-1" />
                                            <div>
                                                <span className="text-[10px] uppercase tracking-widest text-[#10b981]/50 block font-bold">Email VECY</span>
                                                <p className="text-white text-sm">{row.email}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* LEY SECTION */}
            <section id="ley" className="py-12 md:py-24 relative bg-[#0a0a0a]">
                <div className="relative z-10 max-w-5xl mx-auto px-6">
                    <div className="border-l-4 border-[#bf953f] pl-8 py-2 mb-12"><h2 className="text-4xl font-serif text-white font-bold text-left">Fundamento Legal: Ley 527 de 1999</h2><p className="text-[#d4af37] text-lg font-light mt-2 text-left">El pilar del Comercio Electrónico en Colombia</p></div>
                    <div className="bg-[#1c1c1c] backdrop-blur-sm border border-[#333] rounded-sm p-10 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                        <div className="flex items-start gap-8">
                            <Scale className="w-16 h-16 text-[#d4af37] flex-shrink-0" />
                            <div>
                                <h3 className="text-2xl font-bold text-[#fcf6ba] mb-4 text-left">¿Por qué esta ley es tu mejor defensa?</h3>
                                <p className="text-gray-400 mb-8 text-base border-b border-[#333] pb-8 text-left leading-relaxed">Antes de 1999, solo el papel firmado valía. La Ley 527 cambió la historia.</p>
                                <div className="grid md:grid-cols-2 gap-10">
                                    <div><h4 className="text-[#d4af37] font-bold mb-4 flex items-center gap-2 text-left"><BookOpen className="w-5 h-5" /> Artículos Clave</h4><ul className="space-y-4 text-sm text-gray-400 text-left"><li className="flex gap-3"><span className="text-[#d4af37] font-bold text-lg">•</span><span><strong>Art. 5:</strong> Reconocimiento Jurídico pleno.</span></li><li className="flex gap-3"><span className="text-[#d4af37] font-bold text-lg">•</span><span><strong>Art. 10:</strong> Admisibilidad probatoria garantizada.</span></li></ul></div>
                                    <div className="bg-black p-8 rounded border border-[#333]"><h4 className="text-white font-bold mb-4 text-left">Dictamen VECY</h4><p className="text-sm text-gray-400 leading-relaxed text-left mb-4">El correo cumple con los requisitos de <strong>escrito</strong>.</p></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ESTRATEGIA SECTION */}
            <section id="estrategia" className="py-12 md:py-24 bg-[#050505] relative">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-16 border-b border-[#333] pb-8"><div><h2 className="text-3xl md:text-4xl font-serif text-white font-bold mb-2 text-left">Protocolo de Blindaje VECY</h2><p className="text-[#d4af37] text-left">Metodología exclusiva VECY BIENES RAÍCES</p></div><div className="mt-4 md:mt-0"><span className="px-4 py-2 border border-[#10b981] bg-[#10b981]/10 text-[#10b981] text-xs font-bold uppercase tracking-widest rounded-sm">Sistema Aprobado</span></div></div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[{ step: "01", title: "Omnicanalidad Formal", desc: "WhatsApp para logística, Correo para el negocio.", icon: <Smartphone className="w-6 h-6 text-[#d4af37]" /> }, { step: "02", title: "Cláusula Digital", desc: "Nota legal que valida el acuerdo sin firma física.", icon: <FileText className="w-6 h-6 text-[#d4af37]" /> }, { step: "03", title: "Evidencia Certificada", desc: "Uso de 4-72 para notificaciones críticas.", icon: <CheckCircle className="w-6 h-6 text-[#d4af37]" /> }].map((item, idx) => (
                            <div key={idx} className="bg-[#1c1c1c] p-8 border-t-2 border-[#bf953f] hover:bg-[#262626] transition-colors shadow-lg group">
                                <div className="flex justify-between items-start mb-6"><span className="text-4xl font-serif font-bold text-[#222] group-hover:text-[#bf953f] transition-colors duration-500">{item.step}</span><div className="p-3 bg-black rounded-full border border-[#333]">{item.icon}</div></div>
                                <h3 className="text-xl font-bold text-[#fcf6ba] mb-4 text-left">{item.title}</h3><p className="text-sm text-gray-400 leading-relaxed text-left">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* HERRAMIENTAS SECTION */}
            <section id="herramientas" className="py-12 md:py-24 bg-[#0a0a0a]">
                <div className="max-w-5xl mx-auto px-6 text-center">
                    <h2 className="text-3xl font-serif text-white font-bold mb-12">Herramientas del Agente 4.0</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-[#1c1c1c] p-8 rounded-sm border border-[#d4af37] flex flex-col items-center hover:scale-[1.02] transition-transform shadow-[0_0_20px_rgba(191,149,63,0.1)] cursor-pointer group">
                            <Link to="/generador" className="w-full flex flex-col items-center">
                                <div className="relative"><div className="absolute -inset-1 bg-gradient-to-r from-[#bf953f] to-[#aa771c] rounded-full blur opacity-50 group-hover:opacity-100 transition duration-500"></div><div className="relative bg-black rounded-full p-3"><Gavel className="w-10 h-10 text-[#d4af37]" /></div></div>
                                <h3 className="text-xl font-bold text-white mt-6 mb-2">Redactor Jurídico IA</h3><p className="text-sm text-gray-400 mb-6 max-w-sm text-center">Genera reclamaciones, acuerdos de puntas y contratos vía email.</p><button className="px-6 py-2 rounded-sm text-black font-bold text-xs uppercase tracking-widest bg-gradient-to-r from-[#bf953f] to-[#aa771c] hover:shadow-lg">Usar Ahora ✨</button>
                            </Link>
                        </div>
                        <div className="bg-[#1c1c1c] p-8 rounded-sm border border-[#333] flex flex-col items-center hover:border-gray-500 transition-colors">
                            <Mail className="w-12 h-12 text-[#10b981] mb-6" /><h3 className="text-xl font-bold text-white mb-2">MailSuite</h3><p className="text-sm text-gray-400 mb-6 max-w-sm text-center">Rastreo de apertura de correos.</p><Link to="/soporte" className="text-[#d4af37] text-xs font-bold uppercase hover:underline">Pregúntale a Eddu</Link>
                        </div>
                        <div className="bg-[#1c1c1c] p-8 rounded-sm border border-[#333] flex flex-col items-center hover:border-gray-500 transition-colors">
                            <FileCheck className="w-12 h-12 text-[#10b981] mb-6" /><h3 className="text-xl font-bold text-white mb-2">4-72 Certificado</h3><p className="text-sm text-gray-400 mb-6 max-w-sm text-center">Prueba de entrega oficial.</p><Link to="/soporte" className="text-[#d4af37] text-xs font-bold uppercase hover:underline">Pregúntale a Eddu</Link>
                        </div>
                    </div>
                </div>
            </section>
        </PageTransition>
    );
};

export default HomePage;
