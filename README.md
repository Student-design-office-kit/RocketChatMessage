# RocketChatMessage

Модуль для отправки уведомлений в рокет чат.

usage:
```yaml
- name: Notify
  uses: Student-design-office-kit/RocketChatMessage@main
  with:
    url: ${{ secrets.ROCKET_CHAT_WEBHOOK }}
    text: "Сборка завершена!"
    links: |
        Репозиторий|${{ gitea.repository_url }}
```