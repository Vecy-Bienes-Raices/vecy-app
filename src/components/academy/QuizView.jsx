import React, { useState, useEffect, useRef } from 'react';
import { Timer, ArrowRight, ArrowLeft, CheckCircle, XCircle, Trophy, RefreshCcw, ClipboardCheck, Award } from 'lucide-react';
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
    const [showFeedback, setShowFeedback] = useState(false);
    const [cooldownRemaining, setCooldownRemaining] = useState(0);
    const timerRef = useRef(null);

    // Cooldown check on mount
    useEffect(() => {
        const checkCooldown = () => {
            const lastAttempt = localStorage.getItem('vecy_quiz_last_fail');
            if (lastAttempt) {
                const now = Date.now();
                const oneHour = 60 * 60 * 1000;
                const elapsed = now - parseInt(lastAttempt);
                if (elapsed < oneHour) {
                    setCooldownRemaining(Math.ceil((oneHour - elapsed) / 1000));
                } else {
                    localStorage.removeItem('vecy_quiz_last_fail');
                    setCooldownRemaining(0);
                }
            }
        };
        checkCooldown();
        const interval = setInterval(checkCooldown, 1000);
        return () => clearInterval(interval);
    }, []);

    // Timer logic
    useEffect(() => {
        if (currentStep === 'active' && timeLeft > 0) {
            timerRef.current = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (timeLeft === 0 && currentStep === 'active') {
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
        if (cooldownRemaining > 0) return;
        setCurrentStep('active');
        setShowFeedback(false);
    };

    const handleAnswer = (optionIdx) => {
        if (showFeedback) return;
        setAnswers({ ...answers, [currentQuestionIdx]: optionIdx });
        setShowFeedback(true);
    };

    const handleNext = () => {
        if (currentQuestionIdx < quizData.questions.length - 1) {
            setCurrentQuestionIdx(currentQuestionIdx + 1);
            setShowFeedback(false);
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

        if (finalScore < quizData.passingScore) {
            localStorage.setItem('vecy_quiz_last_fail', Date.now().toString());
        } else {
            localStorage.removeItem('vecy_quiz_last_fail');
        }

        setCurrentStep('finished');
    };

    if (showCertificate) {
        return <CertificateView
            userData={userData || { name: 'Estudiante VECY', idNumber: '' }}
            score={score || 0}
            onBack={() => setShowCertificate(false)}
        />;
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

                    {cooldownRemaining > 0 && (
                        <div className="mb-8 p-4 bg-red-500/10 border border-red-500/30 rounded-sm text-red-400 text-sm animate-pulse">
                            ⚠️ Debes esperar <strong className="font-bold text-white">{Math.floor(cooldownRemaining / 60)}m {cooldownRemaining % 60}s</strong> para volver a intentar el examen.
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <button onClick={onBack} className="px-10 py-4 border border-[#333] text-gray-400 hover:text-white transition-colors uppercase tracking-widest text-xs">Aún no estoy listo</button>
                        <button
                            onClick={handleStart}
                            disabled={cooldownRemaining > 0}
                            className={`px-10 py-4 font-bold uppercase tracking-widest text-xs shadow-lg transition-all ${cooldownRemaining > 0
                                ? 'bg-gray-700 text-gray-400 cursor-not-allowed opacity-50'
                                : 'bg-gradient-to-r from-[#bf953f] to-[#aa771c] text-black hover:scale-105'}`}
                        >
                            {cooldownRemaining > 0 ? 'Bloqueo Activo' : 'Iniciar Examen'}
                        </button>
                    </div>
                </div>
            </PageTransition>
        );
    }

    if (currentStep === 'finished') {
        const passed = score >= quizData.passingScore;
        return (
            <PageTransition>
                <div className="max-w-4xl mx-auto px-6 py-20">
                    <div className="text-center mb-16">
                        {passed ? (
                            <div className="w-24 h-24 bg-green-500/10 border border-green-500/50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_30px_rgba(34,197,94,0.2)]">
                                <Trophy className="w-12 h-12 text-green-500" />
                            </div>
                        ) : (
                            <div className="w-24 h-24 bg-red-500/10 border border-red-500/50 rounded-full flex items-center justify-center mx-auto mb-8">
                                <XCircle className="w-12 h-12 text-red-500" />
                            </div>
                        )}
                        <h1 className="text-4xl font-serif font-bold text-white mb-4">
                            {passed ? '¡Felicidades, Experto!' : 'Casi lo logras'}
                        </h1>
                        <p className={`text-3xl font-bold mb-4 ${passed ? 'text-green-500' : 'text-red-500'}`}>
                            Puntaje Final: {score}%
                        </p>
                        <p className="text-gray-400 max-w-xl mx-auto">
                            {passed
                                ? 'Has demostrado un dominio excepcional de las herramientas digitales VECY.'
                                : 'El estándar de VECY es alto. Revisa el historial de respuestas abajo para aprender de tus errores.'}
                        </p>
                    </div>

                    {/* ANSWER HISTORY REVIEW */}
                    <div className="mb-16 space-y-6">
                        <h3 className="text-[#bf953f] font-serif font-bold text-xl uppercase tracking-widest border-b border-[#333] pb-4 flex items-center gap-3">
                            <ClipboardCheck className="w-6 h-6" /> Revisión del Examen
                        </h3>
                        {quizData.questions.map((q, idx) => {
                            const isCorrect = answers[idx] === q.correct;
                            return (
                                <div key={idx} className={`p-6 border rounded-sm transition-all ${isCorrect ? 'bg-green-500/5 border-green-500/20' : 'bg-red-500/5 border-red-500/20'}`}>
                                    <div className="flex items-start gap-4">
                                        <div className={`mt-1 shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${isCorrect ? 'bg-green-500' : 'bg-red-500'}`}>
                                            {isCorrect ? <CheckCircle className="w-4 h-4 text-black" /> : <XCircle className="w-4 h-4 text-white" />}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-white font-medium mb-3">{idx + 1}. {q.question}</p>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                                <div className="p-3 rounded bg-black/40 border border-[#333]">
                                                    <span className="text-gray-500 block text-[10px] uppercase font-bold mb-1">Tu Respuesta</span>
                                                    <span className={isCorrect ? 'text-green-400' : 'text-red-400'}>
                                                        {answers[idx] !== undefined ? q.options[answers[idx]] : 'Sin responder'}
                                                    </span>
                                                </div>
                                                {!isCorrect && (
                                                    <div className="p-3 rounded bg-black/40 border border-[#333]">
                                                        <span className="text-gray-500 block text-[10px] uppercase font-bold mb-1">Respuesta Correcta</span>
                                                        <span className="text-green-400">{q.options[q.correct]}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {passed ? (
                        <div className="bg-[#111] border border-[#333] p-8 rounded-sm mb-12 shadow-2xl">
                            <h3 className="text-white font-bold mb-6 flex items-center gap-2">
                                <Award className="w-5 h-5 text-[#bf953f]" /> Generar tu Diploma Oficial
                            </h3>
                            <div className="grid md:grid-cols-2 gap-6 mb-8">
                                <div>
                                    <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Nombre Completo</label>
                                    <input
                                        type="text"
                                        value={userData.name}
                                        onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                                        className="w-full bg-[#050505] border border-[#333] p-4 text-white focus:border-[#bf953f] outline-none transition-colors"
                                        placeholder="Tu nombre profesional"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">D.I. (Opcional)</label>
                                    <input
                                        type="text"
                                        value={userData.idNumber}
                                        onChange={(e) => setUserData({ ...userData, idNumber: e.target.value })}
                                        className="w-full bg-[#050505] border border-[#333] p-4 text-white focus:border-[#bf953f] outline-none transition-colors"
                                        placeholder="Identificación"
                                    />
                                </div>
                            </div>
                            <button
                                onClick={() => setShowCertificate(true)}
                                disabled={!userData?.name?.trim()}
                                className={`w-full py-6 font-bold uppercase tracking-[0.3em] text-sm shadow-xl transition-all rounded-sm ${userData?.name?.trim()
                                    ? 'bg-gradient-to-r from-[#bf953f] to-[#aa771c] text-black hover:scale-[1.01]'
                                    : 'bg-[#222] text-gray-600 cursor-not-allowed'
                                    }`}
                            >
                                Descargar mi Diploma Oficial
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col sm:flex-row justify-center gap-6">
                            <button onClick={onBack} className="flex-1 px-10 py-5 border border-[#333] text-gray-400 hover:text-white hover:border-gray-500 transition-all font-bold uppercase tracking-widest text-xs rounded-sm">
                                Volver a los Módulos
                            </button>
                            <button
                                onClick={() => window.location.reload()}
                                disabled={cooldownRemaining > 0}
                                className={`flex-1 px-10 py-5 font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 rounded-sm transition-all ${cooldownRemaining > 0
                                    ? 'bg-[#222] text-gray-500 cursor-not-allowed border border-[#333]'
                                    : 'bg-white text-black hover:scale-105'}`}
                            >
                                <RefreshCcw className={`w-4 h-4 ${cooldownRemaining > 0 ? '' : 'animate-spin-slow'}`} />
                                {cooldownRemaining > 0 ? `Reintentar en ${Math.floor(cooldownRemaining / 60)}m` : 'Intentar de Nuevo'}
                            </button>
                        </div>
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
                    <h2 className="text-2xl md:text-3xl font-serif font-bold text-white mb-12 leading-tight text-center max-w-3xl">
                        {question.question}
                    </h2>
                    <div className="space-y-4 w-full max-w-2xl">
                        {question.options.map((option, idx) => {
                            const isSelected = answers[currentQuestionIdx] === idx;
                            const isCorrect = idx === question.correct;
                            let style = 'bg-[#0e0e0e] border-[#333] text-gray-400 hover:border-[#bf953f]/50 hover:bg-[#161616]';

                            if (showFeedback) {
                                if (isCorrect) style = 'bg-green-500/20 border-green-500 text-white shadow-[0_0_20px_rgba(34,197,94,0.1)]';
                                else if (isSelected) style = 'bg-red-500/20 border-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.1)]';
                                else style = 'bg-[#0e0e0e] border-[#333] text-gray-600 opacity-50';
                            } else if (isSelected) {
                                style = 'bg-[#bf953f]/10 border-[#bf953f] text-white';
                            }

                            return (
                                <button
                                    key={idx}
                                    disabled={showFeedback}
                                    onClick={() => handleAnswer(idx)}
                                    className={`w-full p-6 text-left border transition-all duration-300 flex items-center justify-between group rounded-sm ${style}`}
                                >
                                    <span className="text-lg font-light">{option}</span>
                                    <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-colors shrink-0 ml-4 ${isSelected
                                        ? (showFeedback ? (isCorrect ? 'bg-green-500' : 'bg-red-500') : 'bg-[#bf953f]')
                                        : 'bg-transparent border-[#444]'
                                        }`}>
                                        {isSelected && (isCorrect ? <CheckCircle className="w-4 h-4 text-black" /> : <XCircle className="w-4 h-4 text-white" />)}
                                        {!isSelected && showFeedback && isCorrect && <CheckCircle className="w-4 h-4 text-green-500" />}
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {showFeedback && (
                        <div className={`mt-8 p-4 rounded-sm border w-full max-w-2xl animate-in slide-in-from-top-4 duration-500 ${answers[currentQuestionIdx] === question.correct ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}>
                            <div className="flex items-center gap-3 font-bold uppercase tracking-widest text-xs">
                                {answers[currentQuestionIdx] === question.correct
                                    ? <><CheckCircle className="w-4 h-4" /> ¡Excelente! Respuesta Correcta.</>
                                    : <><XCircle className="w-4 h-4" /> Incorrecto. Sigue aprendiendo.</>}
                            </div>
                        </div>
                    )}
                </div>

                {/* Navigation */}
                <div className="mt-16 flex flex-col sm:flex-row justify-between items-center gap-6 border-t border-[#333] pt-12">
                    <button
                        onClick={() => {
                            setCurrentQuestionIdx(prev => Math.max(0, prev - 1));
                            setShowFeedback(true); // Keep feedback when going back to reviewed questions
                        }}
                        disabled={currentQuestionIdx === 0}
                        className="w-full sm:w-auto px-8 py-4 border border-[#333] text-gray-400 hover:text-white hover:border-gray-500 disabled:opacity-0 transition-all font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 rounded-sm"
                    >
                        <ArrowLeft className="w-4 h-4" /> Anterior
                    </button>

                    {showFeedback && (
                        <button
                            onClick={handleNext}
                            className="w-full sm:w-auto px-12 py-5 bg-[#bf953f] text-black font-bold uppercase tracking-[0.2em] text-sm flex items-center justify-center gap-3 transition-all rounded-sm shadow-xl hover:scale-105 active:scale-95 animate-in fade-in zoom-in duration-300"
                        >
                            {currentQuestionIdx < quizData.questions.length - 1 ? (
                                <>Siguiente Pregunta <ArrowRight className="w-4 h-4" /></>
                            ) : (
                                'Ver Resultados Finales'
                            )}
                        </button>
                    )}
                </div>
            </div>
        </PageTransition>
    );
};

export default QuizView;
