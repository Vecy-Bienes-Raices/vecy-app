import React, { useState, useEffect, useRef } from 'react';
import {
    Shield, Mail, MessageCircle, Scale, CheckCircle, AlertTriangle,
    FileText, Lock, ChevronDown, Smartphone, BookOpen, Award,
    ArrowLeft, Server, UserCheck, Send, Bot, Sparkles, Copy, Loader,
    HelpCircle, AlertOctagon, FileCheck, Gavel, WifiOff, GraduationCap,
    XCircle, Check
} from 'lucide-react';

// --- CONFIGURACIÓN Y CEREBRO DE RESPALDO (FALLBACK) ---
const apiKey = import.meta.env.VITE_GOOGLE_API_KEY || "";

// SUPER PROMPT DE SISTEMA VECY (Identidad del Agente)
const SYSTEM_PROMPT = `Eres el Agente de IA Senior de VECY BIENES RAÍCES.
Rol: Consultor experto en Derecho Inmobiliario Digital y Tecnología.
Tono: Profesional, ágil, jurídico, visionario y altamente tecnológico. Habla siempre en plural ("Nosotros", "Somos VECY").
Misión: Promover procesos 100% digitales, cero papel y protección ambiental.

Base de Conocimiento:
1. Ley 527 de 1999: Validez de mensajes de datos y firma electrónica.
2. Ley 1581 de 2012: Protección de datos (Habeas Data).
3. Protocolo MailSuite: Certificación de correos para trazabilidad.
4. Corretaje: Defensa de la comisión.

Reglas Estrictas:
- Cuando uses términos clave importantes, enciérralos entre asteriscos dobles (ej: **Prueba Plena**) para que se resalten en dorado.
- PROHIBIDO sugerir procesos físicos (papel, impresiones, vallas).
- Promueve siempre el Correo Electrónico Certificado como único medio de blindaje legal.
`;

const localKnowledgeBase = {
    whatsapp: `⚠️ **ALERTA JURÍDICA VECY SOBRE WHATSAPP**\n\nColega, usar WhatsApp para cerrar negocios es un riesgo patrimonial alto. Razones técnicas:\n\n1. **Volatilidad:** Los mensajes pueden ser "Editados" o "Eliminados para todos". Esto rompe la cadena de custodia de la prueba.\n2. **Mensajes Efímeros:** Si activan la autodestrucción, pierdes la evidencia en 24h.\n3. **Costo Procesal:** Para que un juez acepte un chat impugnado, debes pagar un perito informático forense (costoso y lento).\n\n✅ **Solución:** Usa WhatsApp para la logística ("ya llegué"), pero formaliza la oferta y el cierre SIEMPRE por correo electrónico.`,

    correo: `🛡️ **EL PODER DEL CORREO ELECTRÓNICO (LEY 527)**\n\nEl correo es tu seguro de vida inmobiliario. Bajo la Ley 527 de 1999:\n\n1. **Prueba Plena:** Es un "Mensaje de Datos" con plena validez jurídica.\n2. **Inmutabilidad:** Una vez enviado, queda grabado en los servidores. Nadie puede editarlo unilateralmente.\n3. **Trazabilidad:** Los encabezados (headers) prueban origen y destino.\n\n💡 **Tip VECY:** Si el cliente responde "Ok" a tu correo de honorarios, el contrato de corretaje se considera perfeccionado legalmente.`,

    cobro: `💰 **CÓMO COBRAR SIN CONTRATO FÍSICO**\n\nSi no firmaste papel, acude a la "Confesión Presunta" vía digital:\n\n1. Reúne la trazabilidad: Correos de presentación del cliente, confirmación de cita y envío de oferta.\n2. Si usaste **MailSuite**, adjunta el certificado de apertura.\n3. Redacta una "Cuenta de Cobro con Preaviso Jurídico" citando el Art. 864 del Código de Comercio (oferta aceptada tácitamente).\n\n¿Quieres que te redacte el correo de cobro? Ve a la sección de Herramientas.`,

    default: `Somos **VECY BIENES RAÍCES**. 🏛️\nUna firma pionera en **Agilidad Digital** y **Robustez Jurídica**.\n\nEstamos operando en **Modo de Respaldo Seguro**. Podemos orientarte sobre:\n\n• **La Trampa de la Inmediatez:** Riesgos de WhatsApp vs Seguridad del Email.\n• **Acervo Probatorio:** Cómo convertir comunicaciones en pruebas irrefutables.\n• **Sostenibilidad:** Procesos 100% libres de papel.\n\nIndícanos, ¿por cuál ruta de aprendizaje deseas comenzar hoy?`
};

