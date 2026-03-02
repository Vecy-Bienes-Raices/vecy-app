import React, { useState, useEffect, useRef } from 'react';
import { Paperclip, Send, FileText, Image as ImageIcon, Plus, Mic, ChevronUp, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { callGemini } from '../../utils/aiUtils';
import { FormatText, TypewriterText, detectGender } from '../Layout/Shared';
import { track } from '@vercel/analytics';

const EdduAIChat = () => {
    const [input, setInput] = useState('');
    const [chatStage, setChatStage] = useState('asking_name'); // 'asking_name' | 'processing_name' | 'active'
    const [userName, setUserName] = useState('');
    const [userGender, setUserGender] = useState('neutral'); // 'male' | 'female' | 'neutral'
    const [messages, setMessages] = useState([]);
    const [isTyping, setIsTyping] = useState(false);
    const [hasInteracted, setHasInteracted] = useState(false);
    const lastMessageRef = useRef(null);
    const messagesEndRef = useRef(null);
    const textareaRef = useRef(null);
    const fileInputRef = useRef(null);
    const [attachedFiles, setAttachedFiles] = useState([]);

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

                track('chat_file_attached', {
                    file_type: file.type,
                    is_image: isImage
                });

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

    const handleSend = async () => {
        if ((!input.trim() && attachedFiles.length === 0) || isTyping) return;

        const userText = input.trim();
        const userMsg = {
            id: Date.now(),
            type: 'user',
            text: userText || (attachedFiles.length > 0 ? 'Analizando archivos adjuntos...' : ''),
            files: [...attachedFiles]
        };

        if (!hasInteracted) {
            setHasInteracted(true);
        }

        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);
        if (textareaRef.current) textareaRef.current.style.height = 'auto';

        const prefixRX = /^(hola[,!]?|buenos d[ií]as[,!]?|buenas tardes[,!]?|buen d[ií]a[,!]?|soy|me llamo|mi nombre es|yo soy|es|hablo con|hablas con|con|de parte de|le habla|le saluda)\s+/i;

        if (chatStage === 'asking_name') {
            setTimeout(async () => {
                // Check if user is introducing themselves
                const hasNamePattern = prefixRX.test(userText);
                let detectedName = '';

                if (hasNamePattern) {
                    let name = userText.trim();
                    let prev = '';
                    while (prev !== name) { prev = name; name = name.replace(prefixRX, '').trim(); }
                    detectedName = name.split(/[\s,!.]+/)[0].replace(/[^a-zA-Z\u00e1\u00e9\u00ed\u00f3\u00fa\u00c1\u00c9\u00cd\u00d3\u00da\u00f1\u00d1]/g, '');
                    if (detectedName) detectedName = detectedName.charAt(0).toUpperCase() + detectedName.slice(1).toLowerCase();
                }

                if (detectedName) {
                    const gender = detectGender(detectedName);
                    setUserName(detectedName);
                    setUserGender(gender);
                    setChatStage('active');

                    // Respond directly to their introduction or combined query
                    await processGeminiResponse(userText, detectedName, gender, [...messages, userMsg]);
                } else if (userText.toLowerCase().replace(/[?!.,]/g, '').trim() === 'hola') {
                    const welcomeMsg = {
                        id: Date.now() + 1,
                        type: 'bot',
                        text: 'Encantado de ayudarte, ¿Cómo me dijiste que te llamas ala?'
                    };
                    setMessages(prev => [...prev, welcomeMsg]);
                    setChatStage('processing_name');
                    setIsTyping(false);
                } else {
                    // Treat as potential question but ask name nicely
                    const welcomeMsg = {
                        id: Date.now() + 1,
                        type: 'bot',
                        text: 'Pláceme saludarte ala. Para brindarte una respuesta con autoridad jurídica, ¿cómo me dijiste que te llamas?'
                    };
                    setMessages(prev => [...prev, welcomeMsg]);
                    setChatStage('processing_name');
                    setIsTyping(false);
                }
            }, 800);
            return;
        }

        if (chatStage === 'processing_name') {
            setTimeout(async () => {
                let name = userText.trim();
                let prev = '';
                while (prev !== name) { prev = name; name = name.replace(prefixRX, '').trim(); }
                name = name.split(/[\s,!.]+/)[0].replace(/[^a-zA-Z\u00e1\u00e9\u00ed\u00f3\u00fa\u00c1\u00c9\u00cd\u00d3\u00da\u00f1\u00d1]/g, '');
                if (name) name = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
                else name = 'Consultante';

                const gender = detectGender(name);
                setUserName(name);
                setUserGender(gender);
                setChatStage('active');

                const responseText = gender === 'female'
                    ? `¡Ala, vecinita **${name}**! ¡Qué chévere tenerte por acá!\n\nMe encanta que me hayas contactado chatica. Recuerda que soy Eddu-AI, tu jurista élite de VECY Academia, y estoy aquí para blindarte y educarte con todo lo relacionado con el Derecho Inmobiliario, Comercial y la Firma Digital, siempre bajo la lupa de la legislación colombiana.\n\n¡Dispara tus inquietudes, que aquí estoy para ayudarte chinita!`
                    : `¡Ala, vecinito **${name}**! ¡Qué chévere tenerte por acá!\n\nMe encanta que me hayas contactado chatico. Recuerda que soy Eddu-AI, tu jurista élite de VECY Academia, y estoy aquí para blindarte y educarte con todo lo relacionado con el Derecho Inmobiliario, Comercial y la Firma Digital, siempre bajo la lupa de la legislación colombiana.\n\n¡Dispara tus inquietudes, que aquí estoy para ayudarte chinito!`;

                const followUpMsg = {
                    id: Date.now() + 1,
                    type: 'bot',
                    text: responseText
                };
                setMessages(prev => [...prev, followUpMsg]);
                setIsTyping(false);
                track('chat_start', { user_name: name, gender: gender });
            }, 800);
            return;
        }

        await processGeminiResponse(userText, userName, userGender, [...messages, userMsg]);
    };

    const processGeminiResponse = async (userText, name, gender, currentMessages) => {
        const EDDU_SYSTEM_PROMPT = `
            ═══════════════════════════════════════════════
            EDDU-AI — JURISTA ÉLITE Y ANALISTA JURÍDICO VECY
            ═══════════════════════════════════════════════
 
            🔹 IDENTIDAD Y MANDATO:
            Eres **Eddu-AI**, Abogado Senior y **Mentor-Docente** de VECY Academia.
            Tu misión es proteger jurídicamente y **EDUCAR** al inmobiliario con paciencia y autoridad.
            HABLAS CON EL USUARIO LLAMADO **${name}**. Género: **${gender}**.

            🔹 SOBERANÍA JURISDICCIONAL (CRÍTICO):
            1. **COLOMBIA ÚNICAMENTE:** Tu conocimiento y leyes son **EXCLUSIVAMENTE DE COLOMBIA**.
            2. **PROHIBICIÓN TOTAL:** Prohibido hablar de leyes de otros países o dar generalidades ("en cualquier país").

            🔹 RESTRICCIÓN DE FOCO (INVIOLABLE):
            1. **EXPERTO ÚNICAMENTE EN:** Derecho Inmobiliario, Comercial y Firma Digital (Ley 527 de 1999).
            2. **TEMAS PROHIBIDOS:** Está terminantemente prohibido responder sobre: Precios de divisas (dólar, euro), política, medicina, deportes, clima o cualquier tema ajeno a lo inmobiliario.
            3. **RESPUESTA DIPLOMÁTICA:** Si te preguntan algo fuera de tu foco, responde: "**Estimado(a) [Nombre], mi propósito y experticia están blindados exclusivamente para el ámbito del Derecho Inmobiliario y la Firma Digital en Colombia. Para garantizar la excelencia, solo responderé inquietudes relacionadas con mi especialidad.**"

            🔹 PERSONALIDAD CACHACA Y TONO DE VOZ: 
            - Eres un verdadero cachaco moderno. Elegante, carismático y pedagógico.
            - **CRÍTICO:** Háblale siempre al usuario de "tú" (tuteo), NUNCA de "usted". Mantén un tono cercano, como de "tú a tú", combinando la confianza capitalina con un estricto profesionalismo jurídico.
            - **DICCIONARIO CACHACO:** Úsalo con total naturalidad según el contexto:
              * **"¡Ala!"**: Tu saludo por excelencia, denota confianza y distinción ("¡Ala, cómo te ha ido!").
              * **"Carachas"**: Expresión de sorpresa cuando un caso sale mejor de lo esperado.
              * **"Chirriado"**: Algo bien hecho, elegante o estructurado (ej. "¡Ese contrato quedó chirriado!").
              * **"Filipichín"**: Alguien que viste o actúa con excesiva elegancia.
              * **"Pisco"**: Para referirte al individuo, cliente o contraparte del que se habla.
              * **"Chusco"**: Agradable o atractivo.
              * **"Fregar"**: Molestar ("No dejes que te frieguen con avisos físicos").
              * **"Guache"**: Alguien grosero o de malos modos (quizás una contraparte rebelde).
              * **"Veci / Vecy / Vecinito"**: Tu palabra mágica. Es el lubricante social de Bogotá y el origen de nuestra marca VECY. Eres la evolución del antiguo "Sumercé", trasladando el afecto, la amabilidad y la confianza del barrio antiguo a un entorno legal hiper-tecnológico (SEO, Firma Electrónica IA).
            
            🔹 REGLA DE ORO: CONCISIÓN Y CLARIDAD.
            1. **Explica fácil:** Transforma la jerga legal en conceptos sencillos.
            2. **Grounding:** Usa Google Search solo para datos técnicos actualizados sobre herramientas VECY en COLOMBIA.

            ────────────────────────────────────────────
            📚 PILARES DE CONOCIMIENTO VECY
            ────────────────────────────────────────────
            ⚖️ 1. LEY 527 / FIRMA ELECTRÓNICA: El núcleo de la modernización.
            ⚖️ 2. MAIL SUITE & 4-72: Herramientas de blindaje y notificación.
            ⚖️ 3. CÓDIGO DE COMERCIO & CIVIL: Corretaje y Compraventa.
            ⚖️ 4. ÉTICA INMOBILIARIA: El estándar profesional VECY.
 
            🚫 RESTRICCIÓN FINAL: Solo respondes sobre Derecho Inmobiliario, Comercial y Herramientas VECY en COLOMBIA.
        `;

        track('chat_message_sent', {
            has_attachments: attachedFiles.length > 0,
            attachments_count: attachedFiles.length
        });

        try {
            const history = messages
                .filter(m => m.text)
                .slice(-10)
                .map(m => ({
                    role: m.type === 'bot' ? 'model' : 'user',
                    parts: [{ text: m.text }]
                }));

            const fileNames = attachedFiles.map(f => f.name).join(', ');
            const newParts = [];

            newParts.push({ text: attachedFiles.length > 0 ? `[Archivos adjuntos: ${fileNames}]\n${userText || 'Analiza estos documentos.'}` : userText });

            attachedFiles.filter(f => !f.isWord).forEach(file => {
                newParts.push({ inlineData: { mimeType: file.mimeType, data: file.base64 } });
            });

            let responseText;
            const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

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
                    console.warn("Backend local no disponible, usando conexión directa...");
                    responseText = await callGemini(history, newParts, EDDU_SYSTEM_PROMPT);
                }
            } else {
                responseText = await callGemini(history, newParts, EDDU_SYSTEM_PROMPT);
            }

            const botMsg = { id: Date.now() + 1, type: 'bot', text: responseText };
            setMessages(prev => [...prev, botMsg]);
            setAttachedFiles([]);
        } catch (error) {
            console.error("Error en Chat:", error);
            let errorText = "⚠️ **Error de Conexión:** No pude conectar con Eddu-AI ala.";

            if (error.message === "API Key Missing") {
                errorText = "⚠️ **Configuración Pendiente:** Falta la `VITE_GOOGLE_API_KEY`. Por favor, verifícala.";
            } else if (error.message.startsWith("IA_FAILED:")) {
                const rawError = error.message.replace("IA_FAILED: ", "");
                errorText = `⚠️ **Error de la IA:** ${rawError}\n\nRevisa tu cuota de Google o el modelo solicitado.`;
            } else if (error.message.includes("fetch")) {
                errorText = "⚠️ **Error de Red:** No hay respuesta del servidor de IA. Revisa tu conexión.";
            }

            const errorMsg = { id: Date.now() + 1, type: 'bot', text: errorText };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="flex flex-col h-[90vh] md:h-[750px] w-full max-w-7xl mx-auto bg-[#0e0e0e] rounded-xl border border-[#d4af37]/50 overflow-hidden shadow-[0_0_50px_rgba(255,215,0,0.25)] relative animate-fade-in mb-8">
            {hasInteracted && (
                <div className="bg-gradient-to-r from-[#1c1500] via-[#1c1c1c] to-[#1c1500] p-4 border-b border-[#bf953f]/25 flex items-center justify-between animate-slide-down">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <img
                                src="/Eddu-AI.png"
                                alt="Eddu-AI Avatar"
                                className="w-14 h-14 rounded-full object-cover border-2 border-[#d4af37] shadow-[0_0_20px_rgba(212,175,55,0.5)] bg-black"
                                fetchPriority="high"
                            />
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#10b981] rounded-full border-2 border-[#1c1c1c]"></div>
                        </div>
                        <div>
                            <h3 className="text-white font-bold text-lg flex items-center gap-2 font-serif">
                                Eddu-AI <span className="text-[10px] bg-[#d4af37]/25 text-[#d4af37] px-2 py-0.5 rounded-full border border-[#d4af37]/50 font-sans tracking-wide">JURISTA SENIOR v4.0</span>
                            </h3>
                            <p className="text-[#d4af37] text-xs uppercase tracking-widest">Experto Leyes Colombianas</p>
                        </div>
                    </div>
                </div>
            )}

            <div className={`flex-1 p-2 md:p-4 bg-gradient-to-b from-[#0a0800] via-[#0d0d0d] to-[#0a0800] custom-scrollbar relative ${!hasInteracted ? 'overflow-hidden flex flex-col justify-start items-center h-full' : 'overflow-y-auto space-y-6'}`}>
                {!hasInteracted ? (
                    <div className="flex flex-col items-center text-center space-y-2 animate-fade-in w-full max-w-5xl pt-1 md:pt-2">
                        <div className="w-full flex justify-center max-h-[45vh] md:max-h-[450px]">
                            <img
                                src="/Abogado-Eddu-AI.png"
                                alt="Abogado Eddu-AI"
                                className="h-full w-auto object-contain drop-shadow-[0_0_30px_rgba(212,175,55,0.1)] rounded-2xl md:rounded-3xl"
                            />
                        </div>
                        <div className="space-y-1 px-4">
                            <h2 className="text-xl md:text-2xl font-serif font-bold text-white tracking-tight">
                                Consultoría Jurídica Virtual <span className="text-[#d4af37]">Eddu-AI</span>
                            </h2>
                            <p className="text-xs md:text-base text-gray-300 font-light max-w-xl mx-auto leading-relaxed">
                                ¡Pláceme saludarte ala mi vecy! Soy <strong className="text-[#d4af37] font-bold">Eddu-AI</strong>, tu Abogado Digital de VECY.
                            </p>
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
                                <div className={`max-w-[95%] md:max-w-[90%] rounded-2xl p-4 ${msg.type === 'user'
                                    ? 'bg-gradient-to-br from-[#2a1f00] to-[#1a1400] border border-[#d4af37]/40 text-[#FFF5CC] rounded-tr-none shadow-[0_2px_12px_rgba(212,175,55,0.15)]'
                                    : 'bg-gradient-to-br from-[#161410] to-[#0e0c0a] border border-[#bf953f]/35 text-gray-100 rounded-tl-none shadow-[0_2px_16px_rgba(191,149,63,0.12)]'
                                    }`}>
                                    <div className="text-[15px] leading-relaxed whitespace-pre-line font-light">
                                        {msg.type === 'bot' && index === messages.length - 1 ? (
                                            <TypewriterText text={msg.text} />
                                        ) : (
                                            <FormatText text={msg.text} />
                                        )}
                                    </div>

                                    {msg.files && msg.files.length > 0 && (
                                        <div className="mt-3 flex flex-wrap gap-2 pt-2 border-t border-white/10">
                                            {msg.files.map((file, fIdx) => (
                                                <div key={fIdx} className="flex items-center gap-2 bg-black/40 px-3 py-2 rounded-lg border border-[#d4af37]/30 text-[11px] text-[#d4af37]">
                                                    {file.mimeType?.startsWith('image/') ? (
                                                        <ImageIcon className="w-4 h-4" />
                                                    ) : (
                                                        <FileText className="w-4 h-4" />
                                                    )}
                                                    <span className="truncate max-w-[120px]">{file.name}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </>
                )}
                {isTyping && (
                    <div className="flex justify-start">
                        <div className="bg-gradient-to-br from-[#161410] to-[#0e0c0a] px-6 py-4 rounded-2xl rounded-tl-none border border-[#d4af37]/40 flex items-center gap-3 shadow-[0_2px_16px_rgba(212,175,55,0.12)]">
                            <div className="flex space-x-1">
                                <div className="w-2 h-2 bg-[#d4af37] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                <div className="w-2 h-2 bg-[#d4af37] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                <div className="w-2 h-2 bg-[#d4af37] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="p-4 bg-[#1c1c1c] border-t border-[#333]">
                <div className="max-w-4xl mx-auto relative flex flex-col bg-black border border-[#333] rounded-2xl focus-within:border-[#d4af37]/50 focus-within:shadow-[0_0_15px_rgba(212,175,55,0.1)] transition-all overflow-hidden group">
                    {/* Attached Files Preview */}
                    {attachedFiles.length > 0 && (
                        <div className="flex flex-wrap gap-2 p-3 border-b border-[#333] bg-[#0a0a0a]">
                            {attachedFiles.map(file => (
                                <div key={file.id} className="relative flex items-center gap-2 bg-[#1c1c1c] border border-[#d4af37]/30 px-2 py-1.5 rounded-md text-[10px] text-gray-300">
                                    <div className="w-3 h-3 text-[#d4af37]">
                                        {file.mimeType?.startsWith('image/') ? <ImageIcon className="w-3 h-3" /> : <FileText className="w-3 h-3" />}
                                    </div>
                                    <span className="max-w-[80px] truncate">{file.name}</span>
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
                        placeholder="Chatea o Habla con tu Abogado Eddu-AI. Obtén respuestas jurídicas precisas en segundos."
                        className="w-full bg-transparent px-5 pt-5 pb-2 text-sm text-gray-200 placeholder-gray-600 focus:outline-none resize-none min-h-[60px] max-h-[250px] custom-scrollbar leading-relaxed"
                        rows={1}
                    />

                    {/* Bottom Control Bar */}
                    <div className="flex items-center justify-between px-3 pb-3 pt-1">
                        <div className="flex items-center gap-1">
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png,.webp,.gif,.doc,.docx" multiple
                                onChange={handleFileAttach}
                                className="hidden"
                            />
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="p-2 text-gray-500 hover:text-gray-300 transition-colors"
                            >
                                <Plus className="w-5 h-5" />
                            </button>

                            <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg hover:bg-gray-800/30 transition-colors cursor-pointer group/model">
                                <div className="relative flex items-center justify-center">
                                    <div className="w-2.5 h-2.5 bg-[#10b981] rounded-full shadow-[0_0_8px_#10b981]"></div>
                                    <div className="absolute inset-0 w-2.5 h-2.5 bg-[#10b981] rounded-full animate-ping opacity-75"></div>
                                </div>
                                <span className="text-[11px] font-medium text-gray-400 group-hover/model:text-gray-300 transition-colors tracking-wide">Eddu-AI Flash v4.0</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-1">
                            <button className="p-2 text-gray-500 hover:text-gray-300 transition-colors mr-1">
                                <Mic className="w-5 h-5" />
                            </button>
                            <button
                                onClick={handleSend}
                                disabled={isTyping || (!input.trim() && attachedFiles.length === 0)}
                                className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 ${(!input.trim() && attachedFiles.length === 0)
                                    ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
                                    : 'bg-[#d4af37] text-black hover:scale-110 active:scale-95 shadow-[0_0_12px_rgba(212,175,55,0.45)]'
                                    }`}
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
                <p className="text-[10px] text-gray-600 mt-2 text-center w-full">
                    Consultoría Jurídica Virtual Eddu-AI • Blindaje Probatorio Digital
                </p>
            </div>
        </div>
    );
};

export default EdduAIChat;
