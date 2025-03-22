# TON API Model Context Protocol (MCP) Server

Integration of TON API with AI assistants and LLMs through the Model Context Protocol (MCP).

## What is TON API MCP?

TON API MCP provides an interface for interacting with the TON blockchain through AI assistants like Claude and other systems supporting the Model Context Protocol. This allows AI models to access up-to-date data from the TON blockchain and perform various operations.

## Key Features

- **Full access to TON API**: All TON API methods are available through a unified interface
- **Integration with AI assistants**: Works with Claude Desktop, Anthropic Claude API, and other solutions supporting MCP
- **Support for mainnet and testnet**: Ability to work with both the main network and the test network of TON
- **Modular architecture**: Option to include only the required API modules
- **Formatted output**: API request results are presented in a readable format

## Quick Start

### Prerequisites

- Node.js 16.x or higher
- Yarn or npm
- API key from [TON API](https://tonapi.io)

### Installation

```bash
# Clone the repository
git clone https://github.com/ton-ai-core/ton-api-mcp.git
cd ton-api-mcp

# Install dependencies
yarn install

# Build the project
yarn build
```

### Running the MCP Server

```bash
# Run with API key
node bin/ton-api-mcp-server.js --api-key YOUR_API_KEY

# Run with specific API modules
node bin/ton-api-mcp-server.js --api-key YOUR_API_KEY --modules blockchain,accounts
```

### Using NPX with the npm Package

If you've installed the package from npm, you can run the MCP server directly using npx:

```bash
npx ton-api-mcp --api-key AFPJTKEBPOX3AIYAAAAKA2HWOTRNJP5MUCV5DMDCZAAOCPSAYEYS3CILNQVLF2HWKED6USY --modules blockchain
```

This is especially convenient for integrating with AI assistants like Claude in Cursor.

## Command Line Parameters

```
--api-key <key>       TON API key (can also be set via the TON_API_KEY environment variable)
--testnet, -t         Use testnet instead of mainnet
--modules <list>      Comma-separated list of API modules (e.g., "blockchain,accounts,nft")
--help, -h            Show help
```

## Integration with Cursor

For integration with Cursor (or other development environments supporting MCP):

1. Run the MCP server in the background using npx:
   ```bash
   npx ton-api-mcp --api-key AFPJTKEBPOX3AIYAAAAKA2HWOTRNJP5MUCV5DMDCZAAOCPSAYEYS3CILNQVLF2HWKED6USY --modules blockchain
   ```

2. In Cursor:
   - Open MCP Servers settings
   - Add a new server, specifying the TON API MCP launch command:
   ```
   npx ton-api-mcp --api-key AFPJTKEBPOX3AIYAAAAKA2HWOTRNJP5MUCV5DMDCZAAOCPSAYEYS3CILNQVLF2HWKED6USY --modules blockchain
   ```

3. After successful connection, you can access any TON API methods directly through the AI assistant.

## Available TON API Modules

TON API MCP provides access to the following modules:

| Module | Description |
|--------|-------------|
| accounts | Operations with TON accounts, getting balances, wallet information, and transaction history |
| blockchain | Access to blockchain data, blocks, transactions, masterchain, and validators |
| dns | Working with DNS records and domains in TON |
| jettons | Operations with Jetton tokens (similar to ERC-20 in TON) |
| nft | Operations with NFT collections and tokens |
| staking | Staking operations and operations with nominators |
| wallet | Managing wallets and transactions |

## Usage Examples

### Getting Information About the Latest Block

```javascript
// Request to AI assistant
"Get information about the latest block in the TON blockchain"

// The assistant uses the blockchain_getMasterchainInfo tool
```

### Checking Wallet Balance

```javascript
// Request to AI assistant
"Check the balance of wallet EQDrjaLahLkMB-hMCmkzOyBuHJ139ZUYmPHu6RRBKnbdLIYI"

// The assistant uses the accounts_getAccount tool
```

### Getting Information About a Jetton Token

```javascript
// Request to AI assistant
"Provide information about the Jetton token with master address EQB-MPwrd1G6WKNkLz_VnV7-UFKi8PtMd8AmYHZEZRQC4POW"

// The assistant uses the jettons_getInfo tool
```

## Troubleshooting

### Client Not Created / "Failed to create client" Error

Make sure that:
1. You have properly built the project (`yarn build`)
2. You are using the correct API key
3. You are launching the server from the project's root directory

### "No server info found" Error

This usually indicates a connection or initialization problem with the MCP server. Try:
1. Restarting the server
2. Ensuring the path to the executable file is correct
3. Checking file access permissions

## License

MIT

## Authors and Acknowledgments

- Developed with support from TON Foundation
- Uses [tonapi-sdk-js](https://github.com/tonkeeper/tonapi-sdk-js) for interaction with TON API
- Built on [@modelcontextprotocol/sdk](https://github.com/anthropics/modelcontextprotocol) for integration with AI assistants 