# TON API MCP Server

Model Context Protocol (MCP) сервер для интеграции TON API с AI-ассистентами, такими как Claude Desktop.

## Что такое MCP?

MCP (Model Context Protocol) - это открытый протокол, который позволяет AI-ассистентам взаимодействовать с внешними данными и инструментами. Этот сервер предоставляет доступ к функциям TON API через MCP.

## Функциональность

TON API MCP Server предоставляет следующие возможности:

1. **Инструменты** (Tools):
   - Все методы TON API доступны как инструменты MCP
   - Имена инструментов имеют формат `{module}_{method}`, например `blockchain_getBlockBySeqno` или `payments_getBurnsHistory`
   - Каждый инструмент принимает параметры в формате JSON

2. **Ресурсы** (Resources):
   - `ton-api://methods` - список всех доступных API методов с описанием
   - `ton-api://network` - информация о текущей сети (mainnet или testnet)

## Установка и запуск

### Требования

- Node.js 16+
- Yarn

### Установка

```bash
# Установка зависимостей
yarn install

# Сборка проекта
yarn build
```

### Запуск сервера

#### В режиме stdio (для прямой интеграции с Claude Desktop)

```bash
yarn start:mcp
```

#### В режиме HTTP сервера

```bash
yarn start:mcp:http
```

По умолчанию сервер запускается на порту 3000. Вы можете указать другой порт:

```bash
node bin/ton-api-mcp-server.js --http --port 8080
```

#### Демо-режим

Если у вас нет API ключа TON API, вы можете запустить сервер в демо-режиме:

```bash
yarn start:mcp:demo
```

В этом режиме будут доступны все методы, но запросы, требующие аутентификации, не будут работать.

### Параметры запуска

```
--http          Запуск в режиме HTTP-сервера
--port N        Указать порт для HTTP-сервера (по умолчанию 3000)
--testnet       Использовать testnet вместо mainnet
--api-key KEY   Установить API ключ для TON API
--demo          Запустить в демо-режиме (без проверки API ключа)
```

## Использование с Claude Desktop

1. Запустите MCP сервер в режиме stdio:
   ```bash
   yarn start:mcp
   # или с API ключом:
   node bin/ton-api-mcp-server.js --api-key YOUR_API_KEY
   ```

2. В Claude Desktop:
   - Нажмите на кнопку "+" рядом с "Tools"
   - Выберите "Add via CLI"
   - Найдите и выберите `tonapi-mcp`
   
3. Теперь вы можете просить Claude использовать TON API. Например:
   - "Получи информацию о последних блоках в TON блокчейне"
   - "Проверь баланс кошелька EQDrjaLahLkMB-hMCmkzOyBuHJ139ZUYmPHu6RRBKnbdLIYI"

## Использование с HTTP интеграцией

Если вы запустили сервер в режиме HTTP (--http), то доступны следующие эндпоинты:

- `GET /` - проверка работоспособности сервера
- `GET /sse` - Server-Sent Events эндпоинт для подключения MCP клиентов
- `POST /messages` - эндпоинт для отправки сообщений от клиента к серверу

## Примеры запросов

### Получение списка методов

Ресурс `ton-api://methods` возвращает список всех доступных методов API:

```
# TON API Methods

## accounts

### getAccount
Description: Method getAccount from accounts module
Signature: params = {}
Tool name: accounts_getAccount

...
```

### Вызов метода API

Инструмент `blockchain_getMasterchainInfo` возвращает информацию о мастерчейне:

```json
{
  "last": {
    "seqno": 29602269,
    "shard": "8000000000000000",
    "workchain": -1,
    "fileHash": "OsKTLZz4oMbm1HnZVVV3YWuPBGNRtuciGWXRDMZZ6Ts=",
    "rootHash": "7Vghi9t99KF+6jvOrCBRvxhHla0yNZKkIbU4l+DwWco="
  },
  "init": {
    "fileHash": "VkCYinJM5Vmaf+8aPUZ9uS4JYAh+gLz6ByS/UQF9GL0=",
    "rootHash": "WP/WQ11tU7QUcTQ2Rji+VUwEgR2uGOJ0rN6rnHywFM0="
  },
  "stateRootHash": "7Vghi9t99KF+6jvOrCBRvxhHla0yNZKkIbU4l+DwWco=",
  "genUtime": 1696050457,
  "genLt": "30530712000004"
}
```

## Расширение и настройка

Вы можете изменить и расширить этот MCP-сервер, изменив следующие файлы:

- `src/ton-api-mcp-server.ts` - основная реализация MCP-сервера
- `src/ton-api-cli-wrapper.ts` - обертка для взаимодействия с TON API

## Лицензия

MIT 