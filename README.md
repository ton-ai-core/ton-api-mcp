# TON Viewer CLI

Консольный интерфейс для работы с [TON API](https://tonapi.io). Позволяет использовать все возможности TON API через удобный командный интерфейс.

## Особенности

- Поддержка всех методов TON API
- Автоматическое обнаружение и генерация CLI команд для всех доступных методов API
- Поддержка основной сети (mainnet) и тестовой сети (testnet)
- Гибкая передача параметров через командную строку или JSON-объекты
- Форматированный вывод результатов

## Установка

```bash
git clone https://github.com/yourusername/tonviewer-cli.git
cd tonviewer-cli
npm install
npm run build
```

## Требования

- Node.js 14.x или выше
- API-ключ от [TON API](https://tonapi.io)

## Настройка API-ключа

Перед использованием CLI необходимо указать API-ключ. Это можно сделать двумя способами:

1. Через переменную окружения:
   ```bash
   export TON_API_KEY="your-api-key-here"
   ```

2. Через параметр командной строки:
   ```bash
   node bin/ton-api-cli.js --api-key="your-api-key-here" [команды...]
   ```

## Использование

### Общий формат команд

```bash
node bin/ton-api-cli.js [опции] <модуль> <метод> [параметры]
```

### Опции

- `-t, --testnet` - использовать тестовую сеть вместо основной
- `-k, --api-key <key>` - указать API-ключ
- `-h, --help` - показать справку

### Список доступных модулей и методов

```bash
node bin/ton-api-cli.js list
```

### Примеры использования

#### Получение информации о транзакции
```bash
node bin/ton-api-cli.js blockchain getBlockchainTransaction -a a0089b5ae47cb60a4d14fcd6b88836a1ec08151e8ac9b3631d680df7c2ae0bb8
```

#### Поиск аккаунтов
```bash
node bin/ton-api-cli.js accounts searchAccounts -a "ton" -a 2
```

#### Получение информации об аккаунте
```bash
node bin/ton-api-cli.js accounts getAccount -a "0:4e22841dedd96233393921ad8fedb1fee7cfcc705143292a5434a6bc9f0b829f"
```

Более подробные примеры см. в [документации с примерами](docs/examples.md).

## Структура проекта

- `src/` - исходный код проекта
- `bin/` - скомпилированные файлы для запуска
- `docs/` - документация
- `node_modules/` - зависимости

## Разработка

### Сборка проекта

```bash
npm run build
```

### Запуск тестов

```bash
npm test
```

## Лицензия

MIT

## Авторы

- Автор исходного проекта

## Благодарности

- [TON API](https://tonapi.io) за предоставление API
- [tonapi-sdk-js](https://github.com/tonkeeper/tonapi-sdk-js) за JavaScript SDK для работы с TON API 