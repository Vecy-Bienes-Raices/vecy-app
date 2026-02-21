const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'AppV2.jsx');
let content = fs.readFileSync(filePath, 'utf8');
let fixes = 0;

// ══════════════════════════════════════════════════════════════
// FIX 1: Mejorar el parseo de la respuesta de Gemini
// El modelo con Search Grounding devuelve candidates[0].content.parts
// a veces con múltiples partes. Hay que extraer TODAS las partes de texto.
// ══════════════════════════════════════════════════════════════
const oldParse = `            const data = await response.json();
            if (data.candidates && data.candidates[0].content) {
                console.log(\`¡Éxito con modelo: \${model}!\`);
                return data.candidates[0].content.parts[0].text;
            }`;

const newParse = `            const data = await response.json();
            if (data.candidates && data.candidates[0] && data.candidates[0].content) {
                // Concatenar TODAS las partes de texto (necesario con Search Grounding)
                const parts = data.candidates[0].content.parts || [];
                const fullText = parts
                    .filter(p => p.text)
                    .map(p => p.text)
                    .join('\\n');
                if (fullText.trim()) {
                    console.log(\`¡Éxito con modelo: \${model}!\`);
                    return fullText;
                }
            }`;

if (content.includes(oldParse)) {
    content = content.replace(oldParse, newParse);
    console.log('✅ FIX 1: Parseo de respuesta Gemini mejorado (multi-part + Search Grounding).');
    fixes++;
} else {
    console.log('❌ FIX 1 FALLO: No se encontró el parseo original.');
}

// ══════════════════════════════════════════════════════════════
// FIX 2: Actualizar modelos fallback (gemini-2.0-flash está deprecado)
// ══════════════════════════════════════════════════════════════
const oldModels = `    const modelsToTry = [
        "gemini-3.1-pro-preview",   // 1. PRINCIPAL: Ultra-potente (verificado)
        "gemini-2.5-pro",           // 2. Respaldo: Muy capaz
        "gemini-2.0-flash"          // 3. Fallback rápido
    ];`;

const newModels = `    const modelsToTry = [
        "gemini-3.1-pro-preview",   // 1. PRINCIPAL: Verificado y activo
        "gemini-2.5-pro",           // 2. Respaldo potente
        "gemini-2.5-flash"          // 3. Fallback rápido (flashier)
    ];`;

if (content.includes(oldModels)) {
    content = content.replace(oldModels, newModels);
    console.log('✅ FIX 2: Modelos actualizados (gemini-2.0-flash → gemini-2.5-flash).');
    fixes++;
}

// ══════════════════════════════════════════════════════════════
// FIX 3: Actualizar modelos en callGeminiMultimodal también
// ══════════════════════════════════════════════════════════════
const oldMultiModels = `    const modelsToTry = [
        "gemini-3.1-pro-preview",
        "gemini-2.5-pro",
        "gemini-2.0-flash"
    ];`;

const newMultiModels = `    const modelsToTry = [
        "gemini-3.1-pro-preview",
        "gemini-2.5-pro",
        "gemini-2.5-flash"
    ];`;

if (content.includes(oldMultiModels)) {
    content = content.replace(oldMultiModels, newMultiModels);
    console.log('✅ FIX 3: Modelos multimodal actualizados.');
    fixes++;
}

fs.writeFileSync(filePath, content, 'utf8');
console.log(`\n🎉 ${fixes} fix(es) aplicados. La API debería funcionar ahora.`);
console.log('Diagnóstico confirmó: gemini-3.1-pro-preview responde correctamente con +Search.');
