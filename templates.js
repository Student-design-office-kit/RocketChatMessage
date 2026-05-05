/*
 * Словарь шаблонов сообщений.
 * p - объект с параметрами из INPUT_PARAMS
 * defaultText - запасной текст из INPUT_TEXT
*/
const TEMPLATES = {
    // Шаблон: Успешный деплой
    'deploy_success': (p) => {
        const emoji = p.PROJECT_EMOJI || '🚀';
        const name = p.PROJECT_NAME || 'Project';
        const actor = p.ACTOR || 'User';
        const commit = p.COMMIT_MESSAGE || '...';
        
        return `${emoji} -------- ${name} --------- ${emoji}\n` +
               ` 🚀 ОБНОВА УЖЕ НА СЕРВЕРЕ 🚀\n` +
               ` \`${actor}\` залил коммит: ${commit}`;
    },

    // Шаблон: Общая ошибка аудита
    'audit_error': (p) => {
        const name = p.PROJECT_NAME || 'Project';
        const list = p.FAILED_LIST || 'всех директорий';
        
        return `Проект: ${name}\n` +
               `❌ Audit для ${list} не удался! ❌\n` +
               `Проверьте логи workflow!`;
    },

    // Базовый шаблон (просто текст)
    'custom': (p, defaultText) => defaultText || ''
};

module.exports = TEMPLATES;