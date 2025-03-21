# Blockchain Transactions Examples

This document presents examples of using TON API CLI for working with blockchain transactions.

## Getting Transaction Information

To get detailed information about a transaction by its hash, use the `getBlockchainTransaction` method:

```bash
# Command format
node bin/ton-api-cli.js blockchain getBlockchainTransaction -a [transaction_hash]

# Example for mainnet
node bin/ton-api-cli.js blockchain getBlockchainTransaction -a a0089b5ae47cb60a4d14fcd6b88836a1ec08151e8ac9b3631d680df7c2ae0bb8

# Example for testnet
node bin/ton-api-cli.js -t blockchain getBlockchainTransaction -a a0089b5ae47cb60a4d14fcd6b88836a1ec08151e8ac9b3631d680df7c2ae0bb8
```

### Result

The result structure includes the following fields:

- `hash` - transaction hash
- `lt` - logical transaction time
- `account` - account information (address, scam flag, wallet flag)
- `success` - successful execution flag
- `utime` - creation time (UNIX timestamp)
- `orig_status` - original status
- `end_status` - final status
- `total_fees` - total fees
- `end_balance` - final balance
- `transaction_type` - transaction type
- `in_msg` - information about the incoming message
- `out_msgs` - information about outgoing messages
- `block` - block information
- `compute_phase` - computation phase information
- `credit_phase` - credit phase information
- `raw` - raw transaction data

## Getting Transactions by Block

To get a list of transactions in a specified block, use the `getBlockchainBlockTransactions` method:

```bash
# Getting transactions of a block in the masterchain
node bin/ton-api-cli.js blockchain getBlockchainBlockTransactions -a -1 -a -9223372036854775808 -a 31129704

# Command format
node bin/ton-api-cli.js blockchain getBlockchainBlockTransactions -a [workchain] -a [shard] -a [seqno]
```

## Getting Transactions by Message Hash

If you have a message hash and want to find the transaction, use the `getBlockchainTransactionByMessageHash` method:

```bash
# Command format
node bin/ton-api-cli.js blockchain getBlockchainTransactionByMessageHash -a [message_hash]

# Example
node bin/ton-api-cli.js blockchain getBlockchainTransactionByMessageHash -a af1dd2c4a229a06773694ce90b9210a58852325bbb520e1e2518ebe235e779f8
```

## Getting a List of Account Transactions

To get a list of the latest account transactions, use the `getBlockchainAccountTransactions` method:

```bash
# Command format
node bin/ton-api-cli.js blockchain getBlockchainAccountTransactions -a [address] -a [limit]

# Example: getting the 5 latest transactions of an account
node bin/ton-api-cli.js blockchain getBlockchainAccountTransactions -a "0:4e22841dedd96233393921ad8fedb1fee7cfcc705143292a5434a6bc9f0b829f" -a 5
```

## Getting a Block by Its Identifier

To get information about a block by its identifier, use the `getBlockchainBlock` method:

```bash
# Command format
node bin/ton-api-cli.js blockchain getBlockchainBlock -a [workchain] -a [shard] -a [seqno]

# Example
node bin/ton-api-cli.js blockchain getBlockchainBlock -a -1 -a -9223372036854775808 -a 31129704
```

## Passing Parameters in JSON Format

For methods requiring complex parameters, it is recommended to use JSON format with the `-p` or `--params` flag:

```bash
# Getting a list of transactions with additional parameters
node bin/ton-api-cli.js blockchain getBlockchainAccountTransactions -p '{"account":"0:4e22841dedd96233393921ad8fedb1fee7cfcc705143292a5434a6bc9f0b829f","limit":10,"beforeLt":32604955000003}'
```

## Transaction Localization

To search for a transaction by source parameters, use the `tryLocateTx` method:

```bash
# Command format
node bin/ton-api-cli.js blockchain tryLocateTx -p '{"source":"0:489cfb3ada47024860f09c24f1d052f380da6efedeac4dc6be98e5c89d83c121","destination":"0:4e22841dedd96233393921ad8fedb1fee7cfcc705143292a5434a6bc9f0b829f","created_lt":32604955000002}'
```

## Analysis of Unsuccessful Transactions

To get additional information about unsuccessful transactions, pay attention to the fields `success`, `exit_code`, and `aborted`:

```bash
# Example of analyzing an unsuccessful transaction
node bin/ton-api-cli.js blockchain getBlockchainTransaction -a a0089b5ae47cb60a4d14fcd6b88836a1ec08151e8ac9b3631d680df7c2ae0bb8 | grep -E "success|exit_code|aborted"
```

## Notes

1. All commands require setting an API key through the `TON_API_KEY` environment variable or the `--api-key` parameter.
2. To work with the testnet, add the `-t` or `--testnet` flag.
3. To get help on a specific command, use `--help`.

```bash
# Example of getting help
node bin/ton-api-cli.js blockchain getBlockchainTransaction --help
``` 