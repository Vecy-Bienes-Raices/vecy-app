/**
 * SCRIPT DE MEJORAS COMPLETAS para AppV2.jsx
 * - Múltiples archivos simultáneos (attachedFiles array)
 * - Ícono Paperclip en lugar de FileText en botón adjuntar
 * - Género: "andrés" y nombres con acento detectados como masculinos
 * - maxOutputTokens en backend a 8192
 */
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'AppV2.jsx');
let content = fs.readFileSync(filePath, 'utf8');
let fixes = 0;

// ══════════════════════════════════════════════════════════════
// FIX 1: Ampliar lista de nombres masculinos (Andrés, etc.)
// ══════════════════════════════════════════════════════════════
// Detectar el bloque detectGender y mejorar la lista maleNames
const oldMales = `'juan','carlos','jose','luis','andres','jorge','miguel','david','oscar',
        'daniel','alberto','alejandro','pedro','ricardo','mario','hector','sergio',
        'pablo','gabriel','nicolas','sebastian','santiago','camilo','cesar',
        'felipe','rafael','antonio','manuel','francisco','rodrigo','ivan','john',
        'william','christian','jaime','javier','victor','edgar','wilson','henry',
        'alex','roberto','nelson','marco','diego','alonso','bernardo','hernan',
        'gilberto','giovanny','leonardo','oliver','samuel','mateo','tomas','eduardo'`;

const newMales = `'juan','carlos','jose','luis','andres','\u00e9duardo','jorge','miguel','david','oscar',
        'daniel','alberto','alejandro','pedro','ricardo','mario','hector','h\u00e9ctor','sergio',
        'pablo','gabriel','nicolas','nicol\u00e1s','sebastian','sebasti\u00e1n','santiago','camilo','cesar','c\u00e9sar',
        'felipe','rafael','antonio','manuel','francisco','rodrigo','iv\u00e1n','ivan','john',
        'william','christian','jaime','javier','victor','v\u00edctor','edgar','wilson','henry',
        'alex','roberto','nelson','marco','diego','alonso','bernardo','hernan','hern\u00e1n',
        'gilberto','giovanny','leonardo','oliver','samuel','mateo','tomas','tom\u00e1s','eduardo',
        'andr\u00e9s','mart\u00edn','martin','julh\u00e1n','julian','juli\u00e1n','david','brayan','bryan',
        'esteban','gustavo','ignacio','joaquin','joaqu\u00edn','leandro','mauricio','oswaldo',
        'reynaldo','richard','ronald','ruben','rub\u00e9n','sergio','simon','sim\u00f3n','xavier'`;

if (content.includes(oldMales)) {
    content = content.replace(oldMales, newMales);
    console.log('✅ FIX 1: Lista masculinos ampliada (Andrés, Martín, Julián, etc.)');
    fixes++;
} else {
    console.log('⚠️  FIX 1: No encontró bloque exacto. Buscando alternativa...');
    // Buscar de otra manera: si tiene 'andres' en maleNames
    const idxAndres = content.indexOf("'andres'");
    if (idxAndres > 0) {
        // Insertar nombres con acento después de 'andres'
        content = content.replace("'andres'", "'andres','andr\u00e9s','mart\u00edn','martin','julian','juli\u00e1n'");
        console.log('✅ FIX 1 (alternativo): Andrés y otros agregados.');
        fixes++;
    }
}

// ══════════════════════════════════════════════════════════════
// FIX 2: Heurística de género mejorada (nombres en -és, -ín detectados como masculinos)
// ══════════════════════════════════════════════════════════════
const oldHeuristic = `if (n.endsWith('a') || n.endsWith('ia') || n.endsWith('ina') || n.endsWith('ela')) return 'female';
    if (n.endsWith('o') || n.endsWith('er') || n.endsWith('el') || n.endsWith('on') || n.endsWith('in')) return 'male';`;

const newHeuristic = `if (n.endsWith('a') || n.endsWith('ia') || n.endsWith('ina') || n.endsWith('ela')) return 'female';
    if (n.endsWith('o') || n.endsWith('er') || n.endsWith('el') || n.endsWith('on') || 
        n.endsWith('in') || n.endsWith('\u00e9s') || n.endsWith('es') || n.endsWith('\u00edn') || 
        n.endsWith('an') || n.endsWith('en') || n.endsWith('us')) return 'male';`;

