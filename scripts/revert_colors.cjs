const fs = require('fs');
const path = require('path');

const files = [
    path.join(__dirname, 'src', 'AppV2.jsx'),
    path.join(__dirname, 'src', 'App.jsx'),
];

let totalFixes = 0;

for (const filePath of files) {
    let content = fs.readFileSync(filePath, 'utf8');
    const fileName = path.basename(filePath);
    let fixes = 0;

    const before = content;

    // 1. Revertir E8A800 → bf953f (dorado suave original)
    content = content.replace(/#E8A800/g, '#bf953f');
    // 2. Revertir D4900A → aa771c (bronce profundo original)
    content = content.replace(/#D4900A/g, '#aa771c');
    // 3. Revertir F0C040 → d4af37 (dorado clásico suave)
    content = content.replace(/#F0C040/g, '#d4af37');
    // 4. Revertir FFE566 → d4af37
    content = content.replace(/#FFE566/g, '#d4af37');
    // 5. Revertir E8A900 → aa771c
    content = content.replace(/#E8A900/g, '#aa771c');

    // 6. Restaurar text-white en todos los h1-h4 que se cambiaron a text-[#E8A800]
    content = content.replace(
        /<(h[1-4])\s+className="([^"]*?)text-\[#bf953f\]([^"]*?)"/g,
        (match, tag, before2, after) => {
            fixes++;
            return `<${tag} className="${before2}text-white${after}"`;
        }
    );

    if (content !== before) {
        fixes++;
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ ${fileName}: colores revertidos al dorado original.`);
    } else {
        console.log(`ℹ️  ${fileName}: sin cambios (ya están en el original).`);
    }
    totalFixes += fixes;
}

// Pages también
const pagesDir = path.join(__dirname, 'src', 'pages');
if (fs.existsSync(pagesDir)) {
    const pageFiles = fs.readdirSync(pagesDir).filter(f => f.endsWith('.jsx'));
    for (const pf of pageFiles) {
        const fp = path.join(pagesDir, pf);
        let c = fs.readFileSync(fp, 'utf8');
        const u = c
            .replace(/#E8A800/g, '#bf953f')
            .replace(/#D4900A/g, '#aa771c')
            .replace(/#F0C040/g, '#d4af37')
            .replace(/<(h[1-4])\s+className="([^"]*?)text-\[#bf953f\]([^"]*?)"/g,
                (m, tag, b, a) => `<${tag} className="${b}text-white${a}"`);
        if (c !== u) {
            fs.writeFileSync(fp, u, 'utf8');
            console.log(`✅ pages/${pf}: colores revertidos.`);
            totalFixes++;
        }
    }
}

console.log(`\n🔄 Reversión completa. ${totalFixes} archivos restaurados.`);
console.log('   Colores originales: #bf953f (dorado suave) + #d4af37 (oro clásico)');
console.log('   Títulos h1-h4: text-white restaurado.');
console.log('   ✅ "VECY / Jurídico IA" → conservado.');
