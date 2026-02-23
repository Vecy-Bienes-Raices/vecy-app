/**
 * EDDU-AI BACKEND SERVER
 * Servidor proxy para llamadas a Gemini API con Google Search Grounding.
 * Puerto: 3800 — Corre con: node eddu-api-server.cjs
 */
const http = require('http');
const https = require('https');

// Cargar .env manualmente (ya que no hay dotenv instalado)
const fs = require('fs');
const path = require('path');
try {
    const envPath = path.join(__dirname, '.env');
    if (fs.existsSync(envPath)) {
        const envFile = fs.readFileSync(envPath, 'utf8');
        envFile.split('\n').forEach(line => {
            const [key, ...value] = line.split('=');
            if (key && value) process.env[key.trim()] = value.join('=').trim();
        });
    }
} catch (e) { console.error("Error cargando .env:", e); }

const PORT = 3800;
const API_KEY = process.env.VITE_GOOGLE_API_KEY;

const MODELS = [
    'gemini-1.5-flash',       // ECONÓMICO Y VELOZ (RECOMENDADO)
    'gemini-2.0-flash-exp',
    'gemini-1.5-pro',
    'gemini-3.1-pro-preview'
];

// Función para llamar a Gemini API con Search Grounding y Memoria
async function callGemini(contents, withSearch = true) {
    for (const model of MODELS) {
        const body = JSON.stringify({
            contents, // Enviar historial completo
            ...(withSearch ? { tools: [{ googleSearch: {} }] } : {}),
            generationConfig: { temperature: 0.7, maxOutputTokens: 8192 }
        });

        const result = await new Promise((resolve) => {
            const options = {
                hostname: 'generativelanguage.googleapis.com',
                path: `/v1beta/models/${model}:generateContent?key=${API_KEY}`,
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) }
            };

            const req = https.request(options, (res) => {
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => resolve({ status: res.statusCode, body: data, model }));
            });
            req.on('error', (e) => resolve({ status: 500, body: e.message, model }));
            req.setTimeout(30000, () => { req.abort(); resolve({ status: 408, body: 'timeout', model }); });
            req.write(body);
            req.end();
        });

        if (result.status === 200) {
            try {
                const json = JSON.parse(result.body);
                const parts = json.candidates?.[0]?.content?.parts || [];
                const text = parts.filter(p => p.text).map(p => p.text).join('\n');
                if (text.trim()) {
                    console.log(`✅ Éxito con ${result.model}`);
                    return text;
                }
            } catch (_) { }
        } else {
            console.warn(`⚠️  ${result.model} → HTTP ${result.status} - ${result.body}`);
        }
    }
    throw new Error('Todos los modelos fallaron.');
}

// Servidor HTTP simple (sin dependencias externas)
const server = http.createServer(async (req, res) => {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') { res.writeHead(200); res.end(); return; }

    if (req.method === 'POST' && req.url === '/api/chat') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', async () => {
            try {
                const { history, newParts } = JSON.parse(body);
                
                // Construir historial completo para Gemini
                // Nota: Gemini no soporta 'system' role en 'contents'. El system prompt va aparte o como user message inicial.
                // Aquí asumimos que 'history' ya viene formateado correctamente por el frontend.
                // Si history es vacío, es el primer mensaje.
                
                let contents = history || [];
                contents.push({ role: 'user', parts: newParts });

                // Solo activar búsqueda si el usuario parece requerir datos externos actuales
                const userText = newParts.map(p => p.text).join(' ').toLowerCase();
                const needsSearch = /(actualidad|noticias|hoy|precio dólar|clima|busca en internet)/.test(userText);

                const text = await callGemini(contents, needsSearch); 
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ text }));
            } catch (e) {
                console.error(e);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: e.message }));
            }
        });
        return;
    }

    if (req.method === 'GET' && req.url === '/') {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(`
            <div style="font-family: sans-serif; text-align: center; padding: 50px; background: #0e0e0e; color: #d4af37; height: 100vh;">
                <h1>🏛️ EDDU-AI Backend v4.0</h1>
                <p>Estado: <span style="color: #10b981;">● EN LÍNEA</span></p>
                <p>Cerebro Principal: <b>Gemini 3.1 Pro Preview</b></p>
                <hr style="border: 0; border-top: 1px solid #333; width: 300px; margin: 20px auto;">
                <p style="color: #666; font-size: 12px;">Para depuración: El puerto 3800 está respondiendo correctamente.</p>
            </div>
        `);
        return;
    }

    res.writeHead(404);
    res.end(JSON.stringify({ error: 'Ruta no encontrada' }));
});

server.listen(PORT, () => {
    console.log(`\n🟢 EDDU-AI Backend corriendo en http://localhost:${PORT}`);
    console.log(`   Modelos: ${MODELS.join(' → ')}`);
    console.log(`   Google Search Grounding: ACTIVO`);
    console.log(`   API Key: ${API_KEY ? `...${API_KEY.slice(-4)}` : 'NO CONFIGURADA'}\n`);
});
