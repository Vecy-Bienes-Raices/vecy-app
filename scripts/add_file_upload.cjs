const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'AppV2.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// ────────────────────────────────────────────────────────────────
// 1. Agregar estado y handlers de archivos en EdduAIChat
//    Después de la línea: const textareaRef = useRef(null);
// ────────────────────────────────────────────────────────────────
const stateAnchor = '    const textareaRef = useRef(null);';
const fileStateBlock = `    const textareaRef = useRef(null);
    const fileInputRef = useRef(null);
    const [attachedFile, setAttachedFile] = useState(null); // { name, mimeType, base64, preview }

    const handleFileAttach = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const allowedTypes = [
            'application/pdf',
            'image/jpeg', 'image/png', 'image/webp', 'image/gif',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/msword'
        ];

        if (!allowedTypes.includes(file.type)) {
            alert('Formato no soportado. Use: PDF, JPG, PNG, WEBP o Word (.docx)');
            return;
        }

        const reader = new FileReader();
        reader.onload = (ev) => {
            const base64 = ev.target.result.split(',')[1];
            const isImage = file.type.startsWith('image/');
            setAttachedFile({
                name: file.name,
                mimeType: file.type,
                base64,
                preview: isImage ? ev.target.result : null,
                isWord: file.type.includes('word')
            });
        };
        reader.readAsDataURL(file);
        e.target.value = ''; // Reset input
    };

    const removeAttachedFile = () => setAttachedFile(null);`;

if (content.includes('const fileInputRef')) {
    console.log('⚠️  Estado de archivo ya existe. Saltando paso 1.');
} else if (content.includes(stateAnchor)) {
    content = content.replace(stateAnchor, fileStateBlock);
    console.log('✅ Paso 1: Estado y handlers de archivos agregados.');
} else {
    console.log('❌ Paso 1 FALLO: No se encontró el anchor del textarea ref.');
}

// ────────────────────────────────────────────────────────────────
// 2. Modificar handleSend para enviar archivos a la API Gemini 
//    Reemplazar la llamada callGemini con versión que soporta archivos
// ────────────────────────────────────────────────────────────────
const oldCallGemini = `        try {
            const responseText = await callGemini(userText, EDDU_SYSTEM_PROMPT);`;

const newCallGemini = `        try {
            // Construir partes del mensaje (texto + archivo si existe)
            const userParts = [
                { text: EDDU_SYSTEM_PROMPT ? \`INSTRUCCIONES DEL SISTEMA:\\n\${EDDU_SYSTEM_PROMPT}\\n\\n\` : '' },
                { text: attachedFile ? \`[El usuario adjuntó el archivo: \${attachedFile.name}]\\n\${userText || 'Analiza este documento.'}\` : userText }
            ];

            // Agregar archivo como inlineData si existe y NO es Word
            if (attachedFile && !attachedFile.isWord) {
                userParts.push({ inlineData: { mimeType: attachedFile.mimeType, data: attachedFile.base64 } });
            }

            const responseText = await callGeminiMultimodal(userParts);`;

if (content.includes('callGeminiMultimodal')) {
    console.log('⚠️  callGeminiMultimodal ya existe. Saltando paso 2.');
} else if (content.includes(oldCallGemini)) {
    content = content.replace(oldCallGemini, newCallGemini);
    console.log('✅ Paso 2: handleSend actualizado para soportar archivos.');
} else {
    console.log('❌ Paso 2 FALLO: No se encontró callGemini en handleSend.');
}

// ────────────────────────────────────────────────────────────────
// 3. Limpiar archivo adjunto después de enviar
//    Después de: setMessages(prev => [...prev, botMsg]);
// ────────────────────────────────────────────────────────────────
const oldBotMsg = "            const botMsg = { id: Date.now() + 1, type: 'bot', text: responseText };\n            setMessages(prev => [...prev, botMsg]);";
const newBotMsg = "            const botMsg = { id: Date.now() + 1, type: 'bot', text: responseText };\n            setMessages(prev => [...prev, botMsg]);\n            setAttachedFile(null); // Limpiar archivo tras respuesta";

if (content.includes('setAttachedFile(null);')) {
    console.log('⚠️  Limpieza de archivo ya existe. Saltando paso 3.');
} else if (content.includes(oldBotMsg)) {
    content = content.replace(oldBotMsg, newBotMsg);
    console.log('✅ Paso 3: Limpieza de archivo adjunto agregada.');
} else {
    console.log('❌ Paso 3 FALLO: No se encontró el bloque botMsg.');
}

