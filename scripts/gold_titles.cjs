const fs = require('fs');
const path = require('path');

// ─────────────────────────────────────────────
// PALETA "DORADO ELÉCTRICO" (elegante, no amarillo)
// Alta luminosidad + calidez ámbar → se lee como ORO
// ─────────────────────────────────────────────
const ELECTRIC_GOLD      = '#E8A800'; // Principal: dorado vibrante cálido
const ELECTRIC_GOLD_DEEP = '#C9890A'; // Secundario: dorado profundo
const ELECTRIC_GOLD_TEXT = '#F0C040'; // Para texto pequeño: dorado claro legible

const files = [
    path.join(__dirname, 'src', 'AppV2.jsx'),
    path.join(__dirname, 'src', 'App.jsx'),
];

let totalFixes = 0;

for (const filePath of files) {
    let content = fs.readFileSync(filePath, 'utf8');
    const fileName = path.basename(filePath);
    let fixes = 0;

    // 1. Reemplazar #FFD700 (amarillo eléctrico) por dorado cálido
    const before1 = content;
    content = content.replace(/#FFD700/g, ELECTRIC_GOLD_TEXT);
    if (content !== before1) { fixes++; console.log(`✅ ${fileName}: #FFD700 → ${ELECTRIC_GOLD_TEXT} (dorado suave legible)`); }

    // 2. Reemplazar #F5C518 (amarillo-dorado) por dorado vibrante
    const before2 = content;
    content = content.replace(/#F5C518/g, ELECTRIC_GOLD);
    if (content !== before2) { fixes++; console.log(`✅ ${fileName}: #F5C518 → ${ELECTRIC_GOLD}`); }

    // 3. Todos los h1/h2/h3/h4 con text-white → dorado eléctrico
    // Patrón: <h[1-4] className="...text-white..."
    const updated = content.replace(
        /<(h[1-4])\s+className="([^"]*?)text-white([^"]*?)"/g,
        (match, tag, before, after) => {
            fixes++;
            // Agregar el dorado pero mantener el resto de clases
            return `<${tag} className="${before}text-[${ELECTRIC_GOLD}]${after}"`;
        }
    );

    // 4. En template literals ` también
    const updated2 = updated.replace(
        /<(h[1-4])\s+className={`([^`]*?)text-white([^`]*?)`}/g,
        (match, tag, before, after) => {
            fixes++;
            return `<${tag} className={\`${before}text-[${ELECTRIC_GOLD}]${after}\`}`;
        }
    );

    if (fixes > 0) {
        fs.writeFileSync(filePath, updated2, 'utf8');
        totalFixes += fixes;
    } else {
        console.log(`ℹ️  ${fileName}: Sin cambios.`);
    }
}

// Buscar en páginas también
const pagesDir = path.join(__dirname, 'src', 'pages');
if (fs.existsSync(pagesDir)) {
    const pageFiles = fs.readdirSync(pagesDir).filter(f => f.endsWith('.jsx'));
    for (const pf of pageFiles) {
        const fp = path.join(pagesDir, pf);
        let c = fs.readFileSync(fp, 'utf8');
        let fixes = 0;
        const u = c
            .replace(/#FFD700/g, () => { fixes++; return ELECTRIC_GOLD_TEXT; })
            .replace(/#F5C518/g, () => { fixes++; return ELECTRIC_GOLD; })
            .replace(/<(h[1-4])\s+className="([^"]*?)text-white([^"]*?)"/g, (m, tag, b, a) => {
                fixes++;
                return `<${tag} className="${b}text-[${ELECTRIC_GOLD}]${a}"`;
            });
        if (fixes > 0) {
            fs.writeFileSync(fp, u, 'utf8');
            totalFixes += fixes;
            console.log(`✅ pages/${pf}: ${fixes} fixes`);
        }
    }
}

console.log(`\n🏆 TOTAL: ${totalFixes} cambios aplicados.`);
console.log(`   Paleta: "${ELECTRIC_GOLD}" = dorado eléctrico elegante`);
console.log(`   ${ELECTRIC_GOLD} ≠ amarillo; es ORO cálido con luminosidad alta.`);