const localDocumentTemplates = {
    presentacion: `ASUNTO: **PRESENTACIÓN FORMAL DE CLIENTE Y ACUERDO DE COMISIÓN** - [Dirección Inmueble]\n\nEstimado(a) Propietario(a),\n\nActuando en calidad de asesor profesional de **VECY BIENES RAÍCES**, presento formalmente a mi cliente, el Sr(a). [NOMBRE CLIENTE], interesado en su inmueble ubicado en [DIRECCIÓN].\n\nConfirmamos que la visita está programada para [FECHA/HORA].\n\n**CONDICIONES DEL CORRETAJE:**\nEn caso de concretarse la venta/arriendo con este cliente (o sus relacionados), se reconocerán los honorarios profesionales pactados del **[3% / UN CANON]** a favor de mi firma.\n\n**CLÁUSULA DE VALIDEZ DIGITAL:**\nEste mensaje constituye un acuerdo vinculante. La aceptación de la visita implica la aceptación de las condiciones aquí descritas, conforme a la **Ley 527 de 1999** sobre validez de mensajes de datos.\n\nCordialmente,\n\n[TU NOMBRE]\nAgente VECY BIENES RAÍCES`,

    cobro: `ASUNTO: **RECLAMACIÓN PREJURÍDICA DE HONORARIOS** - INMUEBLE [DIRECCIÓN]\n\nRespetados señores,\n\nMe dirijo a ustedes para solicitar el pago de la comisión derivada de la venta del inmueble de la referencia, perfeccionada con el cliente [NOMBRE] presentado por mi gestión.\n\n**HECHOS:**\n1. El día [FECHA], presenté al cliente vía correo electrónico (ver anexo).\n2. Se realizó la visita con su autorización.\n3. El negocio se cerró por valor de [VALOR].\n\n**FUNDAMENTO JURÍDICO:**\nSegún el **Código de Comercio** y la **Ley 527 de 1999**, existe un contrato de corretaje perfeccionado por el intercambio de mensajes de datos y la gestión efectiva.\n\nSolicito el pago inmediato para evitar el traslado de este cobro a la instancia judicial.\n\nAtentamente,\n\n[TU NOMBRE]\nDepartamento Jurídico`
};

const callGemini = async (prompt, systemInstruction) => {
    const delay = ms => new Promise(res => setTimeout(res, ms));
    await delay(1500);

    try {
        if (!apiKey) throw new Error("No API Key");

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    systemInstruction: { parts: [{ text: systemInstruction }] },
                }),
            }
        );

        if (!response.ok) throw new Error("API Connection Failed");
        const data = await response.json();
        return data.candidates?.[0]?.content?.parts?.[0]?.text;

    } catch (error) {
        const lowerPrompt = prompt.toLowerCase();

        if (systemInstruction.includes("un DOCUMENTO")) {
            if (lowerPrompt.includes("cobro")) return localDocumentTemplates.cobro;
            return localDocumentTemplates.presentacion;
        }

        if (lowerPrompt.includes("whatsapp")) return localKnowledgeBase.whatsapp;
        if (lowerPrompt.includes("correo") || lowerPrompt.includes("email")) return localKnowledgeBase.correo;
        if (lowerPrompt.includes("cobrar")) return localKnowledgeBase.cobro;

        return localKnowledgeBase.default;
    }
};

// --- UTILS ---
// Componente para renderizar texto enriquecido (Bold Dorado)
const FormatText = ({ text }) => {
    if (!text) return null;
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return (
        <span>
            {parts.map((part, index) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                    return (
                        <strong key={index} className="text-[#bf953f] font-bold">
                            {part.slice(2, -2)}
                        </strong>
                    );
                }
                return part;
            })}
        </span>
    );
};

// --- COMPONENTES ---

