const https = require('https');
const TEMPLATES = require('./templates');

function parseInputList(rawInput) {
    const result = {};
    if (!rawInput) return result;
    rawInput.split('\n').forEach(line => {
        const trimmed = line.trim();
        if (trimmed && trimmed.includes('|')) {
            const [key, ...valueParts] = trimmed.split('|');
            result[key.trim()] = valueParts.join('|').trim();
        }
    });
    return result;
}

async function run() {
    try {
        const {
            INPUT_URL: url,
            INPUT_TEMPLATE: templateName = 'custom',
            INPUT_TEXT: defaultText = '',
            INPUT_PARAMS: rawParams = '',
            INPUT_LINKS: rawLinks = '',
            INPUT_ALIAS: alias = 'Gitea Bot',
            INPUT_AVATAR: avatar,
            INPUT_COLOR: color = '#00ff00'
        } = process.env;

        if (!url) throw new Error("URL is required");

        const params = parseInputList(rawParams);
        const links = parseInputList(rawLinks);

        const templateFn = TEMPLATES[templateName] || TEMPLATES['custom'];
        const messageText = templateFn(params, defaultText);

        const fields = Object.entries(links).map(([title, link]) => ({
            short: true,
            title: title,
            value: `[Открыть](${link})`
        }));

        const payload = JSON.stringify({
            alias,
            avatar,
            text: messageText,
            attachments: [{ color, fields }]
        });

        const urlObj = new URL(url);
        const options = {
            hostname: urlObj.hostname,
            path: urlObj.pathname + urlObj.search,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(payload)
            }
        };

        await new Promise((resolve, reject) => {
            const req = https.request(options, (res) => {
                let chunks = '';
                res.on('data', (chunk) => chunks += chunk);
                res.on('end', () => {
                    console.log(`Status: ${res.statusCode}`);
                    if (res.statusCode >= 400) {
                        reject(new Error(`Server returned status ${res.statusCode}: ${chunks}`));
                    } else {
                        resolve();
                    }
                });
            });

            req.on('error', (e) => reject(e));
            req.on('timeout', () => {
                req.destroy();
                reject(new Error('Request timed out'));
            });

            req.write(payload);
            req.end();
        });

        console.log("Уведомление успешно отправлено.");
        process.exit(0); 

    } catch (error) {
        console.error("Ошибка:", error.message);
        process.exit(1);
    }
}

run();