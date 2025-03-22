# TON API MCP Server

Model Context Protocol (MCP) server for integrating TON API with AI assistants like Claude and other LLMs supporting the MCP protocol.

## What is MCP?

MCP (Model Context Protocol) is an open protocol developed by Anthropic that allows language models (LLMs) to interact with external data and tools. The protocol provides a standardized way to obtain up-to-date data and perform actions beyond the model's training dataset.

TON API MCP Server provides access to the TON blockchain through this protocol, allowing AI assistants to work with current blockchain data.

## Architecture and Operating Principle

TON API MCP Server acts as an intermediary between the AI model and TON API:

```
AI Assistant <-> MCP Protocol <-> TON API MCP Server <-> TON API <-> TON Blockchain
```

When a user makes a request, the AI assistant can:
1. Request a list of available tools (ListTools)
2. Get information about available resources (ListOfferings)
3. Call a specific tool with parameters (CallTool)
4. Use the obtained data to formulate a response

## Functionality

TON API MCP Server provides the following capabilities:

### Tools

All TON API methods are available as MCP tools in the following format:
- Tool name: `{module}_{method}`, for example:
  - `blockchain_getMasterchainInfo`
  - `accounts_getAccount`
  - `jettons_getInfo`
  - `nft_getItemsByCollection`

Each tool accepts parameters in JSON format and returns results in a structured form.

### Resources

- `ton-api://methods` - complete list of all available API methods with documentation
- `ton-api://network` - information about the current network (mainnet or testnet)

## Installation

### System Requirements

- Node.js 16+ (Node.js 18+ recommended)
- Yarn or npm
- TON API key (obtain from [tonapi.io](https://tonapi.io))

### Installation Process

```bash
# Clone the repository
git clone https://github.com/ton-ai-core/ton-api-mcp.git
cd ton-api-mcp

# Install dependencies
yarn install

# Build the project
yarn build
```

## Launch and Configuration

### Basic Launch

```bash
# Using yarn
yarn mcp --api-key YOUR_API_KEY

# Directly with Node.js
node bin/ton-api-mcp-server.js --api-key YOUR_API_KEY
```

### Launch Parameters

```
--api-key KEY       Set API key for TON API
--testnet, -t       Use testnet instead of mainnet
--modules LIST      Module filter as comma-separated list (e.g.: "blockchain,accounts,nft")
--help, -h          Show help
```

### Environment Variables

You can also configure the server using environment variables:

- `TON_API_KEY` - API key for TON API
- `TON_TESTNET` - set to "1" to use testnet

Example using a .env file:
```
TON_API_KEY=your_api_key_here
TON_TESTNET=0
```

## Integration with Cursor and Other IDEs

### Cursor

1. Launch the MCP server:
   ```bash
   node bin/ton-api-mcp-server.js --api-key YOUR_API_KEY
   ```

2. In Cursor:
   - Open Settings
   - Select the "MCP Servers" section
   - Click "+ Add new MCP server"
   - Enter a name in the field (e.g., "TON API")
   - Specify the launch command:
     ```
     node /absolute/path/to/ton-api-mcp/bin/ton-api-mcp-server.js --api-key YOUR_API_KEY
     ```
   - Click "Save"

3. After successful connection, the status will change to "Enabled"

### Using with AI Assistant

After connecting the MCP server, you can interact with the TON blockchain through the AI assistant with simple requests:

- "What is the current balance of wallet EQDrjaLahLkMB-hMCmkzOyBuHJ139ZUYmPHu6RRBKnbdLIYI?"
- "Show the latest transactions for address EQCD39VS5jcptHL8vMjEXrzGaRcCVYto7HUn4bpAOg8xqB2N"
- "Get information about NFT collection EQDvRFMYLKKmyXjKWHZzs5xSQ2sEVpGBZM3ZHr7dCJW_YH42"

## Troubleshooting

### Problem: "Failed to create client" Error

**Causes and Solutions:**
1. Project build not completed:
   ```bash
   yarn build
   ```

2. Incorrect launch path:
   - Make sure you're launching the server from the project's root directory
   - Check the path to bin/ton-api-mcp-server.js

3. Missing dependencies:
   ```bash
   yarn install
   ```

### Problem: "No server info found" Error

**Causes and Solutions:**
1. Server initialization issue:
   - Restart the server
   - Check logs for errors
   
2. API key issue:
   - Ensure the API key is valid
   - Check that the API key is being passed correctly

3. Connection issue between Cursor and server:
   - Verify the server is running
   - Restart Cursor

## Development and Extension

Project structure:
- `src/ton-api-mcp-server.ts` - main implementation of the MCP server
- `src/ton-api-cli-wrapper.ts` - wrapper for interaction with TON API

To add new features or modify existing ones:
1. Make changes to the corresponding TypeScript files
2. Compile the project: `yarn build`
3. Test the changes

## License

MIT

## Useful Resources

- [TON API Documentation](https://tonapi.io/docs) - official TON API documentation
- [Model Context Protocol](https://github.com/anthropics/modelcontextprotocol) - documentation for the MCP protocol
- [TON SDK documentation](https://github.com/tonkeeper/tonapi-sdk-js) - SDK for working with TON API 