const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'AppV2.jsx');
let content = fs.readFileSync(filePath, 'utf8');

const oldLine = "                const name = userText.split(' ')[0]; // Tomar primer nombre";

const newLines = [
    "                // CAPTURA INTELIGENTE DEL NOMBRE (Con limpieza PRO)",
    "                let name = userText.replace(/^(hola|buenos dias|buenas tardes|soy|me llamo|mi nombre es|yo soy|es|hablo con|hablas con|con|de parte de)\\s+/i, '').trim();",
    "                name = name.split(' ')[0].replace(/[^a-zA-Z\\u00e1\\u00e9\\u00ed\\u00f3\\u00fa\\u00c1\\u00c9\\u00cd\\u00d3\\u00da\\u00f1\\u00d1]/g, '');",
    "                if (name) name = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();",
    "                else name = 'Estimado Consultante';"
].join('\n');

if (content.includes(oldLine)) {
    content = content.replace(oldLine, newLines);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('EXITO: Logica de nombre actualizada.');
    console.log('Antes: userText.split(" ")[0]  (tomaba "Con" de "Con Juan")');
    console.log('Ahora: Regex que elimina prefijos primero y luego extrae el nombre.');
} else {
    // Buscar variante sin comentario
    const altLine = "                const name = userText.split(' ')[0];";
    if (content.includes(altLine)) {
        content = content.replace(altLine, newLines);
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('EXITO (variante): Logica de nombre actualizada.');
    } else {
        console.log('NOTA: La linea no fue encontrada. El archivo puede estar en un estado diferente.');
        console.log('Mostrando busqueda de "split" en el archivo:');
        const idx = content.indexOf("userText.split");
        console.log('Posicion del split:', idx);
        if (idx > 0) {
            console.log('Contexto:', content.substring(idx - 80, idx + 150));
        }
    }
}
