import React, { useLayoutEffect } from 'react';
import { ArrowLeft, ChevronRight, BookOpen, CheckCircle, HelpCircle } from 'lucide-react';
import { PageTransition, FormatText } from '../Layout/Shared';

const ModuleDetailView = ({ module, onBack, onNext, onPrevious }) => {
    // Scroll to top when module changes
    useLayoutEffect(() => {
        window.scrollTo(0, 0);
    }, [module.id]);

    if (!module) return null;

    return (
        <PageTransition>
            <div className="max-w-4xl mx-auto px-6 py-12">
                <button
                    onClick={onBack}
                    className="flex items-center text-[#d4af37] mb-12 hover:text-white transition-colors group px-4 py-2 bg-[#111] rounded-full border border-[#333]"
                >
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Volver al Panel de Academia
                </button>

                <div className="mb-16">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-4 rounded-xl bg-gradient-to-br from-[#bf953f] to-[#aa771c] shadow-[0_0_30px_rgba(191,149,63,0.3)]">
                            <module.icon className="w-10 h-10 text-black" />
                        </div>
                        <div>
                            <span className="text-xs font-bold text-[#d4af37] tracking-[0.3em] uppercase opacity-70">Capítulo Maestro</span>
                            <h1 className="text-3xl md:text-5xl font-serif font-bold text-white mt-1">{module.title}</h1>
                        </div>
                    </div>
                    <p className="text-xl text-gray-400 font-light leading-relaxed border-l-2 border-[#333] pl-6 italic">
                        {module.description}
                    </p>
                </div>

                <div className="space-y-24">
                    {module.lessons.map((lesson, idx) => (
                        <section key={lesson.id} className="relative">
                            <div className="absolute -left-12 top-2 hidden md:flex items-center justify-center w-8 h-8 rounded-full bg-[#111] border border-[#333] text-[#bf953f] text-xs font-bold font-serif">
                                {idx + 1}
                            </div>
                            <h2 className="text-2xl md:text-3xl font-serif font-bold text-white mb-8 flex items-center gap-3">
                                {lesson.title}
                            </h2>
                            <div className="prose prose-invert max-w-none text-gray-300 leading-9 text-lg font-light text-justify">
                                <FormatText text={lesson.content} />
                            </div>

                            {/* Visual Aid / Action Callout */}
                            <div className="mt-12 p-8 bg-gradient-to-br from-[#161616] to-[#0a0a0a] border border-[#333] rounded-sm relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-8 opacity-5">
                                    <HelpCircle className="w-32 h-32 text-white" />
                                </div>
                                <div className="relative z-10">
                                    <h4 className="text-[#bf953f] font-bold text-sm uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4" /> Conclusión de Aprendizaje
                                    </h4>
                                    <p className="text-sm text-gray-400 italic">
                                        Domina este concepto para asegurar que tu gestión inmobiliaria sea 100% blindada. Si tienes dudas, consulta a Eddu-AI en tiempo real.
                                    </p>
                                </div>
                            </div>
                        </section>
                    ))}
                </div>

                {/* BOTTOM NAVIGATION */}
                <div className="mt-24 pt-12 border-t border-[#222] flex flex-col md:flex-row justify-between gap-8">
                    {onPrevious ? (
                        <button
                            onClick={onPrevious}
                            className="flex flex-col items-start group"
                        >
                            <span className="text-xs text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-1 group-hover:text-[#bf953f] transition-colors">
                                <ArrowLeft className="w-3 h-3" /> Módulo Anterior
                            </span>
                            <span className="text-lg font-serif text-white group-hover:underline">Descubre el capítulo previo</span>
                        </button>
                    ) : <div />}

                    {onNext ? (
                        <button
                            onClick={onNext}
                            className="flex flex-col items-end group text-right"
                        >
                            <span className="text-xs text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-1 group-hover:text-[#bf953f] transition-colors">
                                Siguiente Módulo <ChevronRight className="w-3 h-3" />
                            </span>
                            <span className="text-lg font-serif text-white group-hover:underline">Continuar hacia la maestría</span>
                        </button>
                    ) : (
                        <button
                            onClick={onBack}
                            className="px-10 py-5 bg-gradient-to-r from-[#bf953f] to-[#aa771c] text-black font-bold uppercase tracking-[0.2em] text-xs h-fit hover:scale-105 transition-transform shadow-[0_0_20px_rgba(191,149,63,0.3)]"
                        >
                            Finalizar y Volver al Panel
                        </button>
                    )}
                </div>
            </div>
        </PageTransition>
    );
};

export default ModuleDetailView;
