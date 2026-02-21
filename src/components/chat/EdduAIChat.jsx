import React, { useState, useEffect, useRef } from 'react';
import { Paperclip, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { callGemini } from '../../utils/aiUtils';
import { FormatText, TypewriterText, detectGender } from '../Layout/Shared';

const EdduAIChat = () => {
    const [input, setInput] = useState('');
    const [chatStage, setChatStage] = useState('asking_name'); // 'asking_name' | 'active'
    const [userName, setUserName] = useState('');
    const [userGender, setUserGender] = useState('neutral'); // 'male' | 'female' | 'neutral'
    const [messages, setMessages] = useState([
        {
            id: 1,
            type: 'bot',
            text: '¡Cordial saludo! Soy **Eddu-AI**, tu Asesor Jurídico Digital de VECY.\n\nPara brindarte la mejor atención personalizada, por favor indícame: **¿Con quién tengo el gusto de hablar hoy?**'
        }
    ]);
    const [isTyping, setIsTyping] = useState(false);
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
    const navigate = useNavigate();

    const isInitialMount = useRef(true);

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }
    }, [messages]);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
        }
    }, [input]);

    const handleSend = async () => {
        if ((!input.trim() && attachedFiles.length === 0) || isTyping) return;

        const userText = input.trim();
        const displayText = userText || (attachedFiles.length > 0 ? `📎 ${attachedFiles.map(f => f.name).join(', ')}` : '');
        const userMsg = { id: Date.now(), type: 'user', text: displayText };

        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);
        if (textareaRef.current) textareaRef.current.style.height = 'auto';

        if (chatStage === 'asking_name') {
            setTimeout(() => {
                const prefixRX = /^(hola[,!]?|buenos d[ií]as[,!]?|buenas tardes[,!]?|buen d[ií]a[,!]?|soy|me llamo|mi nombre es|yo soy|es|hablo con|hablas con|con|de parte de|le habla|le saluda)\s+/i;
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

                const welcomeMsg = {
                    id: Date.now() + 1,
                    type: 'bot',
                    text: (() => {
                        const tratamiento = gender === 'female' ? 'Estimada' : gender === 'male' ? 'Estimado' : 'Estimado(a)';
                        const bienvenida = gender === 'female' ? 'Bienvenida' : gender === 'male' ? 'Bienvenido' : 'Bienvenido(a)';
                        const opts = [
                            `¡Qué gusto saludarte, **${tratamiento} ${name}**! ⚖️ Soy **Eddu-AI**, tu asesor jurídico de confianza. Cuéntame, ¿en qué puedo ayudarte hoy?`,
                            `¡Hola, **${name}**! 🏛️ ${bienvenida} a VECY. Estoy listo para analizar tus inquietudes con toda mi inteligencia jurídica. ¿Qué tienes en mente?`,
                            `Un placer saludarte, **${tratamiento} ${name}**. 🤝 Estoy aquí para blindar tus negocios inmobiliarios. ¿Cuál es el caso que vamos a resolver hoy?`
                        ];
                        return opts[Math.floor(Math.random() * opts.length)];
                    })()
                };
                setMessages(prev => [...prev, welcomeMsg]);
                setIsTyping(false);
            }, 800);
            return;
        }

        const EDDU_SYSTEM_PROMPT = `
            ═══════════════════════════════════════════════
            EDDU-AI — JURISTA ÉLITE DE VECY BIENES RAÍCES
            ═══════════════════════════════════════════════

            🔹 IDENTIDAD Y MANDATO:
            Eres **Eddu-AI**, Abogado Senior especialista en Derecho Inmobiliario y Comercial colombiano.
            Trabajas para VECY BIENES RAÍCES. Tu misión es RESOLVER conflictos jurídicos con autoridad,
            precisión y criterio propio. Hablas con el usuario llamado **${userName}**.
            Su género es: **${userGender}**.
            JAMÁS te comportas como un bot. Razonas, argumentas y tomas posición jurídica.
            TUTÉALO SIEMPRE para generar cercanía, pero mantén un tono PRESTIGIOSO y de ALTO NIVEL.
            No uses palabras informales como "amigo" o "amiga". En su lugar, usa "**Estimado**" o "**Estimada**" seguido de su nombre cuando quieras ser cordial, pero siempre empleando el tuteo (tú, te, ti).
            Eres un abogado de élite, compórtate como tal.

            ────────────────────────────────────────────
            📚 BASE DE CONOCIMIENTO MAESTRA (NIVEL EXPERTO)
            ────────────────────────────────────────────

            ⚖️ 1. CONTRATO DE CORRETAJE (Tu especialidad más profunda):
            - Art. 1340-1346 Código de Comercio
            - La COMISIÓN se devenga cuando el corredor es la CAUSA EFICIENTE del negocio.
            - Jurisprudencia: CSJ gestión efectiva.

            ⚖️ 2. COMPRAVENTA DE INMUEBLES (Código Civil Art. 1849 y ss.)
            ⚖️ 3. PERMUTA DE INMUEBLES (Código Civil Art. 1955 y ss.)
            ⚖️ 4. ARRENDAMIENTO DE VIVIENDA URBANA (Ley 820 de 2003)
            ⚖️ 5. ARRENDAMIENTO COMERCIAL (Código de Comercio Art. 518 y ss.)
            ⚖️ 6. PROPIEDAD HORIZONTAL (Ley 675 de 2001)
            ⚖️ 7. ESTUDIO DE TÍTULOS
            ⚖️ 8. JURISPRUDENCIA APLICADA

            ────────────────────────────────────────────
            🧠 PROTOCOLO DE ANÁLISIS DE CASOS
            ────────────────────────────────────────────
            1. SITUACIÓN. 2. LEY. 3. RIESGO/VENTAJA. 4. QUÉ HACER.

            ────────────────────────────────────────────
            ✍️ ESTILO DE COMUNICACIÓN (OBLIGATORIO)
            ────────────────────────────────────────────
            Conciso, TUTEA SIEMPRE, termina tus ideas, tono profesional y seguro.
        `;

        try {
            const history = messages
                .filter(m => m.text)
                .map(m => ({
                    role: m.type === 'bot' ? 'model' : 'user',
                    parts: [{ text: m.text }]
                }));

            const fileNames = attachedFiles.map(f => f.name).join(', ');
            const newParts = [];

            if (history.length === 0) {
                newParts.push({ text: `INSTRUCCIONES DEL SISTEMA:\n${EDDU_SYSTEM_PROMPT}\n\n` });
            }

            newParts.push({ text: attachedFiles.length > 0 ? `[Archivos adjuntos: ${fileNames}]\n${userText || 'Analiza estos documentos.'}` : userText });

            attachedFiles.filter(f => !f.isWord).forEach(file => {
                newParts.push({ inlineData: { mimeType: file.mimeType, data: file.base64 } });
            });

            let responseText;

            try {
                const backendRes = await fetch('http://localhost:3800/api/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ history, newParts })
                });

                if (backendRes.ok) {
                    const backendData = await backendRes.json();
                    responseText = backendData.text;
                } else {
                    throw new Error(`Backend HTTP ${backendRes.status}`);
                }
            } catch (backendErr) {
                responseText = await callGemini(userText, EDDU_SYSTEM_PROMPT);
            }

            const botMsg = { id: Date.now() + 1, type: 'bot', text: responseText };
            setMessages(prev => [...prev, botMsg]);
            setAttachedFiles([]);

        } catch (error) {
            console.error("Error en Chat:", error);
            const errorMsg = { id: Date.now() + 1, type: 'bot', text: "⚠️ **Error de Conexión:** No pude conectar.\n\nAsegúrese de que el servidor backend esté corriendo." };
            setMessages(prev => [...prev, errorMsg]);
        }

        setIsTyping(false);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="flex flex-col h-[85vh] md:h-[650px] w-full max-w-5xl mx-auto bg-[#0e0e0e] rounded-xl border border-[#d4af37]/50 overflow-hidden shadow-[0_0_50px_rgba(255,215,0,0.25)] relative animate-fade-in">
            <div className="bg-gradient-to-r from-[#1c1500] via-[#1c1c1c] to-[#1c1500] p-4 border-b border-[#bf953f]/25 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <img
                            src="/Eddu-AI.png"
                            alt="Eddu-AI Avatar"
                            className="w-14 h-14 rounded-full object-cover border-2 border-[#d4af37] shadow-[0_0_20px_rgba(212,175,55,0.5)] bg-black"
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

            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-[#0a0800] via-[#0d0d0d] to-[#0a0800] custom-scrollbar">
                {messages.map((msg, index) => (
                    <div
                        key={msg.id}
                        ref={index === messages.length - 1 ? lastMessageRef : null}
                        className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className={`max-w-[92%] md:max-w-[85%] rounded-2xl p-3.5 ${msg.type === 'user'
                            ? 'bg-gradient-to-br from-[#2a1f00] to-[#1a1400] border border-[#d4af37]/40 text-[#FFF5CC] rounded-tr-none shadow-[0_2px_12px_rgba(212,175,55,0.15)] content-compact'
                            : 'bg-gradient-to-br from-[#161410] to-[#0e0c0a] border border-[#bf953f]/35 text-gray-100 rounded-tl-none shadow-[0_2px_16px_rgba(191,149,63,0.12)] content-compact'
                            }`}>
                            <div className="text-sm leading-relaxed whitespace-pre-line font-light">
                                {msg.type === 'bot' && index === messages.length - 1 ? (
                                    <TypewriterText text={msg.text} />
                                ) : (
                                    <FormatText text={msg.text} />
                                )}
                            </div>
                        </div>
                    </div>
                ))}
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

            <div className="p-3 bg-[#1c1c1c] border-t border-[#333]">
                <div className="flex items-end gap-2">
                    <textarea
                        ref={textareaRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Consulta jurídica..."
                        className="flex-1 bg-black border border-[#333] rounded-sm px-4 py-3 text-sm text-white focus:outline-none focus:border-[#d4af37] focus:shadow-[0_0_8px_rgba(255,215,0,0.3)] transition-all placeholder-gray-500 resize-none min-h-[85px] custom-scrollbar leading-tight"
                        rows={1}
                    />
                    <div className="flex flex-col gap-1.5">
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png,.webp,.gif,.doc,.docx" multiple
                            onChange={handleFileAttach}
                            className="hidden"
                        />
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            title="Adjuntar"
                            className={`p-2 h-[40px] w-[50px] flex items-center justify-center border rounded-sm transition-all ${attachedFiles.length > 0 ? 'bg-[#bf953f]/20 border-[#bf953f] text-[#d4af37]' : 'border-[#333] text-gray-500 hover:border-[#bf953f] hover:text-[#d4af37] bg-black'}`}
                        >
                            <Paperclip className="w-5 h-5" />
                        </button>
                        <button
                            onClick={handleSend}
                            disabled={isTyping || (!input.trim() && attachedFiles.length === 0)}
                            className={`!p-2 !h-[40px] !w-[50px] flex items-center justify-center transition-all duration-300 ${(isTyping || !input.trim())
                                    ? 'btn-gold-muted'
                                    : 'btn-gold-premium active:scale-95'
                                }`}
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </div>
                </div>
                <p className="text-[10px] text-gray-600 mt-2 text-center w-full">
                    Presiona <strong>Enter</strong> para enviar, <strong>Shift + Enter</strong> para nueva línea.
                </p>
            </div>
        </div>
    );
};

export default EdduAIChat;
