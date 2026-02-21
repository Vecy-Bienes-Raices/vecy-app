const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'AppV2.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// Buscar la línea problemática
const oldLine = "                const name = userText.split(' ')[0]; // Tomar primer nombre";

const newLines = `                // CAPTURA INTELIGENTE DEL NOMBRE (Con limpieza PRO)
                // Regex: elimina prefijos como "Con", "Soy", "Me llamo", "De parte de"...
                let name = userText.replace(/^(hola|buenos dias|buenas tardes|soy|me llamo|mi nombre es|yo soy|es|hablo con|hablas con|con|de parte de)\\s+/i, '').trim();
                name = name.split(' ')[0].replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ]/g, '');
                if (name) name = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
                else name = 'Estimado Consultante';`;

if (content.includes(oldLine)) {
    content = content.replace(oldLine, newLines);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('✅ EXITO: Lógica de nombre actualizada correctamente.');
    console.log('   Antes: userText.split(" ")[0]  <- ERROR (tomaba "Con" de "Con Juan")');
    console.log('   Ahora: Regex elimina prefijos primero, luego extrae el nombre.');
} else {
    console.log('❌ No encontré la línea exacta. Buscando variantes...');
    const idx = content.indexOf("userText.split(' ')[0]");
    if (idx >= 0) {
        console.log('Encontrado en posición: ' + idx);
        console.log('Contexto:', content.substring(idx - 100, idx + 200));
    } else {
        console.log('No se encontró ninguna variante de split en el archivo.');
        console.log('Puede que ya esté corregido o el archivo tiene un formato diferente.');
    }
}