const EdduAIChat = () => {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([
        {
            id: 1,
            type: 'bot',
            text: '¡Saludos, colega! Soy Eddu-AI, Abogado Senior en **Derecho Inmobiliario Digital**. ⚖️\n\nMi misión es **blindar tu patrimonio**. Pregúntame sobre:\n\n• Por qué **WhatsApp** es un riesgo jurídico.\n• **Ley 527 de 1999** y validez del correo.\n• Cómo cobrar comisiones sin **contrato físico**.'
        }
    ]);
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = { id: Date.now(), type: 'user', text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        const responseText = await callGemini(userMsg.text, SYSTEM_PROMPT);

        const botMsg = { id: Date.now() + 1, type: 'bot', text: responseText };
        setMessages(prev => [...prev, botMsg]);
        setIsTyping(false);
    };

    return (
        <div className="flex flex-col h-[85vh] md:h-[650px] w-full max-w-5xl mx-auto bg-[#0e0e0e] rounded-xl border border-[#d4af37]/50 overflow-hidden shadow-[0_0_50px_rgba(255,215,0,0.25)] relative animate-fade-in">
            {/* HEADER DEL CHAT */}
            <div className="bg-[#1c1c1c] p-4 border-b border-[#333] flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <img
                            src="https://static.wixstatic.com/media/334454_0c2cde563d9d4bda967891c348875d22~mv2.png"
                            alt="Eddu-AI Avatar"
                            className="w-14 h-14 rounded-full object-cover border-2 border-[#bf953f] shadow-[0_0_15px_rgba(191,149,63,0.3)] bg-black"
                        />
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#10b981] rounded-full border-2 border-[#1c1c1c]"></div>
                    </div>
                    <div>
                        <h3 className="text-white font-bold text-lg flex items-center gap-2 font-serif">
                            Eddu-AI <span className="text-[10px] bg-[#bf953f]/20 text-[#bf953f] px-2 py-0.5 rounded-full border border-[#bf953f]/30 font-sans tracking-wide">ABOGADO SENIOR</span>
                        </h3>
                        <p className="text-[#d4af37] text-xs uppercase tracking-widest">Inteligencia Jurídica VECY</p>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-black/80 custom-scrollbar">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] rounded-2xl p-5 ${msg.type === 'user'
                            ? 'bg-[#1c1c1c] border border-[#333] text-gray-200 rounded-tr-none shadow-lg'
                            : 'bg-gradient-to-br from-[#111] to-[#000] border border-[#bf953f]/30 text-gray-100 rounded-tl-none shadow-lg'
                            }`}>
                            <p className="text-sm leading-relaxed whitespace-pre-line font-light">
                                <FormatText text={msg.text} />
                            </p>
                        </div>
                    </div>
                ))}
                {isTyping && (
                    <div className="flex justify-start">
                        <div className="bg-[#111] px-6 py-4 rounded-2xl rounded-tl-none border border-[#bf953f]/30 flex items-center gap-3">
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

            <div className="p-5 bg-[#1c1c1c] border-t border-[#333]">
                <div className="flex items-center gap-3">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Pregunta ej: ¿Qué dice la Ley 527 sobre el email?"
                        className="flex-1 bg-black border border-[#333] rounded-sm px-6 py-4 text-sm text-white focus:outline-none focus:border-[#bf953f] transition-colors placeholder-gray-600"
                    />
                    <button
                        onClick={handleSend}
                        disabled={isTyping}
                        className={`p-4 bg-gradient-to-r from-[#bf953f] to-[#aa771c] rounded-sm text-black hover:scale-105 transition-transform shadow-[0_0_15px_rgba(191,149,63,0.3)] ${isTyping ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

// VISTA ACADEMIA MEJORADA Y ROBUSTA
const CourseView = ({ onBack }) => {
    const [activeModule, setActiveModule] = useState(null);

    const modules = [
        {
            id: 'ley527',
            title: "Módulo 1: La Defensa Legal (Ley 527/99) ⚖️",
            icon: Scale,
            content: "Fundamentos de la validez jurídica del Mensaje de Datos.",
            detail: (
                <div className="space-y-8 animate-fade-in">
                    <div className="border-l-4 border-[#d4af37] pl-6">
                        <h3 className="text-2xl font-serif text-white mb-2">Equivalencia Funcional</h3>
                        <p className="text-gray-400 italic">"Cuando cualquier norma requiera que la información conste por escrito, ese requisito quedará satisfecho con un Mensaje de Datos..." (Art. 6, Ley 527).</p>
                    </div>

                    <div className="grid gap-6">
                        <h4 className="text-white font-bold uppercase tracking-widest text-sm border-b border-gray-800 pb-2">Conceptos Críticos</h4>
                        <div className="bg-[#1a1a1a] p-6 rounded-sm border border-[#333]">
                            <strong className="text-white block mb-2">1. Integridad del Mensaje (Art. 9)</strong>
                            <p className="text-sm text-gray-400 leading-relaxed">Se considera que la información está completa y inalterada desde su generación definitiva. Un correo en servidor (IMAP/Exchange) es técnicamente inalterable por el usuario promedio, a diferencia de un chat de WhatsApp local.</p>
                        </div>
                        <div className="bg-[#1a1a1a] p-6 rounded-sm border border-[#333]">
                            <strong className="text-white block mb-2">2. Admisibilidad Probatoria (Art. 10)</strong>
                            <p className="text-sm text-gray-400 leading-relaxed">Los jueces NO pueden negar eficacia o fuerza obligatoria a un mensaje por el solo hecho de ser digital. Es prueba plena si se garantiza su confiabilidad técnica.</p>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: 'trazabilidad',
            title: "Módulo 2: Certificación Técnica 📧",
            icon: Shield,
            content: "Protocolos de auditoría forense digital con MailSuite.",
            detail: (
                <div className="space-y-8 animate-fade-in">
                    <div className="bg-[#0a0a0a] p-6 border border-[#bf953f] rounded-sm shadow-[0_0_20px_rgba(191,149,63,0.1)]">
                        <h3 className="text-xl font-bold text-white mb-4">La Cadena de Custodia Digital</h3>
                        <p className="text-gray-300 mb-4">Para que un correo sea "Prueba Reina", debe certificar 3 momentos:</p>
                        <ul className="space-y-3 text-sm">
                            <li className="flex items-center gap-3"><CheckCircle className="text-green-500 w-4 h-4" /> <span className="text-white">Envío Exitoso:</span> Salida del servidor SMTP.</li>
                            <li className="flex items-center gap-3"><CheckCircle className="text-green-500 w-4 h-4" /> <span className="text-white">Recepción en Servidor:</span> El servidor del cliente (Gmail/Outlook) aceptó el mensaje.</li>
                            <li className="flex items-center gap-3"><CheckCircle className="text-[#bf953f] w-4 h-4" /> <span className="text-white">Interacción (Pixel Tracker):</span> Fechas exactas de apertura, clic o descarga de adjuntos.</li>
                        </ul>
                    </div>
                    <p className="text-gray-400 text-sm">
                        <strong className="text-white">Diferencia Clave:</strong> WhatsApp solo muestra "Leído" (Check Azul) que puede desactivarse. MailSuite genera un <strong>Certificado Técnico</strong> externo con IP y timestamp inalterable.
                    </p>
                </div>
            )
        },
        {
            id: 'conducta',
            title: "Módulo 3: Conducta Concluyente 🤝",
            icon: UserCheck,
            content: "Perfeccionamiento del contrato sin firma autógrafa.",
            detail: (
                <div className="space-y-6 animate-fade-in">
                    <h3 className="text-white font-bold text-xl">¿Cómo cerrar el contrato sin papel?</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                        El Código de Comercio permite el perfeccionamiento del contrato por "Conducta Concluyente". Si envías una oferta (Correo de Presentación) y el cliente ejecuta actos inequívocos de aceptación (permitir visita, recibir documentos), el contrato nace a la vida jurídica.
                    </p>
                    <div className="bg-[#1c1c1c] p-5 border-l-2 border-[#10b981]">
                        <h5 className="text-[#10b981] font-bold mb-2">Jurisprudencia VECY</h5>
                        <p className="text-xs text-gray-300">"El silencio no es aceptación, pero la acción sí lo es." Siempre envía el correo ANTES de la visita para que la acción de permitir el ingreso ratifique las condiciones.</p>
                    </div>
                </div>
            )
        }
    ];

    return (
        <div className="min-h-screen pt-24 px-6 pb-12 animate-fade-in w-full bg-[#050505]">
            <button onClick={onBack} className="flex items-center text-[#d4af37] mb-8 hover:text-white transition-colors"><ArrowLeft className="w-5 h-5 mr-2" /> Volver al Inicio</button>
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <div className="inline-block p-3 rounded-full bg-[#111] mb-4 border border-[#333]"><GraduationCap className="w-8 h-8 text-[#bf953f]" /></div>
                    <h1 className="text-4xl font-serif font-bold text-white mb-4">Academia Jurídica VECY</h1>
                    <p className="text-gray-500 max-w-2xl mx-auto">Formación especializada en **Blindaje Probatorio Digital**.</p>
                </div>

                <div className="grid lg:grid-cols-12 gap-8">
                    {/* Navigation List */}
                    <div className="lg:col-span-4 space-y-4">
                        {modules.map((mod) => (
                            <div
                                key={mod.id}
                                onClick={() => setActiveModule(mod)}
                                className={`p-6 rounded-sm border transition-all cursor-pointer relative overflow-hidden group ${activeModule?.id === mod.id ? 'bg-[#1c1c1c] border-[#bf953f]' : 'bg-[#111] border-[#333] hover:border-gray-500'}`}
                            >
                                <div className={`absolute left-0 top-0 bottom-0 w-1 ${activeModule?.id === mod.id ? 'bg-[#bf953f]' : 'bg-transparent group-hover:bg-gray-700'}`}></div>
                                <div className="flex items-start gap-4">
                                    <mod.icon className={`w-6 h-6 mt-1 flex-shrink-0 ${activeModule?.id === mod.id ? 'text-[#bf953f]' : 'text-gray-500'}`} />
                                    <div>
                                        <h3 className={`font-bold text-lg mb-2 ${activeModule?.id === mod.id ? 'text-[#bf953f]' : 'text-gray-300'}`}>{mod.title}</h3>
                                        <p className="text-xs text-gray-500 leading-relaxed">{mod.content}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Content Detail */}
                    <div className="lg:col-span-8 bg-[#111] border border-[#333] p-10 rounded-sm min-h-[500px] shadow-2xl">
                        {activeModule ? (
                            <>
                                <div className="absolute top-0 right-0 p-4 opacity-10"><activeModule.icon className="w-32 h-32 text-white" /></div>
                                <div>{activeModule.detail}</div>
                            </>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-gray-600 opacity-50">
                                <BookOpen className="w-20 h-20 mb-6" />
                                <h3 className="text-xl font-bold mb-2">Selecciona un Módulo</h3>
                                <p>Comienza tu ruta de aprendizaje jurídico</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const EmailGeneratorView = ({ onBack }) => {
    const [topic, setTopic] = useState('');
    const [details, setDetails] = useState('');
    const [generatedEmail, setGeneratedEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleGenerate = async () => {
        if (!topic) return;
        setLoading(true);
        const systemPrompt = `Eres el Redactor Jurídico de VECY... cuando generes el documento, RESALTA las partes claves juridicas (como nombres, valores, leyes) usando doble asterisco **Texto** para que se vean dorados.`;
        const userPrompt = `Redactar documento sobre: ${topic}. Detalles: ${details}`;
        const result = await callGemini(userPrompt, systemPrompt);
        setGeneratedEmail(result);
        setLoading(false);
    };

    const copyToClipboard = () => navigator.clipboard.writeText(generatedEmail);

    return (
        <div className="min-h-screen pt-24 px-6 pb-12 animate-fade-in flex flex-col items-center w-full bg-[#050505]">
            <div className="w-full max-w-6xl flex justify-between items-center mb-8">
                <button onClick={onBack} className="flex items-center text-[#d4af37] hover:text-white transition-colors">
                    <ArrowLeft className="w-5 h-5 mr-2" /> Volver al Bufete
                </button>
                <div className="text-right hidden md:block">
                    <h2 className="text-2xl font-serif font-bold text-white flex items-center justify-end gap-2">
                        Redactor Jurídico VECY <Gavel className="w-5 h-5 text-[#bf953f]" />
                    </h2>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-10 w-full max-w-7xl">
                <div className="bg-[#1c1c1c] p-10 rounded-sm border border-[#333] h-fit">
                    <div className="mb-8">
                        <label className="block text-[#d4af37] text-xs font-bold uppercase tracking-widest mb-3">Trámite Legal</label>
                        <select
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            className="w-full bg-black border border-[#333] rounded-sm p-4 text-white focus:border-[#bf953f] outline-none text-sm"
                        >
                            <option value="">Seleccione...</option>
                            <option value="presentacion">Presentación Formal de Cliente</option>
                            <option value="cobro">Reclamación de Honorarios</option>
                        </select>
                    </div>
                    <div className="mb-8">
                        <label className="block text-[#d4af37] text-xs font-bold uppercase tracking-widest mb-3">Detalles</label>
                        <textarea
                            value={details}
                            onChange={(e) => setDetails(e.target.value)}
                            className="w-full bg-black border border-[#333] rounded-sm p-4 text-white h-64 focus:border-[#bf953f] outline-none resize-none text-sm"
                        />
                    </div>
                    <button
                        onClick={handleGenerate}
                        disabled={loading || !topic}
                        className="w-full py-5 font-bold text-black uppercase tracking-widest rounded-sm bg-gradient-to-r from-[#bf953f] to-[#aa771c] hover:scale-[1.01] transition-transform"
                    >
                        {loading ? 'Redactando...' : 'Generar Documento'}
                    </button>
                </div>

                <div className="bg-[#111] p-10 rounded-sm border border-[#333] relative min-h-[600px] flex flex-col shadow-2xl">
                    <div className="absolute top-0 right-0 p-6">
                        <button onClick={copyToClipboard} className="text-gray-400 hover:text-[#d4af37]"><Copy className="w-6 h-6" /></button>
                    </div>
                    <h3 className="text-white font-serif font-bold mb-6 border-b border-[#333] pb-4">Vista Previa</h3>
                    {generatedEmail ? (
                        <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar">
                            <div className="whitespace-pre-line text-gray-300 text-sm leading-7 font-light font-serif">
                                {/* APLICANDO FORMAT TEXT AQUI */}
                                <FormatText text={generatedEmail} />
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-gray-600 opacity-40">
                            <Scale className="w-20 h-20 mb-6" />
                            <p className="text-center text-sm">Esperando instrucciones...</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// ... (LegalView, DataPolicyView, SupportView se mantienen igual) ...
const LegalView = ({ onBack }) => (
    <div className="min-h-screen pt-24 px-6 pb-12 animate-fade-in w-full bg-[#050505]">
        <button onClick={onBack} className="flex items-center text-[#d4af37] mb-8 hover:text-white transition-colors"><ArrowLeft className="w-5 h-5 mr-2" /> Volver</button>
        <div className="max-w-4xl mx-auto bg-[#1c1c1c] p-12 rounded-sm border border-[#333] shadow-2xl">
            <h1 className="text-3xl font-serif font-bold text-white mb-8 border-b border-[#333] pb-6 flex items-center gap-3"><Scale className="w-8 h-8 text-[#d4af37]" /> Aviso Legal</h1>
            <div className="space-y-8 text-gray-400 text-sm leading-7 text-justify"><p><strong>1. NATURALEZA DEL SERVICIO:</strong> VECY BIENES RAÍCES ofrece esta herramienta educativa sobre la Ley 527 de 1999.</p><p><strong>2. RESPONSABILIDAD:</strong> El uso de los documentos generados es responsabilidad exclusiva del agente.</p></div>
        </div>
    </div>
);

const DataPolicyView = ({ onBack }) => (
    <div className="min-h-screen pt-24 px-6 pb-12 animate-fade-in w-full bg-[#050505]">
        <button onClick={onBack} className="flex items-center text-[#d4af37] mb-8 hover:text-white transition-colors"><ArrowLeft className="w-5 h-5 mr-2" /> Volver</button>
        <div className="max-w-4xl mx-auto bg-[#1c1c1c] p-12 rounded-sm border border-[#333] shadow-2xl">
            <h1 className="text-3xl font-serif font-bold text-white mb-8 border-b border-[#333] pb-6 flex items-center gap-3"><Server className="w-8 h-8 text-[#10b981]" /> Política de Datos</h1>
            <div className="space-y-6 text-gray-400 text-sm leading-relaxed"><p>Cumplimiento de la <strong>Ley 1581 de 2012</strong>. VECY promueve una política de <strong>CERO PAPEL</strong>.</p></div>
        </div>
    </div>
);

const SupportView = ({ onBack }) => (
    <div className="min-h-screen pt-24 px-6 pb-12 animate-fade-in flex flex-col items-center w-full bg-[#050505]">
        <div className="w-full max-w-5xl flex justify-between items-center mb-8">
            <button onClick={onBack} className="flex items-center text-[#d4af37] hover:text-white transition-colors"><ArrowLeft className="w-5 h-5 mr-2" /> Volver al Inicio</button>
            <div className="text-right hidden md:block"><h2 className="text-2xl font-serif font-bold text-white">Bufete Jurídico Virtual</h2><p className="text-xs text-gray-500 uppercase tracking-widest">Consultoría Especializada VECY</p></div>
        </div>
        <EdduAIChat />
    </div>
);

const App = () => {
    const [scrolled, setScrolled] = useState(false);
    const [currentView, setCurrentView] = useState('home');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const changeView = (viewName) => {
        if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
        setCurrentView(viewName);
        setMobileMenuOpen(false); // Close mobile menu on view change
    };

    const scrollToSection = (id) => {
        if (currentView !== 'home') {
            changeView('home');
            setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 100);
        } else {
            document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
        }
        setMobileMenuOpen(false); // Close mobile menu on section scroll
    };

    const theme = {
        background: 'radial-gradient(circle at center, #1a1a1a 0%, #0a0a0a 60%, #000000 100%)',
        goldGradient: 'linear-gradient(135deg, #bf953f 0%, #fcf6ba 25%, #b38728 50%, #fbf5b7 75%, #aa771c 100%)',
        borderGold: '1px solid rgba(191, 149, 63, 0.4)'
    };

    const navItems = [
        { id: 'academy', label: 'Academia VECY', action: () => changeView('academy') },
        { id: 'mito', label: 'Riesgos de WhatsApp' },
        { id: 'ley', label: 'Marco Legal 527' },
        { id: 'estrategia', label: 'Blindaje VECY' },
        { id: 'herramientas', label: 'Herramientas' },
    ];

    return (
        <div className="min-h-screen font-sans text-gray-100 selection:bg-[#aa771c] selection:text-white" style={{ background: theme.background }}>
            <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fadeIn 0.5s ease-out forwards; }
        .custom-scrollbar::-webkit-scrollbar { width: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #111; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #333; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #bf953f; }
      `}</style>

            {/* NAVBAR */}
            <nav className={`fixed w-full z-50 transition-all duration-500 border-b ${scrolled ? 'bg-[#0a0a0a]/95 backdrop-blur-md border-[#333] shadow-lg' : 'bg-transparent border-transparent'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-24">
                        <div className="flex-shrink-0 flex items-center gap-4 cursor-pointer" onClick={() => changeView('home')}>
                            <div className="relative group">
                                <div className="absolute -inset-2 bg-[#bf953f] rounded-full opacity-20 blur-xl group-hover:opacity-40 transition duration-500"></div>
                                <img src="https://static.wixstatic.com/media/334454_10c140731ac145d49a2a43206655cd04~mv2.png" alt="VECY Logo" className="relative h-14 w-14 rounded-full bg-black z-10" />
                            </div>
                            <div className="hidden sm:block">
                                <span className="block font-serif text-2xl tracking-widest bg-clip-text text-transparent font-bold" style={{ backgroundImage: theme.goldGradient }}>VECY</span>
                                <span className="block text-xs text-[#d4af37] tracking-[0.3em] uppercase mt-1">Bienes Raíces</span>
                            </div>
                        </div>
                        <div className="hidden md:block">
                            <div className="ml-10 flex items-baseline space-x-8">
                                {navItems.map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={item.action ? item.action : () => scrollToSection(item.id)}
                                        className="text-gray-400 hover:text-white transition-colors duration-300 text-xs font-semibold uppercase tracking-[0.15em] py-2 border-b-2 border-transparent hover:border-[#bf953f]"
                                    >
                                        {item.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="-mr-2 flex md:hidden">
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                            >
                                <span className="sr-only">Open main menu</span>
                                {mobileMenuOpen ? (
                                    <X className="block h-6 w-6" aria-hidden="true" />
                                ) : (
                                    <Menu className="block h-6 w-6" aria-hidden="true" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {mobileMenuOpen && (
                    <div className="md:hidden absolute top-24 left-0 w-full bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-[#bf953f]/30 animate-fade-in z-40">
                        <div className="px-6 py-8 space-y-4">
                            <button onClick={() => changeView('home')} className="text-white block w-full text-left px-4 py-3 rounded-sm border-l-2 border-[#bf953f] bg-white/5 font-serif text-lg tracking-wide">Inicio</button>
                            <button onClick={() => changeView('academy')} className="text-gray-300 hover:text-white block w-full text-left px-4 py-3 text-base">Academia VECY</button>
                            <button onClick={() => scrollToSection('mito')} className="text-gray-300 hover:text-white block w-full text-left px-4 py-3 text-base">Riesgos WhatsApp</button>
                            <button onClick={() => scrollToSection('ley')} className="text-gray-300 hover:text-white block w-full text-left px-4 py-3 text-base">Marco Legal</button>
                            <button onClick={() => scrollToSection('herramientas')} className="text-gray-300 hover:text-white block w-full text-left px-4 py-3 text-base">Herramientas</button>
                        </div>
                    </div>
                )}
            </nav>

            {currentView === 'home' && (
                <>
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
                                <button onClick={() => changeView('academy')} className="relative px-8 py-4 text-sm font-bold text-black uppercase tracking-widest rounded-sm transition-all duration-300 hover:scale-105 shadow-[0_0_25px_rgba(191,149,63,0.4)]" style={{ backgroundImage: theme.goldGradient }}>Iniciar Curso</button>
                                <button onClick={() => scrollToSection('estrategia')} className="text-[#d4af37] hover:text-white flex items-center gap-2 text-sm font-semibold tracking-widest transition-colors uppercase border-b border-[#333] pb-1 hover:border-white">Ver Estrategia VECY <ChevronDown className="w-4 h-4" /></button>
                            </div>
                        </div>
                    </section>

                    {/* TABLE COMPARISON SECTION (ROBUSTA) */}
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
                                <div className="min-w-[800px] bg-[#111] rounded-sm border border-[#333] shadow-2xl">
                                    {/* HEADER TABLA */}
                                    <div className="grid grid-cols-3 divide-x divide-[#2d2d2d] bg-[#1c1c1c] border-b border-[#333] text-sm font-bold tracking-widest uppercase">
                                        <div className="text-gray-500 flex items-center gap-2 p-6"><Scale className="w-4 h-4" /> Variable Jurídica</div>
                                        <div className="text-red-500 flex items-center gap-2 p-6"><AlertTriangle className="w-4 h-4" /> WhatsApp / Chats</div>
                                        <div className="text-[#bf953f] flex items-center gap-2 p-6"><Shield className="w-4 h-4" /> Correo Certificado</div>
                                    </div>

                                    {/* ROWS */}
                                    {[
                                        { title: "Integridad (Art. 9)", chat: "Modificable por ambas partes. Se puede 'Eliminar para todos'.", email: "Inalterable. El contenido en servidor es definitivo.", good: true },
                                        { title: "Identidad (Art. 7)", chat: "Vinculado a un número (SIM Card) que puede ser clonado o reciclado.", email: "Vinculado a credenciales únicas y metadatos de IP.", good: true },
                                        { title: "Costo Probatorio", chat: "Alto. Requiere peritaje forense para certificar no alteración ($$$).", email: "Bajo o Nulo. Goza de presunción de autenticidad automática.", good: true },
                                        { title: "Disponibilidad (Art. 12)", chat: "Baja. Si pierdes el celular o no tienes backup, pierdes la prueba.", email: "Alta. Almacenamiento en nube redundante e independiente del dispositivo.", good: true },
                                        { title: "Conducta Concluyente", chat: "Ambigua. Un 'Emoji' o silencio puede malinterpretarse.", email: "Clara. La trazabilidad de apertura y respuesta es inequívoca.", good: true },
                                    ].map((row, idx) => (
                                        <div key={idx} className={`grid grid-cols-3 divide-x divide-[#2d2d2d] border-b-2 border-[#222] text-sm hover:bg-[#161616] transition-colors`}>
                                            <div className="font-bold text-gray-300 p-8 py-7 pr-4">{row.title}</div>
                                            <div className="text-gray-500 flex items-start gap-3 p-8 py-7 pr-4"><XCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" /> {row.chat}</div>
                                            <div className="text-white flex items-start gap-3 p-8 py-7"><Check className="w-5 h-5 text-[#10b981] mt-0.5 flex-shrink-0" /> {row.email}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* ... (SECCIONES ORIGINALES LEY, ESTRATEGIA, HERRAMIENTAS - SIN CAMBIOS) ... */}
                    <section id="ley" className="py-12 md:py-24 relative bg-[#0a0a0a]">
                        {/* (CONTENIDO ORIGINAL RESTAURADO PREVIAMENTE) */}
                        <div className="relative z-10 max-w-5xl mx-auto px-6">
                            <div className="border-l-4 border-[#bf953f] pl-8 py-2 mb-12"><h2 className="text-4xl font-serif text-white font-bold text-left">Fundamento Legal: Ley 527 de 1999</h2><p className="text-[#d4af37] text-lg font-light mt-2 text-left">El pilar del Comercio Electrónico en Colombia</p></div>
                            <div className="bg-[#1c1c1c] backdrop-blur-sm border border-[#333] rounded-sm p-10 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                                <div className="flex items-start gap-8">
                                    <Scale className="w-16 h-16 text-[#d4af37] flex-shrink-0" />
                                    <div>
                                        <h3 className="text-2xl font-bold text-[#fcf6ba] mb-4 text-left">¿Por qué esta ley es tu mejor defensa?</h3>
                                        <p className="text-gray-400 mb-8 text-base border-b border-[#333] pb-8 text-left leading-relaxed">Antes de 1999, solo el papel firmado valía. La Ley 527 cambió la historia al otorgar a los <strong>Mensajes de Datos</strong> la misma fuerza probatoria.</p>
                                        <div className="grid md:grid-cols-2 gap-10">
                                            <div><h4 className="text-[#d4af37] font-bold mb-4 flex items-center gap-2 text-left"><BookOpen className="w-5 h-5" /> Artículos Clave</h4><ul className="space-y-4 text-sm text-gray-400 text-left"><li className="flex gap-3"><span className="text-[#d4af37] font-bold text-lg">•</span><span><strong>Art. 5:</strong> Reconocimiento Jurídico pleno.</span></li><li className="flex gap-3"><span className="text-[#d4af37] font-bold text-lg">•</span><span><strong>Art. 10:</strong> Admisibilidad probatoria garantizada.</span></li></ul></div>
                                            <div className="bg-black p-8 rounded border border-[#333]"><h4 className="text-white font-bold mb-4 text-left">Dictamen VECY</h4><p className="text-sm text-gray-400 leading-relaxed text-left mb-4">El correo cumple con los requisitos de <strong>escrito</strong> por su accesibilidad y garantía de inalterabilidad.</p></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section id="estrategia" className="py-12 md:py-24 bg-[#050505] relative">
                        <div className="max-w-7xl mx-auto px-6">
                            <div className="flex flex-col md:flex-row justify-between items-end mb-16 border-b border-[#333] pb-8"><div><h2 className="text-3xl md:text-4xl font-serif text-white font-bold mb-2 text-left">Protocolo de Blindaje VECY</h2><p className="text-[#d4af37] text-left">Metodología exclusiva VECY BIENES RAÍCES</p></div><div className="mt-4 md:mt-0"><span className="px-4 py-2 border border-[#10b981] bg-[#10b981]/10 text-[#10b981] text-xs font-bold uppercase tracking-widest rounded-sm">Sistema Aprobado</span></div></div>
                            <div className="grid md:grid-cols-3 gap-8">
                                {[{ step: "01", title: "Omnicanalidad Formal", desc: "WhatsApp para logística, Correo para el negocio.", icon: <Smartphone className="w-6 h-6 text-[#d4af37]" /> }, { step: "02", title: "Cláusula Digital", desc: "Nota legal que valida el acuerdo sin firma física.", icon: <FileText className="w-6 h-6 text-[#d4af37]" /> }, { step: "03", title: "Evidencia Certificada", desc: "Uso de 4-72 para notificaciones críticas.", icon: <CheckCircle className="w-6 h-6 text-[#d4af37]" /> }].map((item, idx) => (
                                    <div key={idx} className="bg-[#1c1c1c] p-8 rounded-sm border-t-2 border-[#bf953f] hover:bg-[#262626] transition-colors shadow-lg group">
                                        <div className="flex justify-between items-start mb-6"><span className="text-4xl font-serif font-bold text-[#222] group-hover:text-[#bf953f] transition-colors duration-500">{item.step}</span><div className="p-3 bg-black rounded-full border border-[#333]">{item.icon}</div></div>
                                        <h3 className="text-xl font-bold text-[#fcf6ba] mb-4 text-left">{item.title}</h3><p className="text-sm text-gray-400 leading-relaxed text-left">{item.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    <section id="herramientas" className="py-12 md:py-24 bg-[#0a0a0a]">
                        <div className="max-w-5xl mx-auto px-6 text-center">
                            <h2 className="text-3xl font-serif text-white font-bold mb-12">Herramientas del Agente 4.0</h2>
                            <div className="grid md:grid-cols-3 gap-8">
                                <div className="bg-[#1c1c1c] p-8 rounded-sm border border-[#d4af37] flex flex-col items-center hover:scale-[1.02] transition-transform shadow-[0_0_20px_rgba(191,149,63,0.1)] cursor-pointer group" onClick={() => changeView('generator')}>
                                    <div className="relative"><div className="absolute -inset-1 bg-gradient-to-r from-[#bf953f] to-[#aa771c] rounded-full blur opacity-50 group-hover:opacity-100 transition duration-500"></div><div className="relative bg-black rounded-full p-3"><Gavel className="w-10 h-10 text-[#d4af37]" /></div></div>
                                    <h3 className="text-xl font-bold text-white mt-6 mb-2">Redactor Jurídico IA</h3><p className="text-sm text-gray-400 mb-6 max-w-sm text-center">Genera reclamaciones, acuerdos de puntas y contratos vía email.</p><button className="px-6 py-2 rounded-sm text-black font-bold text-xs uppercase tracking-widest bg-gradient-to-r from-[#bf953f] to-[#aa771c] hover:shadow-lg">Usar Ahora ✨</button>
                                </div>
                                <div className="bg-[#1c1c1c] p-8 rounded-sm border border-[#333] flex flex-col items-center hover:border-gray-500 transition-colors">
                                    <Mail className="w-12 h-12 text-[#10b981] mb-6" /><h3 className="text-xl font-bold text-white mb-2">MailSuite</h3><p className="text-sm text-gray-400 mb-6 max-w-sm text-center">Rastreo de apertura de correos para saber cuándo leyeron tu oferta.</p><button onClick={() => changeView('support')} className="text-[#d4af37] text-xs font-bold uppercase hover:underline">Pregúntale a Eddu</button>
                                </div>
                                <div className="bg-[#1c1c1c] p-8 rounded-sm border border-[#333] flex flex-col items-center hover:border-gray-500 transition-colors">
                                    <FileCheck className="w-12 h-12 text-[#10b981] mb-6" /><h3 className="text-xl font-bold text-white mb-2">4-72 Certificado</h3><p className="text-sm text-gray-400 mb-6 max-w-sm text-center">Prueba de entrega oficial válida en juzgados para notificaciones.</p><button onClick={() => changeView('support')} className="text-[#d4af37] text-xs font-bold uppercase hover:underline">Pregúntale a Eddu</button>
                                </div>
                            </div>
                        </div>
                    </section>
                </>
            )}

            {currentView === 'academy' && <CourseView onBack={() => changeView('home')} />}
            {currentView === 'legal' && <LegalView onBack={() => changeView('home')} />}
            {currentView === 'data' && <DataPolicyView onBack={() => changeView('home')} />}
            {currentView === 'support' && <SupportView onBack={() => changeView('home')} />}
            {currentView === 'generator' && <EmailGeneratorView onBack={() => changeView('home')} />}

            <footer className="py-12 bg-black border-t border-[#222] text-center">
                <div className="max-w-4xl mx-auto px-6">
                    <img src="https://static.wixstatic.com/media/334454_10c140731ac145d49a2a43206655cd04~mv2.png" alt="VECY" className="h-16 w-16 mx-auto rounded-full border border-[#bf953f]/30 mb-6 grayscale hover:grayscale-0 transition-all duration-500 bg-black" />
                    <p className="text-[#d4af37] font-serif text-lg mb-2">VECY BIENES RAÍCES</p>
                    <p className="text-gray-600 text-xs tracking-widest uppercase mb-8">Tecnología + Derecho + Innovación</p>
                    <div className="flex flex-col md:flex-row justify-center gap-6 text-sm text-gray-500">
                        <button onClick={() => changeView('legal')} className="hover:text-gray-300 transition-colors text-xs uppercase tracking-widest">Aviso Legal</button>
                        <button onClick={() => changeView('data')} className="hover:text-gray-300 transition-colors text-xs uppercase tracking-widest">Política de Datos</button>
                        <button onClick={() => changeView('support')} className="hover:text-gray-300 transition-colors text-xs uppercase tracking-widest">Bufete Virtual VECY</button>
                    </div>
                    <p className="text-gray-700 text-xs mt-12">© 2026 VECY. Todos los derechos reservados.</p>
                </div>
            </footer>
        </div>
    );
};

export default App;

