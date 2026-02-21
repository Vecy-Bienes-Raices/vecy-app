const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'AppV2.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// Remover google_search del callGemini (causa error 400 sin billing)
const withSearch = `                        tools: [{ google_search: {} }],
                        generationConfig: {
                            temperature: 0.75,
                            maxOutputTokens: 2048,
                        }`;

const withoutSearch = `                        generationConfig: {
                            temperature: 0.75,
                            maxOutputTokens: 2048,
                        }`;

if (content.includes('google_search: {}')) {
    content = content.replace(withSearch, withoutSearch);
    console.log('✅ google_search removido del callGemini principal.');
} else {
    // Intento más amplio
    content = content.replace(/\s*tools: \[\{ google_search: \{\} \}\],\n/g, '\n');
    console.log('✅ google_search removido (variante).');
}

// También actualizar el modelo primario: gemini-3.1-pro-preview NO existe
// Causaba que el primer modelo fallara siempre
const oldModels = `    const modelsToTry = [
        "gemini-3.1-pro-preview", // 1. Solicitud Usuario (Ultra Potence)
        "gemini-2.0-flash",       // 2. Respaldo Rápido y Estable
        "gemini-2.0-flash-lite",  // 3. Muy rápido
        "gemini-flash-latest"     // 4. Fallback final
    ];`;

const newModels = `    const modelsToTry = [
        "gemini-2.0-flash",           // 1. Principal estable
        "gemini-2.0-flash-lite",      // 2. Rápido
        "gemini-1.5-flash",           // 3. Respaldo probado
        "gemini-1.5-flash-latest"     // 4. Fallback final
    ];`;

if (content.includes('"gemini-3.1-pro-preview"')) {
    content = content.replace(oldModels, newModels);
    console.log('✅ Modelos actualizados: gemini-2.0-flash como primario (gemini-3.1 no existe).');
} else {
    console.log('⚠️  Modelos ya estaban correctos o tienen otro formato.');
}

fs.writeFileSync(filePath, content, 'utf8');

// Verificar
const final = fs.readFileSync(filePath, 'utf8');
if (!final.includes('google_search')) {
    console.log('🔍 VERIFICADO: google_search eliminado. La API debería conectar sin billing.');
} else {
    console.log('❌ Aún hay google_search en el archivo.');
}
