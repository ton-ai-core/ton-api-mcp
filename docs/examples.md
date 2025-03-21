## Примеры использования TON API CLI

### Настройка

Перед использованием CLI необходимо получить API-ключ с [TON API](https://tonapi.io).

API-ключ можно указать несколькими способами:
1. Через переменную окружения `TON_API_KEY`
2. Через параметр командной строки `--api-key`

```bash
# Установка через переменную окружения
export TON_API_KEY="your-api-key-here"

# Или указание напрямую при вызове команды
node bin/ton-api-cli.js --api-key="your-api-key-here" [команды...]
```

### Выбор сети

Для выбора тестовой сети вместо основной используйте флаг `-t` или `--testnet`:

```bash
# Использование тестовой сети
node bin/ton-api-cli.js -t [команды...]
```

### Список доступных модулей и методов

Для просмотра всех доступных модулей и методов используйте команду `list`:

```bash
node bin/ton-api-cli.js list
```

### Получение информации о транзакции

Для получения информации о транзакции используйте метод `getBlockchainTransaction` модуля `blockchain`:

```bash
# Формат команды
node bin/ton-api-cli.js blockchain getBlockchainTransaction -a [хеш_транзакции]

# Пример
node bin/ton-api-cli.js blockchain getBlockchainTransaction -a a0089b5ae47cb60a4d14fcd6b88836a1ec08151e8ac9b3631d680df7c2ae0bb8

# Использование тестовой сети
node bin/ton-api-cli.js -t blockchain getBlockchainTransaction -a a0089b5ae47cb60a4d14fcd6b88836a1ec08151e8ac9b3631d680df7c2ae0bb8
```

Результатом будет JSON-объект с подробной информацией о транзакции, включая:
- Hash транзакции
- Логическое время (lt)
- Адрес аккаунта
- Статус успешности
- Время создания
- Информация о входящем сообщении
- Информация о исходящих сообщениях
- Фазы выполнения
- И другие детали

### Поиск аккаунтов

Для поиска аккаунтов используйте метод `searchAccounts` модуля `accounts`:

```bash
# Поиск аккаунтов с именем "ton" и лимитом 2 результата
node bin/ton-api-cli.js accounts searchAccounts -a "ton" -a 2
```

### Параметры команд

Большинство методов принимают параметры, которые можно передать двумя способами:

1. Через аргументы командной строки с флагом `-a` или `--args`:
   ```bash
   node bin/ton-api-cli.js [модуль] [метод] -a [аргумент1] -a [аргумент2] ...
   ```

2. Через JSON-объект с флагом `-p` или `--params`:
   ```bash
   node bin/ton-api-cli.js [модуль] [метод] -p '{"параметр1": "значение1", "параметр2": "значение2"}'
   ```

### Примеры использования других методов

#### Получение информации об аккаунте
```bash
node bin/ton-api-cli.js accounts getAccount -a "0:4e22841dedd96233393921ad8fedb1fee7cfcc705143292a5434a6bc9f0b829f"
```

#### Получение транзакций аккаунта
```bash
node bin/ton-api-cli.js accounts getAccountEvents -a "0:4e22841dedd96233393921ad8fedb1fee7cfcc705143292a5434a6bc9f0b829f" -a '{"limit": 5}'
``` 