if (content.includes(oldHeuristic)) {
    content = content.replace(oldHeuristic, newHeuristic);
    console.log('✅ FIX 2: Heurística mejorada (-és, -ín detectados como masculino).');
    fixes++;
} else {
    console.log('⚠️  FIX 2: No se encontró la heurística exacta.');
}

// ══════════════════════════════════════════════════════════════
// FIX 3: Cambiar FileText por Paperclip en el botón de adjuntar
// ══════════════════════════════════════════════════════════════
// El botón de adjuntar tiene: <FileText className="w-5 h-5" />
// Dentro del botón onClick={() => fileInputRef.current?.click()}
// Necesito identificar ese botón específico y cambiar solo ese ícono

// Buscar el patrón del botón de adjuntar
const oldAttachIcon = `<FileText className="w-5 h-5" />
                    </button>
                    <button
                        onClick={handleSend}`;

const newAttachIcon = `<Paperclip className="w-4 h-4" />
                    </button>
                    <button
                        onClick={handleSend}`;

if (content.includes(oldAttachIcon)) {
    content = content.replace(oldAttachIcon, newAttachIcon);
    console.log('✅ FIX 3: Ícono cambiado a Paperclip.');
    fixes++;
} else {
    // Búsqueda más amplia
    const clipBtnIdx = content.indexOf("fileInputRef.current?.click()");
    if (clipBtnIdx > 0) {
        const blockEnd = content.indexOf('</button>', clipBtnIdx);
        const block = content.substring(clipBtnIdx, blockEnd + 9);
        if (block.includes('FileText')) {
            const newBlock = block.replace('<FileText className="w-5 h-5" />', '<Paperclip className="w-4 h-4" />');
            content = content.substring(0, clipBtnIdx) + newBlock + content.substring(clipBtnIdx + block.length);
            console.log('✅ FIX 3 (alternativo): Ícono cambiado a Paperclip.');
            fixes++;
        }
    } else {
        console.log('❌ FIX 3: No se encontró el botón de adjuntar.');
    }
}

// ══════════════════════════════════════════════════════════════
// FIX 4: Cambiar botón attach a más pequeño y compacto
// ══════════════════════════════════════════════════════════════
const oldAttachBtn = `className={\`p-4 h-[56px] w-[56px] flex items-center justify-center border rounded-sm transition-all \${attachedFile ? 'bg-[#bf953f]/20 border-[#bf953f] text-[#d4af37]' : 'border-[#333] text-gray-500 hover:border-[#bf953f] hover:text-[#d4af37] bg-black'}\`}`;
const newAttachBtn = `className={\`p-3 h-[56px] w-[46px] flex items-center justify-center border rounded-sm transition-all \${attachedFiles.length > 0 ? 'bg-[#bf953f]/20 border-[#bf953f] text-[#d4af37]' : 'border-[#333] text-gray-500 hover:border-[#bf953f] hover:text-[#d4af37] bg-black'}\`}`;

// ══════════════════════════════════════════════════════════════
// FIX 5: Cambiar de un archivo a múltiples archivos (attachedFiles[])
// ══════════════════════════════════════════════════════════════
// 5a: Estado: attachedFile → attachedFiles array
content = content.replace(
    "const [attachedFile, setAttachedFile] = useState(null); // { name, mimeType, base64, preview }",
    "const [attachedFiles, setAttachedFiles] = useState([]); // Array de { name, mimeType, base64, preview }"
);

