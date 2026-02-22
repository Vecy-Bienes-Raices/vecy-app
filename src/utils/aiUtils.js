// --- CONFIGURACIÓN Y CEREBRO DE RESPALDO (FALLBACK) ---

export const localKnowledgeBase = {
    whatsapp: `⚠️ **ALERTA JURÍDICA VECY SOBRE WHATSAPP**\n\nColega, usar WhatsApp para cerrar negocios es un riesgo patrimonial alto. Razones técnicas:\n\n1. **Volatilidad:** Los mensajes pueden ser "Editados" o "Eliminados para todos". Esto rompe la cadena de custodia de la prueba.\n2. **Mensajes Efímeros:** Si activan la autodestrucción, pierdes la evidencia en 24h.\n3. **Costo Procesal:** Para que un juez acepte un chat impugnado, debes pagar un perito informático forense (costoso y lento).\n\n✅ **Solución:** Usa WhatsApp para la logística ("ya llegué"), pero formaliza la oferta y el cierre SIEMPRE por correo electrónico.`,

    correo: `🛡️ **EL PODER DEL CORREO ELECTRÓNICO (LEY 527)**\n\nEl correo es tu seguro de vida inmobiliario. Bajo la Ley 527 de 1999:\n\n1. **Prueba Plena:** Es un "Mensaje de Datos" con plena validez jurídica.\n2. **Inmutabilidad:** Una vez enviado, queda grabado en los servidores. Nadie puede editarlo unilateralmente.\n3. **Trazabilidad:** Los encabezados (headers) prueban origen y destino.\n\n💡 **Tip VECY:** Si el cliente responde "Ok" a tu correo de honorarios, el contrato de corretaje se considera perfeccionado legalmente.`,

    cobro: `💰 **CÓMO COBRAR SIN CONTRATO FÍSICO**\n\nSi no firmaste papel, acude a la "Confesión Presunta" vía digital:\n\n1. Reúne la trazabilidad: Correos de presentación del cliente, confirmación de cita y envío de oferta.\n2. Si usaste **MailSuite**, adjunta el certificado de apertura.\n3. Redacta una "Cuenta de Cobro con Preaviso Jurídico" citando el Art. 864 del Código de Comercio (oferta aceptada tácitamente).\n\n¿Quieres que te redacte el correo de cobro? Ve a la sección de Herramientas.`,

    default: `Somos **VECY BIENES RAÍCES** v3.0 (Router). 🏛️\nUna firma pionera en **Agilidad Digital** y **Robustez Jurídica**.\n\nEstamos operando en **Modo de Respaldo Seguro**. Podemos orientarte sobre:\n\n• **La Trampa de la Inmediatez:** Riesgos de WhatsApp vs Seguridad del Email.\n• **Acervo Probatorio:** Cómo convertir comunicaciones en pruebas irrefutables.\n• **Sostenibilidad:** Procesos 100% libres de papel.\n\nIndícanos, ¿por cuál ruta de aprendizaje deseas comenzar hoy?`
};

export const localDocumentTemplates = {
    presentacion: `ASUNTO: **PRESENTACIÓN FORMAL DE CLIENTE Y ACUERDO DE COMISIÓN** - [Dirección Inmueble]\n\nEstimado(a) Propietario(a),\n\nActuando en calidad de asesor profesional de **VECY BIENES RAÍCES**, presento formalmente a mi cliente, el Sr(a). [NOMBRE CLIENTE], interesado en su inmueble ubicado en [DIRECCIÓN].\n\nConfirmamos que la visita está programada para [FECHA/HORA].\n\n**CONDICIONES DEL CORRETAJE:**\nEn caso de concretarse la venta/arriendo con este cliente (o sus relacionados), se reconocerán los honorarios profesionales pactados del **[3% / UN CANON]** a favor de mi firma.\n\n**CLÁUSULA DE VALIDEZ DIGITAL:**\nEste mensaje constituye un acuerdo vinculante. La aceptación de la visita implica la aceptación de las condiciones aquí descritas, conforme a la **Ley 527 de 1999** sobre validez de mensajes de datos.\n\nCordialmente,\n\n[TU NOMBRE]\nAgente VECY BIENES RAÍCES`,

    cobro: `ASUNTO: **RECLAMACIÓN PREJURÍDICA DE HONORARIOS** - INMUEBLE [DIRECCIÓN]\n\nRespetados señores,\n\nMe dirijo a ustedes para solicitar el pago de la comisión derivada de la venta del inmueble de la referencia, perfeccionada con el cliente [NOMBRE] presentado por mi gestión.\n\n**HECHOS:**\n1. El día [FECHA], presenté al cliente vía correo electrónico (ver anexo).\n2. Se realizó la visita con su autorización.\n3. El negocio se cerró por valor de [VALOR].\n\n**FUNDAMENTO JURÍDICO:**\nSegún el **Código de Comercio** y la **Ley 527 de 1999**, existe un contrato de corretaje perfeccionado por el intercambio de mensajes de datos y la gestión efectiva.\n\nSolicito el pago inmediato para evitar el traslado de este cobro a la instancia judicial.\n\nAtentamente,\n\n[TU NOMBRE]\nDepartamento Jurídico`
};

/**
 * callGemini - Versión 2.1 (Compatible & Multimodal)
 * @param {Array|String} historyOrPrompt - Historial (Array) o Prompt simple (String)
 * @param {Array|String} newPartsOrSystem - Nuevas partes (Array) o Instrucción sistema (String)
 */
export const callGemini = async (historyOrPrompt = [], newPartsOrSystem = []) => {
    const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
    if (!apiKey) {
        console.error("VITE_GOOGLE_API_KEY no configurada.");
        throw new Error("API Key Missing");
    }

    let history = [];
    let newParts = [];

    // Lógica de compatibilidad
    if (typeof historyOrPrompt === 'string') {
        const prompt = historyOrPrompt;
        const systemInstruction = typeof newPartsOrSystem === 'string' ? newPartsOrSystem : "";
        newParts = [
            { text: systemInstruction ? `INSTRUCCIONES DEL SISTEMA:\n${systemInstruction}\n\n` : "" },
            { text: prompt }
        ];
    } else {
        history = historyOrPrompt;
        newParts = newPartsOrSystem;
    }

    const modelsToTry = [
        "gemini-2.0-flash",
        "gemini-2.0-flash-exp",
        "gemini-1.5-flash"
    ];

    for (const model of modelsToTry) {
        try {
            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [
                            ...history,
                            { role: 'user', parts: newParts }
                        ],
                        generationConfig: {
                            temperature: 0.75,
                            maxOutputTokens: 8192,
                        }
                    })
                }
            );

            if (!response.ok) {
                const errText = await response.text();
                console.warn(`Fallo con ${model}:`, errText);
                continue;
            }

            const data = await response.json();
            if (data.candidates && data.candidates[0] && data.candidates[0].content) {
                const parts = data.candidates[0].content.parts || [];
                return parts.filter(p => p.text).map(p => p.text).join('\n');
            }
        } catch (e) {
            console.error(`Error de red con ${model}`, e);
        }
    }

    throw new Error("Todos los modelos de IA fallaron.");
};
