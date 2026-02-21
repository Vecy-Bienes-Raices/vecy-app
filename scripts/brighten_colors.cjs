const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'AppV2.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// Reemplazar TODOS los tonos de dorado apagado por dorado luminoso vibrante
// bf953f → F5C518 (oro brillante)
// aa771c → D4900A (ámbar profundo)
// d4af37 → FFD700 (oro puro)
// bf953f/20 → FFD700/20
// bf953f/25 → FFD700/30
// bf953f/30 → FFD700/35
// bf953f/35 → FFD700/40
// bf953f/40 → FFD700/45
// d4af37/40 → FFD700/45
// d4af37/50 → FFD700/60

const replacements = [
    // Colores sólidos
    [/#bf953f/g, '#F5C518'],
    [/#aa771c/g, '#D4900A'],
    [/#d4af37/g, '#FFD700'],
    [/#c6922a/g, '#E8A900'],
    [/#f0d060/g, '#FFE566'],
    // Colores de texto en user messages
    [/#f5e8c0/g, '#FFF5CC'],
    // Gradiente del header
    [/from-\[#1a1506\]/g, 'from-[#1c1500]'],
    [/to-\[#1a1506\]/g, 'to-[#1c1500]'],
    // Hover del send button
    [/hover:from-\[#d4af37\]/g, 'hover:from-[#FFE033]'],
    [/hover:to-\[#c6922a\]/g, 'hover:to-[#E8A900]'],
];

let changes = 0;
for (const [pattern, replacement] of replacements) {
    const before = content;
    content = content.replace(pattern, replacement);
    if (content !== before) changes++;
}

// Actualizar el gradiente del botón send a oro más brillante
content = content.replace(
    'from-[#F5C518] to-[#D4900A] rounded-sm text-black transition-all',
    'from-[#FFD700] to-[#F5A500] rounded-sm text-black transition-all'
);

// Input box: borde y placeholder más visibles
content = content.replace(
    'focus:outline-none focus:border-[#F5C518] transition-colors placeholder-gray-600',
    'focus:outline-none focus:border-[#FFD700] focus:shadow-[0_0_8px_rgba(255,215,0,0.3)] transition-all placeholder-gray-500'
);

// Contenedor principal: borde más brillante
content = content.replace(
    'border-[#F5C518]/40',
    'border-[#FFD700]/50'
);

// Sombra exterior más brillante
content = content.replace(
    'shadow-[0_0_40px_rgba(191,149,63,0.18)]',
    'shadow-[0_0_50px_rgba(255,215,0,0.25)]'
);

fs.writeFileSync(filePath, content, 'utf8');
console.log(`✅ ${changes} grupos de colores actualizados a oro luminoso.`);
console.log('   #bf953f (café opaco) → #F5C518 (oro brillante)');
console.log('   #d4af37 (dorado bajo) → #FFD700 (oro puro)');
console.log('   #aa771c (bronce oscuro) → #D4900A (ámbar dorado)');
