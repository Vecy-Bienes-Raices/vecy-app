import React, { useEffect } from 'react';
import { ArrowLeft, ChevronRight, BookOpen, CheckCircle, HelpCircle } from 'lucide-react';
import { PageTransition, FormatText } from '../Layout/Shared';

const ModuleDetailView = ({ module, onBack, onNext, onPrevious }) => {
    useEffect(() => {
        const forceScrollTop = () => {
            window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
            document.documentElement.scrollTop = 0;
            document.body.scrollTop = 0;
        };

        // Ejecutar inmediatamente y luego con retraso para asegurar que los componentes (App.jsx, Nav) hayan cargado
        forceScrollTop();
        const t1 = setTimeout(forceScrollTop, 50);
        const t2 = setTimeout(forceScrollTop, 250);

        return () => { clearTimeout(t1); clearTimeout(t2); };
    }, [module.id]);

    if (!module) return null;

    return (
        <PageTransition>
            <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-8 md:py-12 pt-28 lg:pt-32">
                <div className="flex flex-col relative w-full items-center">
                    {/* Main Reading Pane: Centered */}
                    <div className="w-full max-w-4xl flex flex-col pb-12">
                        <button
                            onClick={onBack}
                            className="flex items-center text-[#bf953f] hover:text-[#d4af37] w-fit mb-8 transition-colors group px-5 py-2.5 bg-[#111] rounded-full border border-[#333] hover:border-[#bf953f]/50 shadow-md text-sm font-medium tracking-wide"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                            Volver al Panel de Academia
                        </button>

                        <div className="mb-12">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-4 rounded-xl bg-gradient-to-br from-[#1a1c1e] to-[#0d0f10] border border-[#bf953f]/30 shadow-[0_0_20px_rgba(191,149,63,0.15)] flex-shrink-0">
                                    <module.icon className="w-8 h-8 text-[#d4af37]" />
                                </div>
                                <div>
                                    <span className="text-[10px] font-bold text-[#bf953f] tracking-[0.3em] uppercase opacity-80 block mb-1">Capítulo Maestro</span>
                                    <h1 className="text-3xl md:text-5xl font-serif font-bold text-white leading-tight">{module.title}</h1>
                                </div>
                            </div>
                            <p className="text-lg md:text-xl text-gray-400 font-light leading-relaxed border-l-2 border-[#bf953f]/50 pl-5 italic">
                                {module.description}
                            </p>
                        </div>

                        <div className="space-y-20 pl-4 lg:pl-12">
                            {module.lessons.map((lesson, idx) => (
                                <section key={lesson.id} className="relative group/lesson">
                                    {/* Number now stays within bounds because of the added left padding on the parent */}
                                    <div className="absolute -left-12 lg:-left-12 top-1.5 flex items-center justify-center w-8 h-8 rounded-sm bg-[#111] border border-[#333] text-[#bf953f] text-xs font-bold font-serif shadow-sm">
                                        {idx + 1}
                                    </div>
                                    <h2 className="text-2xl md:text-3xl font-serif font-bold text-white mb-6 flex items-center gap-3">
                                        {lesson.title}
                                    </h2>
                                    <div className="prose prose-invert max-w-none text-gray-300 leading-9 text-lg font-light md:text-justify text-left">
                                        <FormatText text={lesson.content} />
                                    </div>

                                    <div className="mt-10 p-6 bg-gradient-to-br from-[#111] to-[#0a0a0a] border border-[#333] group-hover/lesson:border-[#bf953f]/20 transition-colors rounded-sm relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-6 opacity-[0.03]">
                                            <HelpCircle className="w-24 h-24 text-white" />
                                        </div>
                                        <div className="relative z-10">
                                            <h4 className="text-[#bf953f] font-bold text-xs uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                                                <CheckCircle className="w-4 h-4" /> Conclusión de Aprendizaje
                                            </h4>
                                            <p className="text-sm text-gray-400 italic font-light leading-relaxed">
                                                Si tienes alguna duda sobre este concepto fundamental, ¡pregúntale directamente a tu Maestro Eddu en el chat interactivo!
                                            </p>
                                        </div>
                                    </div>
                                </section>
                            ))}
                        </div>

                        {/* BOTTOM NAVIGATION */}
                        <div className="mt-16 pt-10 border-t border-[#222] flex flex-col md:flex-row justify-between gap-6">
                            {onPrevious ? (
                                <button
                                    onClick={onPrevious}
                                    className="flex flex-col items-center md:items-start group p-4 border border-transparent hover:border-[#333] rounded-lg transition-all"
                                >
                                    <span className="text-[10px] text-gray-500 uppercase tracking-widest mb-1.5 flex items-center gap-1 group-hover:text-[#bf953f] transition-colors">
                                        <ArrowLeft className="w-3 h-3" /> Módulo Anterior
                                    </span>
                                    <span className="text-base font-serif text-white group-hover:underline">Descubre el capítulo previo</span>
                                </button>
                            ) : <div />}

                            {onNext ? (
                                <button
                                    onClick={onNext}
                                    className="flex flex-col items-center md:items-end group p-4 border border-transparent hover:border-[#333] rounded-lg transition-all text-center md:text-right bg-[#0e0e0e] hover:bg-[#111]"
                                >
                                    <span className="text-[10px] text-[#bf953f] uppercase tracking-widest mb-1.5 flex items-center justify-center md:justify-end gap-1">
                                        Siguiente Módulo <ChevronRight className="w-3 h-3" />
                                    </span>
                                    <span className="text-base font-serif text-white font-bold group-hover:underline">Continuar la maestría</span>
                                </button>
                            ) : (
                                <button
                                    onClick={onBack}
                                    className="btn-gold-premium shadow-lg shadow-[#d4af37]/10"
                                >
                                    Finalizar y Volver al Panel
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </PageTransition>
    );
};

export default ModuleDetailView;
