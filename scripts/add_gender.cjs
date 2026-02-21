const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'AppV2.jsx');
let content = fs.readFileSync(filePath, 'utf8');
let fixes = 0;

// ══════════════════════════════════════════════════════════════════
// FIX 1: Agregar estado userGender al componente EdduAIChat
// ══════════════════════════════════════════════════════════════════
const oldUserNameState = `    const [userName, setUserName] = useState('');`;
const newUserNameState = `    const [userName, setUserName] = useState('');
    const [userGender, setUserGender] = useState('neutral'); // 'male' | 'female' | 'neutral'`;

if (!content.includes('userGender')) {
    if (content.includes(oldUserNameState)) {
        content = content.replace(oldUserNameState, newUserNameState);
        console.log('✅ FIX 1: Estado userGender agregado.');
        fixes++;
    } else {
        console.log('❌ FIX 1 FALLO: No se encontró useState de userName.');
    }
}

// ══════════════════════════════════════════════════════════════════
// FIX 2: Agregar función de detección de género
//        (Antes del componente EdduAIChat, en la zona de utils)
// ══════════════════════════════════════════════════════════════════
const genderAnchor = '// --- COMPONENTES ---';
const genderUtil = `// --- UTILS DE GÉNERO ---
const detectGender = (name) => {
    if (!name) return 'neutral';
    const n = name.toLowerCase().trim();

    // Nombres inequívocamente femeninos comunes (Colombia/Latam)
    const femaleNames = [
        'maria','ana','laura','diana','andrea','carolina','paola','claudia',
        'patricia','monica','sandra','alejandra','natalia','catalina','valentina',
        'isabella','sara','sofia','camila','daniela','juliana','adriana','viviana',
        'martha','luisa','isabel','rosa','carmen','gloria','esperanza','luz',
        'helena','elena','manuela','paula','mariana','ximena','lorena','marcela',
        'lina','angela','blanca','cecilia','nora','pilar','teresa','olga',
        'constanza','alejandra','estefania','vanessa','yolanda','claudia',
        'silvia','liliana','tatiana','fernanda','michelle','stephanie','jennifer'
    ];

    // Nombres inequívocamente masculinos comunes
    const maleNames = [
        'juan','carlos','jose','luis','andres','jorge','miguel','david','oscar',
        'daniel','alberto','alejandro','pedro','ricardo','mario','hector','sergio',
        'pablo','gabriel','nicolas','sebastian','santiago','camilo','cesar',
        'felipe','rafael','antonio','manuel','francisco','rodrigo','ivan','john',
        'william','christian','jaime','javier','victor','edgar','wilson','henry',
        'alex','roberto','nelson','marco','diego','alonso','bernardo','hernan',
        'gilberto','giovanny','leonardo','oliver','samuel','mateo','tomas','eduardo'
    ];

    if (femaleNames.includes(n)) return 'female';
    if (maleNames.includes(n)) return 'male';

    // Heurística: terminaciones típicas del español
    if (n.endsWith('a') || n.endsWith('ia') || n.endsWith('ina') || n.endsWith('ela')) return 'female';
    if (n.endsWith('o') || n.endsWith('er') || n.endsWith('el') || n.endsWith('on') || n.endsWith('in')) return 'male';

    return 'neutral';
};

// --- COMPONENTES ---`;

if (!content.includes('detectGender')) {
    if (content.includes(genderAnchor)) {
        content = content.replace(genderAnchor, genderUtil);
        console.log('✅ FIX 2: Función detectGender agregada.');
        fixes++;
    } else {
        console.log('❌ FIX 2 FALLO: No se encontró anchor de COMPONENTES.');
    }
}

// ══════════════════════════════════════════════════════════════════
// FIX 3: Usar detectGender en el bloque asking_name
//        Después de: if (name) name = name.charAt(0)...
// ══════════════════════════════════════════════════════════════════
const oldNameFinalize = `                if (name) name = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
                else name = 'Estimado Consultante';
                setUserName(name);
                setChatStage('active');`;

