
import fs from 'fs';
import path from 'path';

const envPath = path.resolve(process.cwd(), '.env');
const envContent = fs.readFileSync(envPath, 'utf-8');
const match = envContent.match(/VITE_GOOGLE_API_KEY=(.*)/);

if (!match) process.exit(1);

const apiKey = match[1].trim();
console.log(`Usando Key: ${apiKey.slice(-4)}`);

async function list() {
    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`,
            { method: 'GET' }
        );
        const data = await response.json();
        if (data.models) {
            console.log("Modelos válidos:");
            data.models.forEach(m => {
                if (m.supportedGenerationMethods.includes('generateContent'))
                    console.log(`- ${m.name}`);
            });
        } else {
            console.error("Error listing:", data);
        }
    } catch (e) {
        console.error(e);
    }
}
list();