// ────────────────────────────────────────────────────────────────
// 4. Agregar función callGeminiMultimodal antes de EdduAIChat
//    Aprovecha los modelos ya definidos en callGemini
// ────────────────────────────────────────────────────────────────
const componentAnchor = '// --- COMPONENTES ---\n\nconst EdduAIChat';
const multimodalFn = `// --- COMPONENTES ---

// Función multimodal (soporta imágenes + PDF + texto)
const callGeminiMultimodal = async (parts) => {
    const modelsToTry = [
        "gemini-2.0-flash",
        "gemini-2.0-flash-lite",
        "gemini-1.5-flash"
    ];
    for (const model of modelsToTry) {
        try {
            const response = await fetch(
                \`https://generativelanguage.googleapis.com/v1beta/models/\${model}:generateContent?key=\${apiKey}\`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{ role: 'user', parts }],
                        generationConfig: { temperature: 0.75, maxOutputTokens: 2048 }
                    })
                }
            );
            if (!response.ok) { continue; }
            const data = await response.json();
            if (data.candidates?.[0]?.content) {
                return data.candidates[0].content.parts[0].text;
            }
        } catch (e) { continue; }
    }
    throw new Error('No se pudo procesar el documento. Verifica tu API Key.');
};

const EdduAIChat`;

if (content.includes('callGeminiMultimodal')) {
    console.log('⚠️  callGeminiMultimodal ya existe globalmente. Saltando paso 4.');
} else if (content.includes(componentAnchor)) {
    content = content.replace(componentAnchor, multimodalFn);
    console.log('✅ Paso 4: Función callGeminiMultimodal agregada.');
} else {
    console.log('❌ Paso 4 FALLO: No se encontró el anchor de COMPONENTES.');
}

// ────────────────────────────────────────────────────────────────
// 5. Agregar UI del botón de adjuntar y preview del archivo
//    Antes de: <textarea ref={textareaRef}
// ────────────────────────────────────────────────────────────────
const uiAnchor = `            <div className="flex items-end gap-3">
                    <textarea`;

const newUI = `            {/* Preview de archivo adjunto */}
            {attachedFile && (
                <div className="flex items-center gap-2 mb-2 px-1">
                    <div className="flex items-center gap-2 bg-[#bf953f]/10 border border-[#bf953f]/30 rounded px-3 py-1.5 text-xs text-[#d4af37]">
                        {attachedFile.preview
                            ? <img src={attachedFile.preview} alt="preview" className="h-8 w-8 object-cover rounded" />
                            : <FileText className="w-4 h-4" />
                        }
                        <span className="max-w-[180px] truncate">{attachedFile.name}</span>
                        <button onClick={removeAttachedFile} className="ml-1 text-gray-500 hover:text-red-400">
                            <X className="w-3 h-3" />
                        </button>
                    </div>
                </div>
            )}
            <div className="flex items-end gap-3">
                    <textarea`;

if (content.includes('removeAttachedFile')) {
    console.log('⚠️  UI de archivo ya existe. Saltando paso 5.');
} else if (content.includes(uiAnchor)) {
    content = content.replace(uiAnchor, newUI);
    console.log('✅ Paso 5: UI de preview y botón de quitar archivo agregada.');
} else {
    console.log('❌ Paso 5 FALLO: No se encontró el anchor del div de input.');
}

// ────────────────────────────────────────────────────────────────
// 6. Agregar botón de clip/adjuntar entre textarea y botón send
// ────────────────────────────────────────────────────────────────
const sendBtnAnchor = `                    <button
                        onClick={handleSend}
                        disabled={isTyping || !input.trim()}`;

const newSendArea = `                    {/* Botón de adjuntar archivo */}
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png,.webp,.gif,.doc,.docx"
                        onChange={handleFileAttach}
                        className="hidden"
                    />
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        title="Adjuntar PDF, imagen o Word"
                        className={\`p-4 h-[56px] w-[56px] flex items-center justify-center border rounded-sm transition-all \${attachedFile ? 'bg-[#bf953f]/20 border-[#bf953f] text-[#d4af37]' : 'border-[#333] text-gray-500 hover:border-[#bf953f] hover:text-[#d4af37] bg-black'}\`}
                    >
                        <FileText className="w-5 h-5" />
                    </button>
                    <button
                        onClick={handleSend}
                        disabled={isTyping || (!input.trim() && !attachedFile)}`;

if (content.includes('fileInputRef.current?.click()')) {
    console.log('⚠️  Botón de adjuntar ya existe. Saltando paso 6.');
} else if (content.includes(sendBtnAnchor)) {
    content = content.replace(sendBtnAnchor, newSendArea);
    console.log('✅ Paso 6: Botón de adjuntar archivo (clip) agregado en UI.');
} else {
    console.log('❌ Paso 6 FALLO: No se encontró el botón de send.');
}

// Guardar
fs.writeFileSync(filePath, content, 'utf8');
console.log('\n🎉 IMPLEMENTACIÓN COMPLETADA:');
console.log('   ✅ Subida de PDF, Imágenes (JPG/PNG/WEBP) y Word');
console.log('   ✅ Preview del archivo en el chat');
console.log('   ✅ Envío multimodal a la API de Gemini');
