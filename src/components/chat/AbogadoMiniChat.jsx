import React, { useState, useEffect, useRef } from 'react';
import { Send, FileText, Image as ImageIcon, Plus, Mic, Square, Volume2, GraduationCap } from 'lucide-react';
import { callGemini } from '../../utils/aiUtils';
import { FormatText, TypewriterText } from '../Layout/Shared';
import { track } from '@vercel/analytics';

const AbogadoMiniChat = () => {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]);
    const [isTyping, setIsTyping] = useState(false);
    const lastMessageRef = useRef(null);
    const messagesEndRef = useRef(null);
    const textareaRef = useRef(null);
    const fileInputRef = useRef(null);
    const [attachedFiles, setAttachedFiles] = useState([]);
    const [isRecording, setIsRecording] = useState(false);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const [speakingId, setSpeakingId] = useState(null);

    const [hasInteracted, setHasInteracted] = useState(false);

    // Initial Greeting based on current module removed to show Welcome UI instead

    useEffect(() => {
        return () => {
            if (window.speechSynthesis) {
                window.speechSynthesis.cancel();
            }
        };
    }, []);

    const toggleSpeak = (msgId, text) => {
        if (!('speechSynthesis' in window)) {
            alert("Tu navegador no soporta lectura de texto a voz.");
            return;
        }

        if (speakingId === msgId) {
            window.speechSynthesis.cancel();
            setSpeakingId(null);
        } else {
            // Cancelar cualquier audio en proceso para forzar limpieza de memoria
            window.speechSynthesis.cancel();

            setTimeout(() => {
                const cleanText = text.replace(/[*_#`]/g, '');
                const utterance = new SpeechSynthesisUtterance(cleanText);

                // Evitar Garbage Collection nativo que silencia el reproductor de la nada
                window.currentUtterance = utterance;

                utterance.lang = 'es-CO';
                utterance.rate = 1.05;

                utterance.onstart = () => {
                    setSpeakingId(msgId);
                };

                const voices = window.speechSynthesis.getVoices();
                if (voices.length > 0) {
                    const voice = voices.find(v => v.lang === 'es-CO') ||
                        voices.find(v => v.name.includes('Microsoft Sabina') || v.name.includes('Google español') || v.lang.startsWith('es'));
                    if (voice) utterance.voice = voice;
                }

                // Workaround bug Chrome (se silencia a los 15 segundos)
                const resumeEngine = setInterval(() => {
                    if (window.speechSynthesis.speaking) {
                        window.speechSynthesis.pause();
                        window.speechSynthesis.resume();
                    } else {
                        clearInterval(resumeEngine);
                    }
                }, 10000);

                utterance.onend = () => {
                    clearInterval(resumeEngine);
                    setSpeakingId(null);
                };

                utterance.onerror = (e) => {
                    console.error("TTS Error:", e);
                    clearInterval(resumeEngine);
                    setSpeakingId(null);
                };

                window.speechSynthesis.speak(utterance);

                // Forzar reproducción en caso de estado buggeado del navegador
                if (window.speechSynthesis.paused) {
                    window.speechSynthesis.resume();
                }
            }, 250);
        }
    };

    const handleFileAttach = (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;

        const allowedTypes = [
            'application/pdf',
            'image/jpeg', 'image/png', 'image/webp', 'image/gif',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/msword'
        ];

        const validFiles = files.filter(f => allowedTypes.includes(f.type));
        if (validFiles.length < files.length) {
            alert(`${files.length - validFiles.length} archivo(s) ignorado(s). Formatos válidos: PDF, JPG, PNG, WEBP, Word.`);
        }

        validFiles.forEach(file => {
            const reader = new FileReader();
            reader.onload = (ev) => {
                const base64 = ev.target.result.split(',')[1];
                const isImage = file.type.startsWith('image/');
                setAttachedFiles(prev => [...prev, {
                    id: Date.now() + Math.random(),
                    name: file.name,
                    mimeType: file.type,
                    base64,
                    preview: isImage ? ev.target.result : null,
                    isWord: file.type.includes('word')
                }]);
            };
            reader.readAsDataURL(file);
        });
        e.target.value = '';
    };

    const removeAttachedFile = (id) => setAttachedFiles(prev => prev.filter(f => f.id !== id));

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + 'px';
        }
    }, [input]);

    const toggleRecording = async () => {
        if (isRecording) {
            mediaRecorderRef.current?.stop();
            setIsRecording(false);
        } else {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                const mediaRecorder = new MediaRecorder(stream);
                mediaRecorderRef.current = mediaRecorder;
                audioChunksRef.current = [];

                mediaRecorder.ondataavailable = (event) => {
                    if (event.data.size > 0) {
                        audioChunksRef.current.push(event.data);
                    }
                };

                mediaRecorder.onstop = () => {
                    const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                    const reader = new FileReader();
                    reader.onload = (ev) => {
                        const base64 = ev.target.result.split(',')[1];
                        setAttachedFiles(prev => [...prev, {
                            id: Date.now() + Math.random(),
                            name: `Audio_${new Date().toLocaleTimeString().replace(/:/g, '')}.webm`,
                            mimeType: 'audio/webm',
                            base64,
                            preview: null,
                            isWord: false
                        }]);
                        track('academy_tutor_audio');
                    };
                    reader.readAsDataURL(audioBlob);
                    stream.getTracks().forEach(track => track.stop());
                };

                mediaRecorder.start();
                setIsRecording(true);
            } catch (error) {
                console.error("Error accediendo al micrófono:", error);
                alert("No se pudo acceder al micrófono. Por favor verifica los permisos.");
            }
        }
    };

    const handleSend = async () => {
        if ((!input.trim() && attachedFiles.length === 0) || isTyping) return;

        const userText = input.trim();
        const hasAttachedAudio = attachedFiles.some(f => f.mimeType.startsWith('audio/'));
        const displayDefaultMediaText = hasAttachedAudio ? 'Escuchando nota de voz...' : 'Enviando documento...';

        const userMsg = {
            id: Date.now(),
            type: 'user',
            text: userText || (attachedFiles.length > 0 ? displayDefaultMediaText : ''),
            files: [...attachedFiles]
        };

        if (!hasInteracted) {
            setHasInteracted(true);
        }

        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);
        if (textareaRef.current) textareaRef.current.style.height = 'auto';

        await processGeminiResponse(userText, [...messages, userMsg]);
    };

    const processGeminiResponse = async (userText, currentMessages) => {
        const currentTopic = 'Asesoría Jurídica y Negocios Inmobiliarios';

        const EDDU_SYSTEM_PROMPT = `
            ═══════════════════════════════════════════════
            ABOGADO EDDU AI — BUFETE VIRTUAL VECY
            ═══════════════════════════════════════════════
 
            🔹 IDENTIDAD Y MANDATO:
            Eres **Eddu-AI**, el Abogado Senior y Estratega Digital de VECY Academia.
            Estás asesorando a un colega o cliente en un caso de la vida real.

            🔹 LEY APLICABLE Y FOCO:
            - **Legislación exclusiva:** Leyes de la República de Colombia.
            - **Áreas:** Derecho Inmobiliario, Derecho Comercial, Ley 527 de 1999 (Comercio Electrónico y Firmas Digitales).

            🔹 PERSONALIDAD Y TONO DE VOZ: 
            - Eres un brillante litigante cachaco (bogotano). Elegante, seguro y carismático.
            - Háblale al usuario de "tú" (tuteo), NUNCA de "usted".
            - Usa términos como: "¡Ala!", "Carachas", "Chirriado", "Pisco", "Veci / Vecinito".

            🔹 DIRECTRICES DE ASESORÍA:
            1. Analiza el caso profundamente, identifica riesgos y sugiere el mejor camino legal.
            2. Siempre sustenta tus respuestas en las leyes colombianas vigentes.
            3. Si el usuario sube un contrato o documento, audítalo rigurosamente buscando vacíos legales que lo perjudiquen. No asumas cosas, básate en el texto.
            4. Si el usuario pide que redactes algo, hazlo de manera impecable y lista para usarse.

            🔹 CAPACIDADES TÉCNICAS REITERADAS:
            - **TIENES CAPACIDAD NATIVA DE ESCUCHAR AUDIO Y LEER IMÁGENES.** Si recibes notas de voz o fotos, analízalos como pruebas o consultas.
        `;

        track('abogado_chat_message_sent');

        try {
            const history = currentMessages
                .filter(m => m.text)
                .slice(-10)
                .map(m => ({
                    role: m.type === 'bot' ? 'model' : 'user',
                    parts: [{ text: m.text }]
                }));

            const fileNames = attachedFiles.map(f => f.name).join(', ');
            const newParts = [];

            const hasAudio = attachedFiles.some(f => f.mimeType.startsWith('audio/'));
            const defaultText = hasAudio ? 'Escucha esta respuesta o duda del alumno (nota de voz).' : 'Revisa este documento.';

            newParts.push({ text: attachedFiles.length > 0 ? `[Adjuntos: ${fileNames}]\n${userText || defaultText}` : userText });

            attachedFiles.filter(f => !f.isWord).forEach(file => {
                newParts.push({ inlineData: { mimeType: file.mimeType, data: file.base64 } });
            });

            const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
            let responseText;

            if (isLocal) {
                try {
                    const backendRes = await fetch('http://localhost:3800/api/chat', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ history, newParts, systemInstruction: EDDU_SYSTEM_PROMPT })
                    });
                    if (backendRes.ok) {
                        const data = await backendRes.json();
                        responseText = data.text;
                    } else {
                        throw new Error('Backend error');
                    }
                } catch (e) {
                    responseText = await callGemini(history, newParts, EDDU_SYSTEM_PROMPT);
                }
            } else {
                responseText = await callGemini(history, newParts, EDDU_SYSTEM_PROMPT);
            }

            const botMsg = { id: Date.now() + 1, type: 'bot', text: responseText };
            setMessages(prev => [...prev, botMsg]);
            setAttachedFiles([]);
        } catch (error) {
            console.error("Error en Tutor:", error);
            const errorMsg = { id: Date.now() + 1, type: 'bot', text: '⚠️ **Problema de Conexión:** No pude conectar con la pizarra digital. Verifica tu conexión o intenta más tarde.' };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsTyping(false);
            if (messagesEndRef.current) messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    // Auto-scroll on new messages
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isTyping]);

    return (
        <div className="flex flex-col h-full w-full bg-[#0a0a0a] rounded-xl border border-[#bf953f]/30 overflow-hidden shadow-[0_0_30px_rgba(212,175,55,0.1)] relative">
            <div className="bg-gradient-to-r from-[#1c1500] via-[#1c1c1c] to-[#1c1500] p-4 border-b border-[#bf953f]/25 flex items-center justify-between z-10 shadow-lg">
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <img
                            src="/Eddu-AI.png"
                            alt="Maestro Eddu AI"
                            className="w-12 h-12 rounded-full object-cover border-2 border-[#d4af37] shadow-[0_0_15px_rgba(212,175,55,0.5)] bg-black"
                            fetchPriority="high"
                        />
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#10b981] rounded-full border-2 border-[#1c1c1c]"></div>
                    </div>
                    <div>
                        <h3 className="text-white font-bold text-base flex items-center gap-2 font-serif">
                            Abogado Eddu AI
                        </h3>
                        <p className="text-[#d4af37] text-[10px] uppercase tracking-widest">Bufete Jurídico VECY</p>
                    </div>
                </div>
            </div>

            <div className={`flex-1 p-3 md:p-5 custom-scrollbar relative ${!hasInteracted ? 'overflow-y-auto flex flex-col items-center justify-center h-full pb-32' : 'overflow-y-auto space-y-6 pb-24'}`}>
                {!hasInteracted ? (
                    <div className="flex flex-col items-center justify-center text-center animate-fade-in w-full max-w-lg mx-auto h-full space-y-6">
                        <div className="w-full flex justify-center shadow-[0_10px_40px_rgba(212,175,55,0.15)] rounded-2xl overflow-hidden border border-[#bf953f]/30 relative mb-2">
                            <img
                                src="/Eddu-AI.png"
                                alt="Maestro Eddu-AI Aula Socrática"
                                className="w-full h-auto max-h-[55vh] lg:max-h-[65vh] object-contain transform hover:scale-105 transition-transform duration-700 ease-out bg-[#050505]"
                            />
                        </div>
                        <div className="space-y-4 px-4 bg-[#111]/90 backdrop-blur-sm p-6 rounded-xl border border-[#333] shadow-lg flex-shrink-0 w-full relative z-10 -mt-8">
                            <h2 className="text-xl md:text-2xl font-serif font-bold text-white tracking-tight">
                                Bufete Digital <span className="text-[#d4af37]">VECY</span>
                            </h2>
                            <p className="text-sm md:text-base text-gray-300 font-light leading-relaxed">
                                ¡Pláceme saludarte mi vecy! Soy <strong className="text-[#d4af37] font-bold">Eddu-AI</strong>, tu Abogado y Estratega Digital. Sube tus contratos, cuéntame tu caso por audio, o hazme cualquier consulta jurídica. ¡Vamos a blindar tus negocios!
                            </p>
                            <div className="pt-1 flex justify-center">
                                <span className="text-[10px] font-bold text-[#bf953f] tracking-[0.2em] uppercase px-4 py-1.5 rounded-full border border-[#bf953f]/30 bg-[#bf953f]/10">
                                    Enfocado en: Derecho Inmobiliario & Ley 527
                                </span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        {messages.map((msg, index) => (
                            <div
                                key={msg.id}
                                ref={index === messages.length - 1 ? lastMessageRef : null}
                                className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`max-w-[95%] rounded-2xl p-3 md:p-4 ${msg.type === 'user'
                                    ? 'bg-gradient-to-br from-[#2a1f00] to-[#1a1400] border border-[#d4af37]/40 text-[#FFF5CC] rounded-tr-none shadow-[0_2px_12px_rgba(212,175,55,0.15)]'
                                    : 'bg-gradient-to-br from-[#161410] to-[#0e0c0a] border border-[#bf953f]/35 text-gray-100 rounded-tl-none shadow-[0_2px_16px_rgba(191,149,63,0.12)]'
                                    }`}>
                                    <div className="text-sm md:text-[15px] leading-relaxed whitespace-pre-line font-light">
                                        {msg.type === 'bot' && index === messages.length - 1 ? (
                                            <TypewriterText text={msg.text} />
                                        ) : (
                                            <FormatText text={msg.text} />
                                        )}
                                    </div>

                                    {msg.files && msg.files.length > 0 && (
                                        <div className="mt-3 flex flex-wrap gap-2 pt-2 border-t border-white/10">
                                            {msg.files.map((file, fIdx) => (
                                                <div key={fIdx} className="flex items-center gap-2 bg-black/40 px-2 py-1.5 rounded-md border border-[#d4af37]/30 text-[10px] text-[#d4af37]">
                                                    {file.mimeType?.startsWith('image/') ? (
                                                        <ImageIcon className="w-3 h-3" />
                                                    ) : file.mimeType?.startsWith('audio/') ? (
                                                        <Mic className="w-3 h-3" />
                                                    ) : (
                                                        <FileText className="w-3 h-3" />
                                                    )}
                                                    <span className="truncate max-w-[100px]">{file.name}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {msg.type === 'bot' && (
                                        <div className="mt-3 flex justify-end border-t border-[#bf953f]/10 pt-2">
                                            <button
                                                onClick={() => toggleSpeak(msg.id, msg.text)}
                                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] uppercase font-bold tracking-wider transition-colors ${speakingId === msg.id
                                                    ? 'bg-[#d4af37]/20 text-[#d4af37]'
                                                    : 'bg-black/20 text-gray-400 hover:text-gray-200 hover:bg-black/40'
                                                    }`}
                                                title={speakingId === msg.id ? "Detener audio" : "Escuchar clase"}
                                            >
                                                <Volume2 className={`w-3.5 h-3.5 ${speakingId === msg.id ? 'animate-pulse' : ''}`} />
                                                {speakingId === msg.id ? 'Detener' : 'Escuchar'}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </>
                )}
                {isTyping && (
                    <div className="flex justify-start">
                        <div className="bg-gradient-to-br from-[#161410] to-[#0e0c0a] px-4 py-3 rounded-2xl rounded-tl-none border border-[#d4af37]/40 flex items-center gap-2 shadow-[0_2px_16px_rgba(212,175,55,0.12)]">
                            <div className="flex space-x-1">
                                <div className="w-1.5 h-1.5 bg-[#d4af37] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                <div className="w-1.5 h-1.5 bg-[#d4af37] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                <div className="w-1.5 h-1.5 bg-[#d4af37] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} className="h-4" />
            </div>

            <div className="w-full p-3 bg-gradient-to-t from-[#0a0a0a] to-[#111] border-t border-[#333] z-20 shrink-0">
                <div className="relative flex flex-col bg-black border border-[#333] rounded-xl focus-within:border-[#bf953f]/70 focus-within:shadow-[0_0_15px_rgba(212,175,55,0.1)] transition-all overflow-hidden">
                    {attachedFiles.length > 0 && (
                        <div className="flex flex-wrap gap-2 p-2 border-b border-[#333] bg-[#0a0a0a]">
                            {attachedFiles.map(file => (
                                <div key={file.id} className="relative flex items-center gap-2 bg-[#1c1c1c] border border-[#d4af37]/30 px-2 py-1.5 rounded-md text-[10px] text-gray-300">
                                    <div className="w-3 h-3 text-[#d4af37]">
                                        {file.mimeType?.startsWith('image/') ? <ImageIcon className="w-3 h-3" /> : file.mimeType?.startsWith('audio/') ? <Mic className="w-3 h-3" /> : <FileText className="w-3 h-3" />}
                                    </div>
                                    <span className="max-w-[70px] truncate">{file.name}</span>
                                    <button onClick={() => removeAttachedFile(file.id)} className="ml-1 text-gray-500 hover:text-red-400">×</button>
                                </div>
                            ))}
                        </div>
                    )}

                    <textarea
                        ref={textareaRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Consúltale a tu Abogado..."
                        className="w-full bg-transparent px-4 pt-3 pb-1 text-sm text-gray-200 placeholder-gray-600 focus:outline-none resize-none min-h-[44px] max-h-[150px] custom-scrollbar"
                        rows={1}
                    />

                    <div className="flex items-center justify-between px-2 pb-2">
                        <div className="flex items-center">
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png,.webp,.gif,.doc,.docx" multiple
                                onChange={handleFileAttach}
                                className="hidden"
                            />
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="p-2 text-gray-500 hover:text-[#d4af37] transition-colors"
                                title="Adjuntar archivo o imagen"
                            >
                                <Plus className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="flex items-center gap-1">
                            <button
                                onClick={toggleRecording}
                                className={`p-2 transition-colors mr-1 rounded-full ${isRecording ? 'text-red-500 bg-red-500/10 animate-pulse' : 'text-gray-500 hover:text-[#d4af37]'}`}
                                title={isRecording ? "Detener grabación" : "Enviar nota de voz"}
                            >
                                {isRecording ? <Square className="w-4 h-4 fill-current" /> : <Mic className="w-4 h-4" />}
                            </button>
                            <button
                                onClick={handleSend}
                                disabled={isTyping || (!input.trim() && attachedFiles.length === 0)}
                                className={`flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 ${(!input.trim() && attachedFiles.length === 0)
                                    ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
                                    : 'bg-[#d4af37] text-black hover:scale-105 shadow-[0_0_10px_rgba(212,175,55,0.4)]'
                                    }`}
                            >
                                <Send className="w-4 h-4 ml-0.5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AbogadoMiniChat;
