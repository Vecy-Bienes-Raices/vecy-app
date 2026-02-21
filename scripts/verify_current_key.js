
import fs from 'fs';
import path from 'path';

// Leer .env manualmente para no depender de paquetes
const envPath = path.resolve(process.cwd(), '.env');
const envContent = fs.readFileSync(envPath, 'utf-8');
const match = envContent.match(/VITE_GOOGLE_API_KEY=(.*)/);

if (!match) {
    console.error("❌ No se encontró VITE_GOOGLE_API_KEY en .env");
    process.exit(1);
}

const apiKey = match[1].trim();
console.log(`Clave encontrada: ${apiKey.substring(0, 5)}...${apiKey.slice(-4)}`);

const model = 'gemini-1.5-flash';

async function test() {
    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: "Hola" }] }]
                })
            }
        );

        if (response.ok) {
            const data = await response.json();
            console.log("✅ API Key FUNCTIONAL!");
        } else {
            console.error(`❌ API ERROR: ${response.status} - ${response.statusText}`);
            console.error(await response.text());
        }
    } catch (e) {
        console.error("❌ EXCEPTION:", e);
    }
}

test();
