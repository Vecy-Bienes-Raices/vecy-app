const API_KEY = 'AIzaSyCxCtYC1kzPjS1DcPWLcAZ_eTfXkGojLz0';

async function testModel(modelName, withSearch) {
    const body = {
        contents: [{ role: 'user', parts: [{ text: 'Responde con una sola palabra: Colombia' }] }],
        generationConfig: { temperature: 0.1, maxOutputTokens: 50 }
    };
    if (withSearch) body.tools = [{ googleSearch: {} }];
    const label = withSearch ? '+Search' : '-Search';

    const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${API_KEY}`,
        { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }
    );

    const text = await res.text();
    if (res.ok) {
        const data = JSON.parse(text);
        const respText = data.candidates?.[0]?.content?.parts?.[0]?.text || 'sin texto';
        console.log(`✅ [${modelName} ${label}] → "${respText.trim().substring(0,40)}"`);
        return true;
    } else {
        let errMsg = text;
        try { errMsg = JSON.parse(text).error?.message || text; } catch(_) {}
        console.log(`❌ [${modelName} ${label}] HTTP ${res.status} → ${errMsg.substring(0, 200)}`);
        return false;
    }
}

(async () => {
    console.log('=== DIAGNÓSTICO API GEMINI ===\n');
    const models = ['gemini-3.1-pro-preview', 'gemini-2.5-pro', 'gemini-2.0-flash'];
    for (const model of models) {
        await testModel(model, false);
        await testModel(model, true);
        console.log('');
    }
    console.log('=== FIN DIAGNÓSTICO ===');
})();
