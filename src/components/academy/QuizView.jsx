import React, { useState, useEffect, useRef } from 'react';
import { Timer, ArrowRight, ArrowLeft, CheckCircle, XCircle, Trophy, RefreshCcw, ClipboardCheck } from 'lucide-react';
import { PageTransition } from '../Layout/Shared';
import { quizData } from './ModuleRegistry';
import CertificateView from './CertificateView';

const QuizView = ({ onBack }) => {
    const [currentStep, setCurrentStep] = useState('intro'); // 'intro' | 'active' | 'finished'
    const [timeLeft, setTimeLeft] = useState(quizData.timeLimit);
    const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
    const [answers, setAnswers] = useState({});
    const [score, setScore] = useState(0);
    const [showCertificate, setShowCertificate] = useState(false);
    const [userData, setUserData] = useState({ name: '', idNumber: '' });
    const timerRef = useRef(null);

    // Timer logic
    useEffect(() => {
        if (currentStep === 'active' && timeLeft > 0) {
            timerRef.current = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            handleFinish();
        }
        return () => clearInterval(timerRef.current);
    }, [currentStep, timeLeft]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleStart = () => {
        setCurrentStep('active');
    };

    const handleAnswer = (optionIdx) => {
        setAnswers({ ...answers, [currentQuestionIdx]: optionIdx });
    };

    const handleNext = () => {
        if (currentQuestionIdx < quizData.questions.length - 1) {
            setCurrentQuestionIdx(currentQuestionIdx + 1);
        } else {
            handleFinish();
        }
    };

    const handleFinish = () => {
        clearInterval(timerRef.current);
        let correctCount = 0;
        quizData.questions.forEach((q, idx) => {
            if (answers[idx] === q.correct) {
                correctCount++;
            }
        });
        const finalScore = (correctCount / quizData.questions.length) * 100;
        setScore(finalScore);
        setCurrentStep('finished');
    };

    if (showCertificate) {
        return <CertificateView userData={userData} score={score} onBack={() => setShowCertificate(false)} />;
    }

    if (currentStep === 'intro') {
        return (
            <PageTransition>
                <div className="max-w-4xl mx-auto px-6 py-20 text-center">
                    <Trophy className="w-20 h-20 text-[#bf953f] mx-auto mb-8 animate-bounce" />
                    <h1 className="text-4xl font-serif font-bold text-white mb-6">Examen de Certificación de Élite</h1>
                    <p className="text-gray-400 text-lg mb-12 max-w-2xl mx-auto">
                        Estás a punto de iniciar la evaluación final. Tienes <strong className="font-bold text-white">10 minutos</strong> para responder 10 preguntas críticas. Necesitas al menos un <strong className="font-bold text-white">80%</strong> para obtener tu diploma.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 text-left max-w-md mx-auto">
                        <div className="flex items-center gap-3 text-sm text-gray-300">
                            <Timer className="text-[#bf953f] w-5 h-5" /> 10 Minutos de tiempo límite
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-300">
                            <CheckCircle className="text-[#bf953f] w-5 h-5" /> Mínimo 8/10 para aprobar
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <button onClick={onBack} className="px-10 py-4 border border-[#333] text-gray-400 hover:text-white transition-colors uppercase tracking-widest text-xs">Aún no estoy listo</button>
                        <button onClick={handleStart} className="px-10 py-4 bg-gradient-to-r from-[#bf953f] to-[#aa771c] text-black font-bold uppercase tracking-widest text-xs shadow-lg">Iniciar Examen</button>
                    </div>
                </div>
            </PageTransition>
        );
    }

    if (currentStep === 'finished') {
        const passed = score >= quizData.passingScore;
        return (
            <PageTransition>
                <div className="max-w-2xl mx-auto px-6 py-20 text-center">
                    {passed ? (
                        <>
                            <div className="w-24 h-24 bg-green-500/10 border border-green-500/50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_30px_rgba(34,197,94,0.2)]">
                                <Trophy className="w-12 h-12 text-green-500" />
                            </div>
                            <h1 className="text-4xl font-serif font-bold text-white mb-4">¡Felicidades, Experto!</h1>
                            <p className="text-xl text-green-500 font-bold mb-8">Puntaje Final: {score}%</p>
                            <div className="bg-[#111] border border-[#333] p-8 rounded-sm mb-12 text-left">
                                <h3 className="text-white font-bold mb-6 flex items-center gap-2">
                                    <ClipboardCheck className="w-5 h-5 text-[#bf953f]" /> Datos para tu Diploma
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Nombre Completo</label>
                                        <input
                                            type="text"
                                            value={userData.name}
                                            onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                                            className="w-full bg-[#050505] border border-[#333] p-4 text-white focus:border-[#bf953f] outline-none transition-colors"
                                            placeholder="Ej: Eduardo Rivera"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Documento de Identidad (Opcional)</label>
                                        <input
                                            type="text"
                                            value={userData.idNumber}
                                            onChange={(e) => setUserData({ ...userData, idNumber: e.target.value })}
                                            className="w-full bg-[#050505] border border-[#333] p-4 text-white focus:border-[#bf953f] outline-none transition-colors"
                                            placeholder="CC / NIT"
                                        />
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => {
                                    console.log('Generating certificate for:', userData.name);
                                    setShowCertificate(true);
                                }}
                                disabled={!userData.name.trim()}
                                className={`w-full py-6 font-bold uppercase tracking-[0.3em] text-sm shadow-2xl transition-all rounded-sm ${userData.name.trim()
                                    ? 'bg-gradient-to-r from-[#bf953f] to-[#aa771c] text-black hover:scale-[1.02] active:scale-95'
                                    : 'bg-[#222] text-gray-600 cursor-not-allowed border border-[#333]'
                                    }`}
                            >
                                Descargar mi Diploma Oficial
                            </button>
                        </>
                    ) : (
                        <>
                            <div className="w-24 h-24 bg-red-500/10 border border-red-500/50 rounded-full flex items-center justify-center mx-auto mb-8">
                                <XCircle className="w-12 h-12 text-red-500" />
                            </div>
                            <h1 className="text-4xl font-serif font-bold text-white mb-4">Casi lo logras</h1>
                            <p className="text-xl text-red-500 font-bold mb-8">Puntaje Final: {score}%</p>
                            <p className="text-gray-400 mb-12">El estándar de VECY es alto. Te recomendamos repasar los módulos y volver a intentarlo cuando estés listo.</p>
                            <div className="flex flex-col sm:flex-row justify-center gap-4">
                                <button onClick={onBack} className="px-10 py-4 border border-[#333] text-gray-400 hover:text-white transition-colors uppercase tracking-widest text-xs">Volver a los Módulos</button>
                                <button onClick={() => window.location.reload()} className="px-10 py-4 bg-white text-black font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2">
                                    <RefreshCcw className="w-4 h-4" /> Reintentar Ahora
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </PageTransition>
        );
    }

    const question = quizData.questions[currentQuestionIdx];

    return (
        <PageTransition>
            <div className="max-w-4xl mx-auto px-6 py-12">
                {/* Header Stats */}
                <div className="flex justify-between items-center mb-12 bg-[#111] p-6 border border-[#333] rounded-sm sticky top-24 z-30 shadow-xl">
                    <div className="flex items-center gap-8">
                        <div>
                            <span className="text-[10px] text-gray-500 uppercase tracking-widest block mb-1">Pregunta</span>
                            <span className="text-xl font-serif text-white">{currentQuestionIdx + 1} / {quizData.questions.length}</span>
                        </div>
                        <div className="hidden sm:block">
                            <span className="text-[10px] text-gray-500 uppercase tracking-widest block mb-1">Progreso</span>
                            <div className="w-32 h-1 bg-[#222] rounded-full mt-2">
                                <div
                                    className="h-full bg-[#bf953f] transition-all duration-500"
                                    style={{ width: `${((currentQuestionIdx + 1) / quizData.questions.length) * 100}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                    <div className={`flex items-center gap-3 px-6 py-3 rounded-sm border ${timeLeft < 60 ? 'bg-red-500/10 border-red-500/50 text-red-500' : 'bg-[#050505] border-[#bf953f]/30 text-[#bf953f]'}`}>
                        <Timer className="w-5 h-5 animate-pulse" />
                        <span className="text-2xl font-mono font-bold">{formatTime(timeLeft)}</span>
                    </div>
                </div>

                {/* Question Area */}
                <div className="min-h-[450px] flex flex-col items-center">
                    <h2 className="text-2xl md:text-4xl font-serif font-bold text-white mb-12 leading-tight text-center max-w-3xl">
                        {question.question}
                    </h2>
                    <div className="space-y-4 w-full max-w-2xl">
                        {question.options.map((option, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleAnswer(idx)}
                                className={`w-full p-6 text-left border transition-all duration-300 flex items-center justify-between group rounded-sm ${answers[currentQuestionIdx] === idx
                                    ? 'bg-[#bf953f]/10 border-[#bf953f] text-white shadow-[0_0_20px_rgba(191,149,63,0.1)]'
                                    : 'bg-[#0e0e0e] border-[#333] text-gray-400 hover:border-[#bf953f]/50 hover:bg-[#161616]'
                                    }`}
                            >
                                <span className="text-lg font-light">{option}</span>
                                <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-colors shrink-0 ml-4 ${answers[currentQuestionIdx] === idx
                                    ? 'bg-[#bf953f] border-[#bf953f]'
                                    : 'bg-transparent border-[#444] group-hover:border-[#bf953f]/50'
                                    }`}>
                                    {answers[currentQuestionIdx] === idx && <CheckCircle className="w-4 h-4 text-black" />}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Navigation */}
                <div className="mt-16 flex flex-col sm:flex-row justify-between items-center gap-6 border-t border-[#333] pt-12">
                    <button
                        onClick={() => setCurrentQuestionIdx(prev => Math.max(0, prev - 1))}
                        disabled={currentQuestionIdx === 0}
                        className="w-full sm:w-auto px-8 py-4 border border-[#333] text-gray-400 hover:text-white hover:border-gray-500 disabled:opacity-0 transition-all font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 rounded-sm"
                    >
                        <ArrowLeft className="w-4 h-4" /> Anterior
                    </button>

                    <button
                        onClick={handleNext}
                        disabled={answers[currentQuestionIdx] === undefined}
                        className={`w-full sm:w-auto px-12 py-5 font-bold uppercase tracking-[0.2em] text-sm flex items-center justify-center gap-3 transition-all rounded-sm shadow-xl ${answers[currentQuestionIdx] !== undefined
                            ? 'bg-[#bf953f] text-black hover:scale-105 active:scale-95'
                            : 'bg-[#222] text-gray-600 cursor-not-allowed border border-[#333]'
                            }`}
                    >
                        {currentQuestionIdx < quizData.questions.length - 1 ? (
                            <>Siguiente Pregunta <ArrowRight className="w-4 h-4" /></>
                        ) : (
                            'Finalizar Examen'
                        )}
                    </button>
                </div>
            </div>
        </PageTransition>
    );
};

export default QuizView;
