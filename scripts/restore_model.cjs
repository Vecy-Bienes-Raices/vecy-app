const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'AppV2.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// ─── 1. Actualizar modelos en callGemini: Gemini 3.1 Pro como primario ───
const oldModels = `    const modelsToTry = [
        "gemini-2.0-flash",           // 1. Principal estable
        "gemini-2.0-flash-lite",      // 2. Rápido
        "gemini-1.5-flash",           // 3. Respaldo probado
        "gemini-1.5-flash-latest"     // 4. Fallback final
    ];`;

const newModels = `    const modelsToTry = [
        "gemini-3.1-pro-preview",   // 1. PRINCIPAL: Ultra-potente (verificado)
        "gemini-2.5-pro",           // 2. Respaldo: Muy capaz
        "gemini-2.0-flash"          // 3. Fallback rápido
    ];`;

if (content.includes(oldModels)) {
    content = content.replace(oldModels, newModels);
    console.log('✅ Modelos callGemini actualizados: gemini-3.1-pro-preview como primario.');
} else {
    // Búsqueda alternativa
    content = content.replace(
        /"gemini-2\.0-flash",\s*\/\/ 1\. Principal estable/,
        '"gemini-3.1-pro-preview",   // 1. PRINCIPAL: Ultra-potente (verificado)'
    );
    console.log('✅ Modelo primario actualizado a gemini-3.1-pro-preview.');
}

// ─── 2. Actualizar modelos en callGeminiMultimodal ───
const oldMultiModels = `    const modelsToTry = [
        "gemini-2.0-flash",
        "gemini-2.0-flash-lite",
        "gemini-1.5-flash"
    ];`;

const newMultiModels = `    const modelsToTry = [
        "gemini-3.1-pro-preview",
        "gemini-2.5-pro",
        "gemini-2.0-flash"
    ];`;

if (content.includes(oldMultiModels)) {
    content = content.replace(oldMultiModels, newMultiModels);
    console.log('✅ Modelos callGeminiMultimodal actualizados.');
}

// ─── 3. Re-activar Google Search Grounding (con formato correcto) ───
// El formato correcto para Gemini 2.0+ es: tools: [{ googleSearch: {} }]
// (camelCase, NO snake_case)
const oldGenConfig = `                        generationConfig: {
                            temperature: 0.75,
                            maxOutputTokens: 2048,
                        }
                    })
                }
            );`;

const newGenConfig = `                        tools: [{ googleSearch: {} }],
                        generationConfig: {
                            temperature: 0.75,
                            maxOutputTokens: 2048,
                        }
                    })
                }
            );`;

if (!content.includes('googleSearch')) {
    if (content.includes(oldGenConfig)) {
        content = content.replace(oldGenConfig, newGenConfig);
        console.log('✅ Google Search Grounding re-activado (formato correcto: googleSearch).');
    } else {
        // Alternativo: insertar antes del generationConfig del callGemini principal
        content = content.replace(
            /(\s*generationConfig: \{\n\s*temperature: 0\.75)/,
            '\n                        tools: [{ googleSearch: {} }],$1'
        );
        console.log('✅ Google Search Grounding re-activado (variante alternativa).');
    }
}

fs.writeFileSync(filePath, content, 'utf8');

// Verificar
const final = fs.readFileSync(filePath, 'utf8');
const hasModel = final.includes('gemini-3.1-pro-preview');
const hasSearch = final.includes('googleSearch');
console.log(`\n📋 ESTADO FINAL:`);
console.log(`   Modelo 3.1 Pro: ${hasModel ? '✅' : '❌'}`);
console.log(`   Google Search: ${hasSearch ? '✅ (activo - necesita billing)' : '❌'}`);