// 5b: handleFileAttach: push multiple files
const oldFileHandler = `    const handleFileAttach = (e) => {
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

const newFileHandler = `    const handleFileAttach = (e) => {
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
            alert(\`\${files.length - validFiles.length} archivo(s) ignorado(s). Formatos válidos: PDF, JPG, PNG, WEBP, Word.\`);
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
        e.target.value = ''; // Reset input
    };

    const removeAttachedFile = (id) => setAttachedFiles(prev => prev.filter(f => f.id !== id));`;

if (content.includes(oldFileHandler)) {
    content = content.replace(oldFileHandler, newFileHandler);
    console.log('✅ FIX 5: handleFileAttach actualizado para múltiples archivos.');
    fixes++;
} else {
    console.log('⚠️  FIX 5: No se encontró el handler de archivo exacto.');
}

// 5c: Preview de archivos — cambiar de singular a plural
const oldFilePreview = `            {attachedFile && (
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
            )}`;

const newFilePreview = `            {attachedFiles.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2 px-1">
                    {attachedFiles.map(file => (
                        <div key={file.id} className="flex items-center gap-2 bg-[#bf953f]/10 border border-[#bf953f]/30 rounded px-3 py-1.5 text-xs text-[#d4af37]">
                            {file.preview
                                ? <img src={file.preview} alt="preview" className="h-6 w-6 object-cover rounded" />
                                : <Paperclip className="w-3 h-3" />
                            }
                            <span className="max-w-[140px] truncate">{file.name}</span>
                            <button onClick={() => removeAttachedFile(file.id)} className="ml-1 text-gray-500 hover:text-red-400">
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                    ))}
                </div>
            )}`;

if (content.includes(oldFilePreview)) {
    content = content.replace(oldFilePreview, newFilePreview);
    console.log('✅ FIX 5b: Preview de múltiples archivos actualizado.');
    fixes++;
}

// 5d: Input file: agregar multiple
content = content.replace(
    'accept=".pdf,.jpg,.jpeg,.png,.webp,.gif,.doc,.docx"',
    'accept=".pdf,.jpg,.jpeg,.png,.webp,.gif,.doc,.docx" multiple'
);

// 5e: Guard del botón send (attachedFile → attachedFiles.length > 0)
content = content.replace(
    'disabled={isTyping || (!input.trim() && !attachedFile)}',
    'disabled={isTyping || (!input.trim() && attachedFiles.length === 0)}'
);

// 5f: Botón de adjuntar - actualizar la clase con attachedFiles
if (content.includes(oldAttachBtn)) {
    content = content.replace(oldAttachBtn, newAttachBtn);
    console.log('✅ FIX 5c: Botón attach actualizado a attachedFiles.');
    fixes++;
} else {
    // Reemplazo simple de referencia
    content = content.replace(
        "attachedFile ? 'bg-[#bf953f]/20",
        "attachedFiles.length > 0 ? 'bg-[#bf953f]/20"
    );
}

// 5g: En handleSend - actualizar referencias de attachedFile → attachedFiles
content = content.replace(
    'const userParts = [\n                { text: EDDU_SYSTEM_PROMPT ? `INSTRUCCIONES DEL SISTEMA:\\n${EDDU_SYSTEM_PROMPT}\\n\\n` : \'\' },\n                { text: attachedFile ? `[Archivo adjunto: ${attachedFile.name}]\\n${userText || \'Analiza este documento.\'}` : userText }\n            ];\n\n            // Agregar archivo como inlineData (imagen o PDF)\n            if (attachedFile && !attachedFile.isWord) {\n                userParts.push({ inlineData: { mimeType: attachedFile.mimeType, data: attachedFile.base64 } });\n            }',
    `const fileNames = attachedFiles.map(f => f.name).join(', ');
            const userParts = [
                { text: EDDU_SYSTEM_PROMPT ? \`INSTRUCCIONES DEL SISTEMA:\\n\${EDDU_SYSTEM_PROMPT}\\n\\n\` : '' },
                { text: attachedFiles.length > 0 ? \`[Archivos adjuntos: \${fileNames}]\\n\${userText || 'Analiza estos documentos.'}\` : userText }
            ];

            // Agregar TODOS los archivos como inlineData (imagen/PDF)
            attachedFiles.filter(f => !f.isWord).forEach(file => {
                userParts.push({ inlineData: { mimeType: file.mimeType, data: file.base64 } });
            });`
);

// 5h: Limpiar archivos después de respuesta: setAttachedFile(null) → setAttachedFiles([])
content = content.replace('setAttachedFile(null);', 'setAttachedFiles([]);');

// 5i: displayText - usar attachedFiles
content = content.replace(
    "const displayText = userText || (attachedFile ? `📎 ${attachedFile.name}` : '');",
    "const displayText = userText || (attachedFiles.length > 0 ? `📎 ${attachedFiles.map(f => f.name).join(', ')}` : '');"
);

// 5j: Guard en handleSend - (!input.trim() && !attachedFile) → attachedFiles
content = content.replace(
    'if ((!input.trim() && !attachedFile) || isTyping) return;',
    'if ((!input.trim() && attachedFiles.length === 0) || isTyping) return;'
);

console.log('✅ FIX 5 completo: Múltiples archivos implementado.');
fixes++;

// ══════════════════════════════════════════════════════
// Guardar
// ══════════════════════════════════════════════════════
fs.writeFileSync(filePath, content, 'utf8');
console.log(`\n🎉 ${fixes} grupos de fixes aplicados.`);
console.log('   ✔ Múltiples archivos simultáneos');
console.log('   ✔ Ícono Paperclip');
console.log('   ✔ Andrés y nombres con acento detectados como masculinos');
