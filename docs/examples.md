## TON API CLI Usage Examples

### Setup

Before using the CLI, you need to obtain an API key from [TON API](https://tonapi.io).

The API key can be specified in several ways:
1. Through the `TON_API_KEY` environment variable
2. Using the `--api-key` command-line parameter

```bash
# Setting via environment variable
export TON_API_KEY="your-api-key-here"

# Or specifying directly when calling a command
node bin/ton-api-cli.js --api-key="your-api-key-here" [commands...]
```

### Network Selection

To select testnet instead of mainnet, use the `-t` or `--testnet` flag:

```bash
# Using testnet
node bin/ton-api-cli.js -t [commands...]
```

### List of Available Modules and Methods

To view all available modules and methods, use the `list` command:

```bash
node bin/ton-api-cli.js list
```

### Getting Transaction Information

To get information about a transaction, use the `getBlockchainTransaction` method of the `blockchain` module:

```bash
# Command format
node bin/ton-api-cli.js blockchain getBlockchainTransaction -a [transaction_hash]

# Example
node bin/ton-api-cli.js blockchain getBlockchainTransaction -a a0089b5ae47cb60a4d14fcd6b88836a1ec08151e8ac9b3631d680df7c2ae0bb8

# Using testnet
node bin/ton-api-cli.js -t blockchain getBlockchainTransaction -a a0089b5ae47cb60a4d14fcd6b88836a1ec08151e8ac9b3631d680df7c2ae0bb8
```

The result will be a JSON object with detailed information about the transaction, including:
- Transaction hash
- Logical time (lt)
- Account address
- Success status
- Creation time
- Information about the incoming message
- Information about outgoing messages
- Execution phases
- And other details

### Account Search

To search for accounts, use the `searchAccounts` method of the `accounts` module:

```bash
# Search for accounts with the name "ton" and a limit of 2 results
node bin/ton-api-cli.js accounts searchAccounts -a "ton" -a 2
```

### Command Parameters

Most methods accept parameters that can be passed in two ways:

1. Through command-line arguments with the `-a` or `--args` flag:
   ```bash
   node bin/ton-api-cli.js [module] [method] -a [argument1] -a [argument2] ...
   ```

2. Through a JSON object with the `-p` or `--params` flag:
   ```bash
   node bin/ton-api-cli.js [module] [method] -p '{"parameter1": "value1", "parameter2": "value2"}'
   ```

### Examples of Using Other Methods

#### Getting Account Information
```bash
node bin/ton-api-cli.js accounts getAccount -a "0:4e22841dedd96233393921ad8fedb1fee7cfcc705143292a5434a6bc9f0b829f"
```

#### Getting Account Transactions
```bash
node bin/ton-api-cli.js accounts getAccountEvents -a "0:4e22841dedd96233393921ad8fedb1fee7cfcc705143292a5434a6bc9f0b829f" -a '{"limit": 5}'
``` 