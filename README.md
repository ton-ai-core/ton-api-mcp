# TON API CLI

Command-line interface for [TON API](https://tonapi.io). Allows you to use all TON API capabilities through a convenient command-line interface.

## Features

- Support for all TON API methods
- Automatic discovery and generation of CLI commands for all available API methods
- Support for mainnet and testnet
- Flexible parameter passing through command line or JSON objects
- Formatted output of results

## Installation

```bash
git clone https://github.com/ton-ai-core/tonapi-cli.git
cd tonapi-cli
npm install
npm run build
```

## Requirements

- Node.js 14.x or higher
- API key from [TON API](https://tonapi.io)

## API Key Configuration

Before using the CLI, you need to specify an API key. This can be done in two ways:

1. Through an environment variable:
   ```bash
   export TON_API_KEY="your-api-key-here"
   ```

2. Using a command-line parameter:
   ```bash
   node bin/ton-api-cli.js --api-key="your-api-key-here" [commands...]
   ```

## Usage

### General Command Format

```bash
node bin/ton-api-cli.js [options] <module> <method> [parameters]
```

### Options

- `-t, --testnet` - use testnet instead of mainnet
- `-k, --api-key <key>` - specify the API key
- `-h, --help` - show help

### List of Available Modules and Methods

```bash
node bin/ton-api-cli.js list
```

### Usage Examples

#### Get Transaction Information
```bash
node bin/ton-api-cli.js blockchain getBlockchainTransaction -a a0089b5ae47cb60a4d14fcd6b88836a1ec08151e8ac9b3631d680df7c2ae0bb8
```

#### Search for Accounts
```bash
node bin/ton-api-cli.js accounts searchAccounts -a "ton" -a 2
```

#### Get Account Information
```bash
node bin/ton-api-cli.js accounts getAccount -a "0:4e22841dedd96233393921ad8fedb1fee7cfcc705143292a5434a6bc9f0b829f"
```

For more detailed examples, see the [examples documentation](docs/examples.md).

## Project Structure

- `src/` - project source code
- `bin/` - compiled files for execution
- `docs/` - documentation

## Development

### Building the Project

```bash
npm run build
```

### Running Tests

```bash
npm test
```

## License

MIT

## Authors

- Original project author

## Acknowledgments

- [TON API](https://tonapi.io) for providing the API
- [tonapi-sdk-js](https://github.com/tonkeeper/tonapi-sdk-js) for JavaScript SDK for working with TON API 