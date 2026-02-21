const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'AppV2.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// El script anterior arruinó el bloque de generationConfig. Lo reparamos:
// Buscamos el bloque roto y lo reemplazamos con la versión correcta + google_search

const brokenBlock = `                        generationConfig: {
                            temperature: 0.7,
                            maxOutputTokens: 2048,
                        }
                    });
                    // dummy fix - removing
                        }
                    })`;

const fixedBlock = `                        tools: [{ google_search: {} }],
                        generationConfig: {
                            temperature: 0.75,
                            maxOutputTokens: 2048,
                        }
                    })`;

if (content.includes('dummy fix')) {
    // Normalizar a LF para el reemplazo
    let normalized = content.replace(/\r\n/g, '\n');
    const brokenBlockLF = brokenBlock.replace(/\r\n/g, '\n');
    const fixedBlockLF = fixedBlock.replace(/\r\n/g, '\n');
    
    if (normalized.includes(brokenBlockLF)) {
        normalized = normalized.replace(brokenBlockLF, fixedBlockLF);
        fs.writeFileSync(filePath, normalized, 'utf8');
        console.log('✅ REPARADO Y ACTUALIZADO: Bloque de API corregido con google_search activado.');
    } else {
        // Reemplazo agresivo con regex
        normalized = normalized.replace(
            /generationConfig: \{\s*temperature: [0-9.]+,\s*maxOutputTokens: \d+,\s*\}\s*\}\);\s*\/\/ dummy fix - removing\s*\}\s*\}\)/s,
            `tools: [{ google_search: {} }],\n                        generationConfig: {\n                            temperature: 0.75,\n                            maxOutputTokens: 2048,\n                        }\n                    })`
        );
        fs.writeFileSync(filePath, normalized, 'utf8');
        console.log('✅ REPARADO (regex agresivo): Bloque de API corregido.');
    }
} else if (content.includes('google_search')) {
    console.log('✅ google_search ya está presente en el archivo.');
} else {
    console.log('⚠️  No se encontró el bloque roto ni google_search. Estado desconocido.');
}

// Verificación
const final = fs.readFileSync(filePath, 'utf8');
if (final.includes('google_search')) {
    console.log('🔍 VERIFICADO: google_search encontrado en el archivo.');
} else {
    console.log('❌ FALLO VERIFICACIÓN: google_search NO encontrado.');
}
if (final.includes('dummy fix')) {
    console.log('❌ FALLO: Todavía hay código corrupto.');
} else {
    console.log('✅ Código limpio. Sin residuos del script anterior.');
}
