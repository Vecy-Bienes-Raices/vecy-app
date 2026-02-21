// Test completo con el System Prompt real de Eddu-AI
const API_KEY = 'AIzaSyCxCtYC1kzPjS1DcPWLcAZ_eTfXkGojLz0';

const SYSTEM_PROMPT = `EDDU-AI — JURISTA ÉLITE DE VECY BIENES RAÍCES. Eres un abogado experto en derecho inmobiliario colombiano.`;

async function fullTest(withSearch) {
    const body = {
        contents: [{ 
            role: 'user', 
            parts: [
                { text: `INSTRUCCIONES DEL SISTEMA:\n${SYSTEM_PROMPT}\n\n` },
                { text: 'Hola, necesito saber sobre un arrendamiento.' }
            ] 
        }],
        generationConfig: { temperature: 0.75, maxOutputTokens: 300 }
    };
    if (withSearch) body.tools = [{ googleSearch: {} }];
    
    const label = withSearch ? 'CON Search' : 'SIN Search';
    console.log(`\n🔄 Probando gemini-3.1-pro-preview ${label}...`);
    
    const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-pro-preview:generateContent?key=${API_KEY}`,
        { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }
    );
    
    const text = await res.text();
    if (res.ok) {
        const data = JSON.parse(text);
        const parts = data.candidates?.[0]?.content?.parts || [];
        const fullText = parts.filter(p => p.text).map(p => p.text).join('\n');
        console.log(`✅ ÉXITO ${label}`);
        console.log(`   Respuesta (primeros 200 chars): "${fullText.substring(0, 200)}"`);
    } else {
        let errMsg = text;
        try { errMsg = JSON.parse(text).error?.message || text; } catch(_) {}
        console.log(`❌ FALLO ${label} → HTTP ${res.status}: ${errMsg.substring(0, 300)}`);
    }
}

(async () => {
    await fullTest(false);
    await fullTest(true);
})();
