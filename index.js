const https = require('https');

async function run() {
    try {
        // Получаем входные данные из переменных окружения (Gitea передает их так)
        const url = process.env.INPUT_URL;
        const text = process.env.INPUT_TEXT;
        const alias = process.env.INPUT_ALIAS;
        const avatar = process.env.INPUT_AVATAR;
        const color = process.env.INPUT_COLOR;
        const linksRaw = process.env.INPUT_LINKS || "";

        // Парсим ссылки из формата "Название|URL"
        const fields = linksRaw
            .split('\n')
            .filter(line => line.trim() !== "" && line.includes('|'))
            .map(line => {
                const [title, link] = line.split('|');
                return {
                    short: true,
                    title: title.trim(),
                    value: `[${title.trim()}](${link.trim()})`
                };
            });

        // Формируем объект сообщения
        const payload = {
            alias: alias,
            avatar: avatar,
            text: text,
            attachments: [{
                color: color,
                fields: fields
            }]
        };

        const data = JSON.stringify(payload);

        // Настройки HTTP-запроса
        const urlObj = new URL(url);
        const options = {
            hostname: urlObj.hostname,
            path: urlObj.pathname + urlObj.search,
            method: 'POST',
            headers: {
                'Content-Type:': 'application/json',
                'Content-Length': Buffer.byteLength(data)
            }
        };

        // Отправка
        const req = https.request(options, (res) => {
            console.log(`Status: ${res.statusCode}`);
            res.on('data', d => process.stdout.write(d));
        });

        req.on('error', (e) => {
            console.error(`Error: ${e.message}`);
            process.exit(1);
        });

        req.write(data);
        req.end();

    } catch (error) {
        console.error(error.message);
        process.exit(1);
    }
}

run();