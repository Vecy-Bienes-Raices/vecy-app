import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, GraduationCap, ChevronRight, Trophy, ClipboardCheck, CheckCircle, ArrowLeft, ArrowRight } from 'lucide-react';
import { PageTransition } from '../Layout/Shared';
import { academyModules } from './ModuleRegistry';
import ModuleDetailView from './ModuleDetailView';
import QuizView from './QuizView';

const CourseView = () => {
    const navigate = useNavigate();
    const [activeModuleId, setActiveModuleId] = useState(null);
    const [showQuiz, setShowQuiz] = useState(false);
    const [hasCompletedModules, setHasCompletedModules] = useState(false);

    const activeModule = academyModules.find(m => m.id === activeModuleId);

    const handleNext = () => {
        const idx = academyModules.findIndex(m => m.id === activeModuleId);
        if (idx !== -1 && idx < academyModules.length - 1) {
            setActiveModuleId(academyModules[idx + 1].id);
        } else {
            setActiveModuleId(null);
            setHasCompletedModules(true);
        }
    };

    const handlePrevious = () => {
        const idx = academyModules.findIndex(m => m.id === activeModuleId);
        if (idx > 0) {
            setActiveModuleId(academyModules[idx - 1].id);
        }
    };

    if (showQuiz) {
        return <QuizView onBack={() => setShowQuiz(false)} />;
    }

    if (activeModuleId && activeModule) {
        return (
            <ModuleDetailView
                module={activeModule}
                onBack={() => setActiveModuleId(null)}
                onNext={handleNext}
                onPrevious={activeModuleId !== academyModules[0].id ? handlePrevious : null}
            />
        );
    }

    return (
        <PageTransition>
            <div className="max-w-6xl mx-auto px-6 py-12 md:py-20">
                <div className="flex flex-col items-center text-center mb-16 md:mb-24">
                    <div className="w-20 h-20 rounded-full bg-[#111] border border-[#d4af37]/30 flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(212,175,55,0.15)]">
                        <GraduationCap className="w-10 h-10 text-[#d4af37]" />
                    </div>
                    <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6">Academia Jurídica VECY</h1>
                    <p className="text-lg md:text-xl text-gray-400 max-w-2xl font-light font-serif text-center px-4">
                        Formación de élite para Agentes Inmobiliarios. Domina el <strong className="font-bold text-white">Blindaje Probatorio Digital</strong> y asegura tus comisiones con la Ley 527.
                    </p>
                </div>

                {!hasCompletedModules ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {academyModules.map((module, index) => (
                            <button
                                key={module.id}
                                onClick={() => setActiveModuleId(module.id)}
                                className="group relative bg-[#0e0e0e] border border-[#333] hover:border-[#bf953f]/50 rounded-sm p-8 text-left transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.5),0_0_20px_rgba(191,149,63,0.1)] overflow-hidden"
                            >
                                {/* Number Accent */}
                                <div className="absolute -top-4 -right-4 text-9xl font-serif font-bold text-white/[0.03] group-hover:text-[#bf953f]/[0.05] transition-colors leading-none pointer-events-none">
                                    {index + 1}
                                </div>

                                <div className="relative z-10">
                                    <div className="mb-8 p-4 w-fit rounded-xl bg-gradient-to-br from-[#1c1c1c] to-[#0a0a0a] border border-[#333] group-hover:border-[#bf953f]/30 group-hover:shadow-[0_0_15px_rgba(191,149,63,0.2)] transition-all">
                                        <module.icon className="w-8 h-8 text-[#bf953f]" />
                                    </div>

                                    <span className="text-[10px] text-[#bf953f] font-bold uppercase tracking-[0.3em] mb-4 block opacity-70 group-hover:opacity-100 transition-opacity">
                                        {module.shortTitle}
                                    </span>

                                    <h3 className="text-2xl font-serif font-bold text-white mb-4 leading-tight group-hover:text-[#d4af37] transition-colors">
                                        {module.title}
                                    </h3>

                                    <p className="text-sm text-gray-500 leading-relaxed mb-10 line-clamp-3">
                                        {module.description}
                                    </p>

                                    <div className="flex items-center gap-2 text-[#bf953f] font-bold text-xs uppercase tracking-widest group-hover:gap-4 transition-all">
                                        Comenzar Lectura <ChevronRight className="w-4 h-4" />
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                ) : (
                    <div className="bg-[#111] border border-[#333] p-12 rounded-sm text-center mb-16 shadow-2xl animate-fade-in">
                        <div className="inline-block p-4 rounded-full bg-green-500/10 border border-green-500/30 mb-6">
                            <Trophy className="w-10 h-10 text-green-500" />
                        </div>
                        <h2 className="text-3xl font-serif font-bold text-white mb-4">¡Módulos Completados con Éxito!</h2>
                        <p className="text-gray-400 max-w-xl mx-auto font-light leading-relaxed">
                            Has finalizado la etapa teórica de la Academia VECY. Ahora estás facultado para presentar el examen de certificación y obtener tu diploma oficial.
                        </p>
                    </div>
                )}

                {/* EXAM SECTION - Only visible after completing modules */}
                {hasCompletedModules && (
                    <PageTransition>
                        <div className="mt-32 p-10 md:p-16 bg-gradient-to-br from-[#111] via-[#0a0a0a] to-[#000] border border-[#d4af37]/30 rounded-sm relative overflow-hidden text-center md:text-left shadow-[0_0_50px_rgba(212,175,55,0.1)]">
                            <div className="absolute top-0 right-0 p-12 opacity-[0.05]">
                                <Trophy className="w-64 h-64 text-[#d4af37]" />
                            </div>
                            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                                <div>
                                    <div className="flex items-center gap-3 mb-4 justify-center md:justify-start">
                                        <ClipboardCheck className="text-[#bf953f] w-6 h-6" />
                                        <span className="text-[#bf953f] font-bold uppercase tracking-[0.3em] text-xs">Examen de Certificación</span>
                                    </div>
                                    <h2 className="text-3xl font-serif font-bold text-white mb-6">¿Preparado para tu Certificación VECY?</h2>
                                    <p className="text-gray-400 font-light leading-relaxed mb-0">
                                        Has completado todos los módulos. Ahora puedes evaluar tus conocimientos. Si obtienes más del 80%, recibirás tu <strong className="font-bold text-white">Diploma de Experto en Blindaje Jurídico Digital</strong>.
                                    </p>
                                </div>
                                <div className="flex flex-col sm:flex-row justify-center md:justify-end gap-4">
                                    <button
                                        onClick={() => navigate('/')}
                                        className="px-8 py-4 border border-[#333] text-gray-400 hover:text-white hover:border-gray-500 transition-all font-bold uppercase tracking-[0.2em] text-xs rounded-sm"
                                    >
                                        Volver al Inicio
                                    </button>
                                    <button
                                        onClick={() => setShowQuiz(true)}
                                        className="px-8 py-4 bg-gradient-to-r from-[#bf953f] to-[#aa771c] text-black font-bold uppercase tracking-[0.2em] text-xs rounded-sm shadow-[0_0_20px_rgba(191,149,63,0.3)] hover:scale-105 transition-transform"
                                    >
                                        Iniciar Examen Ahora
                                    </button>
                                </div>
                            </div>
                        </div>
                    </PageTransition>
                )}
            </div>
        </PageTransition>
    );
};

export default CourseView;
