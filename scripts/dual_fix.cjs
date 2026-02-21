const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'AppV2.jsx');
let content = fs.readFileSync(filePath, 'utf8');
const original = content;

let fixes = 0;

// ══════════════════════════════════════════════════════════════
// FIX 1: Regex de nombre - aplicar bucle hasta que no haya prefijos
// Problema: "Hola soy Eduardo" → regex elimina "hola " → queda "soy Eduardo"
//           → split()[0] = "soy"  ← ERROR
// Solución: Loop hasta que no haya más prefijos al inicio
// ══════════════════════════════════════════════════════════════
const oldNameLine = `                let name = userText.replace(/^(hola|buenos dias|buenas tardes|soy|me llamo|mi nombre es|yo soy|es|hablo con|hablas con|con|de parte de)\\s+/i, '').trim();
                name = name.split(' ')[0].replace(/[^a-zA-Z\\u00e1\\u00e9\\u00ed\\u00f3\\u00fa\\u00c1\\u00c9\\u00cd\\u00d3\\u00da\\u00f1\\u00d1]/g, '');`;

const newNameLine = `                // REGEX MULTI-PASO: Eliminar TODOS los prefijos en cascada
                const prefixRX = /^(hola[,!]?|buenos d[ií]as[,!]?|buenas tardes[,!]?|buen d[ií]a[,!]?|soy|me llamo|mi nombre es|yo soy|es|hablo con|hablas con|con|de parte de|le habla|le saluda)\\s+/i;
                let name = userText.trim();
                // Eliminar prefijos repetidos (ej: "Hola soy Juan" → "Juan")
                let prev = '';
                while (prev !== name) { prev = name; name = name.replace(prefixRX, '').trim(); }
                // Solo el primer nombre, sin caracteres especiales
                name = name.split(/[\\s,!.]+/)[0].replace(/[^a-zA-Z\\u00e1\\u00e9\\u00ed\\u00f3\\u00fa\\u00c1\\u00c9\\u00cd\\u00d3\\u00da\\u00f1\\u00d1]/g, '');`;

if (content.includes(oldNameLine)) {
    content = content.replace(oldNameLine, newNameLine);
    console.log('✅ FIX 1 APLICADO: Regex de nombre actualizado a multi-paso.');
    console.log('   "Hola soy Eduardo" → "Eduardo"');
    console.log('   "Con Juan" → "Juan"');
    console.log('   "De parte de María" → "María"');
    fixes++;
} else {
    console.log('❌ FIX 1 FALLO: No se encontró el bloque de nombre exacto.');
    // Búsqueda alternativa
    const idx = content.indexOf("let name = userText.replace");
    if (idx > 0) console.log('   Encontrado en pos:', idx, content.substring(idx, idx+100));
}

// ══════════════════════════════════════════════════════════════
// FIX 2: handleSend - permitir envío cuando hay archivo adjunto
// Problema: if (!input.trim() || isTyping) return; bloquea si no hay texto
// Solución: Permitir si hay archivo O texto
// ══════════════════════════════════════════════════════════════
const oldGuard = `    const handleSend = async () => {
        if (!input.trim() || isTyping) return;`;

const newGuard = `    const handleSend = async () => {
        if ((!input.trim() && !attachedFile) || isTyping) return;`;

if (content.includes(oldGuard)) {
    content = content.replace(oldGuard, newGuard);
    console.log('✅ FIX 2 APLICADO: Guard de handleSend actualizado para archivos.');
    fixes++;
} else {
    console.log('❌ FIX 2 FALLO: No se encontró el guard original de handleSend.');
    const idx = content.indexOf('const handleSend = async');
    if (idx > 0) console.log('   Contexto:', content.substring(idx, idx+150));
}

// ══════════════════════════════════════════════════════════════
// FIX 3: handleSend - texto del mensaje cuando es solo archivo
// Si envía solo un archivo sin texto, usar mensaje descriptivo
// ══════════════════════════════════════════════════════════════
const oldUserText = `        const userText = input.trim();
        const userMsg = { id: Date.now(), type: 'user', text: userText };`;

const newUserText = `        const userText = input.trim();
        const displayText = userText || (attachedFile ? \`📎 \${attachedFile.name}\` : '');
        const userMsg = { id: Date.now(), type: 'user', text: displayText };`;

if (content.includes(oldUserText) && !content.includes('displayText')) {
    content = content.replace(oldUserText, newUserText);
    console.log('✅ FIX 3 APLICADO: Mensaje de usuario muestra nombre del archivo adjunto.');
    fixes++;
} else {
    console.log('⚠️  FIX 3: Ya aplicado o no encontrado.');
}

// ══════════════════════════════════════════════════════════════
// FIX 4: saludo del welcome message - usar el mensaje de bienvenida mejorado
// Reemplazar el texto de bienvenida plano con el variado
// ══════════════════════════════════════════════════════════════
const oldWelcome = '                    text: `¡Un placer saludarle, **${name}**! 🤝\\n\\nAhora sí, entremos en materia. Como especialista en **Derecho Inmobiliario, Civil y Comercial**, estoy a su entera disposición.\\n\\n¿Cuál es la situación jurídica que desea resolver hoy?`';
const newWelcome = `                    text: (() => {
                        const opts = [
                            \`Es un honor, **\${name}**. ⚖️ Soy **Eddu-AI**, su Jurista de confianza. ¿Cuál es el desafío legal de hoy?\`,
                            \`Bienvenido, **\${name}**. 🏛️ Pongo a su disposición toda mi inteligencia jurídica. ¿En qué le asisto?\`,
                            \`Un gusto, **\${name}**. 🤝 Listo para analizar su caso con rigor jurídico. ¿Comenzamos?\`
                        ];
                        return opts[Math.floor(Math.random() * opts.length)];
                    })()`;

if (content.includes(oldWelcome)) {
    content = content.replace(oldWelcome, newWelcome);
    console.log('✅ FIX 4 APLICADO: Saludo de bienvenida variado restaurado.');
    fixes++;
} else {
    console.log('⚠️  FIX 4: No se encontró el saludo plano (puede estar bien).');
}

// GUARDAR
if (fixes > 0) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`\n🎉 ${fixes} corrección(es) aplicadas exitosamente.`);
} else {
    console.log('\n⚠️  No se realizaron cambios. Revisar manualmente.');
}
