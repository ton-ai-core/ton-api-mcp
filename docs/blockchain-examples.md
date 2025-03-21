# Примеры работы с блокчейн-транзакциями

В этом документе представлены примеры использования TON API CLI для работы с блокчейн-транзакциями.

## Получение информации о транзакции

Для получения детальной информации о транзакции по её хешу используйте метод `getBlockchainTransaction`:

```bash
# Формат команды
node bin/ton-api-cli.js blockchain getBlockchainTransaction -a [хеш_транзакции]

# Пример для основной сети
node bin/ton-api-cli.js blockchain getBlockchainTransaction -a a0089b5ae47cb60a4d14fcd6b88836a1ec08151e8ac9b3631d680df7c2ae0bb8

# Пример для тестовой сети
node bin/ton-api-cli.js -t blockchain getBlockchainTransaction -a a0089b5ae47cb60a4d14fcd6b88836a1ec08151e8ac9b3631d680df7c2ae0bb8
```

### Результат

Структура результата включает следующие поля:

- `hash` - хеш транзакции
- `lt` - логическое время транзакции
- `account` - информация об аккаунте (адрес, признак скама, признак кошелька)
- `success` - признак успешного выполнения
- `utime` - время создания (UNIX timestamp)
- `orig_status` - исходный статус
- `end_status` - конечный статус
- `total_fees` - общая комиссия
- `end_balance` - конечный баланс
- `transaction_type` - тип транзакции
- `in_msg` - информация о входящем сообщении
- `out_msgs` - информация о исходящих сообщениях
- `block` - информация о блоке
- `compute_phase` - информация о фазе вычисления
- `credit_phase` - информация о фазе кредита
- `raw` - сырые данные транзакции

## Получение транзакций по блоку

Для получения списка транзакций в указанном блоке используйте метод `getBlockchainBlockTransactions`:

```bash
# Получение транзакций блока в мастерчейне
node bin/ton-api-cli.js blockchain getBlockchainBlockTransactions -a -1 -a -9223372036854775808 -a 31129704

# Формат команды
node bin/ton-api-cli.js blockchain getBlockchainBlockTransactions -a [workchain] -a [shard] -a [seqno]
```

## Получение транзакций по хешу сообщения

Если у вас есть хеш сообщения, и вы хотите найти транзакцию, используйте метод `getBlockchainTransactionByMessageHash`:

```bash
# Формат команды
node bin/ton-api-cli.js blockchain getBlockchainTransactionByMessageHash -a [хеш_сообщения]

# Пример
node bin/ton-api-cli.js blockchain getBlockchainTransactionByMessageHash -a af1dd2c4a229a06773694ce90b9210a58852325bbb520e1e2518ebe235e779f8
```

## Получение списка транзакций аккаунта

Для получения списка последних транзакций аккаунта используйте метод `getBlockchainAccountTransactions`:

```bash
# Формат команды
node bin/ton-api-cli.js blockchain getBlockchainAccountTransactions -a [адрес] -a [limit]

# Пример: получение 5 последних транзакций аккаунта
node bin/ton-api-cli.js blockchain getBlockchainAccountTransactions -a "0:4e22841dedd96233393921ad8fedb1fee7cfcc705143292a5434a6bc9f0b829f" -a 5
```

## Получение блока по его идентификатору

Для получения информации о блоке по его идентификатору используйте метод `getBlockchainBlock`:

```bash
# Формат команды
node bin/ton-api-cli.js blockchain getBlockchainBlock -a [workchain] -a [shard] -a [seqno]

# Пример
node bin/ton-api-cli.js blockchain getBlockchainBlock -a -1 -a -9223372036854775808 -a 31129704
```

## Передача параметров в JSON-формате

Для методов, требующих сложные параметры, рекомендуется использовать формат JSON через флаг `-p` или `--params`:

```bash
# Получение списка транзакций с дополнительными параметрами
node bin/ton-api-cli.js blockchain getBlockchainAccountTransactions -p '{"account":"0:4e22841dedd96233393921ad8fedb1fee7cfcc705143292a5434a6bc9f0b829f","limit":10,"beforeLt":32604955000003}'
```

## Локализация транзакции

Для поиска транзакции по исходным параметрам используйте метод `tryLocateTx`:

```bash
# Формат команды
node bin/ton-api-cli.js blockchain tryLocateTx -p '{"source":"0:489cfb3ada47024860f09c24f1d052f380da6efedeac4dc6be98e5c89d83c121","destination":"0:4e22841dedd96233393921ad8fedb1fee7cfcc705143292a5434a6bc9f0b829f","created_lt":32604955000002}'
```

## Анализ неуспешных транзакций

Для получения дополнительной информации о неуспешных транзакциях, обратите внимание на поля `success`, `exit_code` и `aborted`:

```bash
# Пример анализа неуспешной транзакции
node bin/ton-api-cli.js blockchain getBlockchainTransaction -a a0089b5ae47cb60a4d14fcd6b88836a1ec08151e8ac9b3631d680df7c2ae0bb8 | grep -E "success|exit_code|aborted"
```

## Примечания

1. Все команды требуют установки API-ключа через переменную окружения `TON_API_KEY` или параметр `--api-key`.
2. Для работы с тестовой сетью добавьте флаг `-t` или `--testnet`.
3. Для получения справки по конкретной команде используйте `--help`.

```bash
# Пример получения справки
node bin/ton-api-cli.js blockchain getBlockchainTransaction --help
``` 