const newNameFinalize = `                if (name) name = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
                else name = 'Consultante';
                const detectedGender = detectGender(name);
                setUserName(name);
                setUserGender(detectedGender);
                setChatStage('active');`;

if (content.includes(oldNameFinalize)) {
    content = content.replace(oldNameFinalize, newNameFinalize);
    console.log('✅ FIX 3: Detección de género activa en el bloque asking_name.');
    fixes++;
} else {
    console.log('❌ FIX 3 FALLO: No se encontró el bloque de finalización de nombre.');
}

// ══════════════════════════════════════════════════════════════════
// FIX 4: Saludo de bienvenida con tratamiento de género
// ══════════════════════════════════════════════════════════════════
const oldWelcomeText = `                    text: (() => {
                        const opts = [
                            \`Es un honor, **\${name}**. ⚖️ Soy **Eddu-AI**, su Jurista de confianza. ¿Cuál es el desafío legal de hoy?\`,
                            \`Bienvenido, **\${name}**. 🏛️ Pongo a su disposición toda mi inteligencia jurídica. ¿En qué le asisto?\`,
                            \`Un gusto, **\${name}**. 🤝 Listo para analizar su caso con rigor jurídico. ¿Comenzamos?\`
                        ];
                        return opts[Math.floor(Math.random() * opts.length)];
                    })()`;

const newWelcomeText = `                    text: (() => {
                        const tratamiento = detectedGender === 'female' ? 'Señora' : detectedGender === 'male' ? 'Señor' : 'Estimado(a)';
                        const bienvenida = detectedGender === 'female' ? 'Bienvenida' : 'Bienvenido';
                        const opts = [
                            \`Es un honor, **\${tratamiento} \${name}**. ⚖️ Soy **Eddu-AI**, su Jurista de confianza. ¿Cuál es el desafío legal de hoy?\`,
                            \`\${bienvenida}, **\${name}**. 🏛️ Pongo a su disposición toda mi inteligencia jurídica. ¿En qué le asisto?\`,
                            \`Un gusto, **\${tratamiento} \${name}**. 🤝 Listo para analizar su caso con rigor jurídico. ¿Comenzamos?\`
                        ];
                        return opts[Math.floor(Math.random() * opts.length)];
                    })()`;

if (content.includes(oldWelcomeText)) {
    content = content.replace(oldWelcomeText, newWelcomeText);
    console.log('✅ FIX 4: Saludo con tratamiento de género (Señor/Señora).');
    fixes++;
} else {
    console.log('⚠️  FIX 4: No se encontró el welcome text variado. Puede que tenga otro formato.');
}

// ══════════════════════════════════════════════════════════════════
// FIX 5: Actualizar el prompt para usar género en tratamiento
// ══════════════════════════════════════════════════════════════════
const oldPromptIdentity = `            Hablas con el usuario llamado **\${userName}**.`;
const newPromptIdentity = `            Hablas con: **\${userGender === 'female' ? 'Señora' : userGender === 'male' ? 'Señor' : ''} \${userName}**.
            Tratamiento correcto: \${userGender === 'female' ? 'Señora/Estimada/ella' : userGender === 'male' ? 'Señor/Estimado/él' : 'Estimado(a)/neutro'}.
            USA SIEMPRE el tratamiento que corresponde al género. Nunca uses el opuesto.`;

if (content.includes(oldPromptIdentity)) {
    content = content.replace(oldPromptIdentity, newPromptIdentity);
    console.log('✅ FIX 5: Prompt actualizado con instrucción de género.');
    fixes++;
} else {
    console.log('⚠️  FIX 5: No se encontró el texto del prompt de identidad.');
}

// Guardar
fs.writeFileSync(filePath, content, 'utf8');
console.log(`\n🎉 ${fixes} corrección(es) de género aplicadas exitosamente.`);
console.log('Cobertura: 60+ nombres colombianos + heurística de terminaciones españolas.');
