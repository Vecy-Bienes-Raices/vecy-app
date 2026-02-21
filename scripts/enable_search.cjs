const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'AppV2.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// ── 1. Activar Google Search Grounding en el body de la petición API ──
// Buscamos el bloque generationConfig actual y le agregamos tools antes de él
const oldConfig = `                         body: JSON.stringify({
                        contents: [{
                            role: 'user',
                            parts: [
                                { text: systemInstruction ? \`INSTRUCCIONES DEL SISTEMA:\\n\${systemInstruction}\\n\\n\` : "" },
                                { text: prompt }
                            ]
                        }],
                        generationConfig: {
                            temperature: 0.7,
                            maxOutputTokens: 2000,
                        }
                    })`;

const newConfig = `                         body: JSON.stringify({
                        contents: [{
                            role: 'user',
                            parts: [
                                { text: systemInstruction ? \`INSTRUCCIONES DEL SISTEMA:\\n\${systemInstruction}\\n\\n\` : "" },
                                { text: prompt }
                            ]
                        }],
                        tools: [{
                            google_search: {}
                        }],
                        generationConfig: {
                            temperature: 0.7,
                            maxOutputTokens: 2048,
                        }
                    })`;

// Búsqueda flexible: quitar espacios extra para encontrar el bloque
// Vamos a buscar la parte clave de la función
const oldLine = '                        generationConfig: {\r\n                            temperature: 0.7,\r\n                            maxOutputTokens: 2000,\r\n                        }';
const newLine = `                        tools: [{ google_search: {} }],
                        generationConfig: {
                            temperature: 0.75,
                            maxOutputTokens: 2048,
                        }`;

if (content.includes('google_search')) {
    console.log('✅ Google Search Grounding ya estaba activado.');
} else if (content.includes('maxOutputTokens: 2000')) {
    content = content.replace(
        'maxOutputTokens: 2000,',
        'maxOutputTokens: 2048,\n                        }\n                    });\n                    // dummy fix - removing'
    );
    // Simpler approach: just insert tools line before generationConfig
    content = content.replace(
        '                        generationConfig: {\n                            temperature: 0.7,\n                            maxOutputTokens: 2000,\n                        }',
        '                        tools: [{ google_search: {} }],\n                        generationConfig: {\n                            temperature: 0.75,\n                            maxOutputTokens: 2048,\n                        }'
    );
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('✅ EXITO: Google Search Grounding activado.');
} else {
    // Probar con CRLF
    const crlfOld = 'generationConfig: {\r\n                            temperature: 0.7,\r\n                            maxOutputTokens: 2000,\r\n                        }';
    const crlfNew = 'tools: [{ google_search: {} }],\r\n                        generationConfig: {\r\n                            temperature: 0.75,\r\n                            maxOutputTokens: 2048,\r\n                        }';
    
    if (content.includes('maxOutputTokens: 2000')) {
        content = content.replace(crlfOld, crlfNew);
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('✅ EXITO (CRLF): Google Search Grounding activado.');
    } else {
        // Búsqueda por índice
        const idx = content.indexOf('maxOutputTokens:');
        console.log('Índice de maxOutputTokens:', idx);
        console.log('Contexto:', content.substring(idx - 100, idx + 80));
        
        // Reemplazo agresivo: encontrar 'maxOutputTokens: 20' y reemplazar el bloque
        content = content.replace(
            /tools: \[.*?\],\s*/s, ''  // Eliminar si ya existe un tools
        );
        content = content.replace(
            /(generationConfig: \{[^}]*\})/s,
            'tools: [{ google_search: {} }],\n                        $1'
        );
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('✅ EXITO (regex): Google Search Grounding activado.');
    }
}

// Verificar
const verification = fs.readFileSync(filePath, 'utf8');
if (verification.includes('google_search')) {
    console.log('🔍 VERIFICADO: "google_search" encontrado en el archivo.');
} else {
    console.log('❌ No se pudo verificar. Revisa manualmente.');
}
