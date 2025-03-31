# Heimdahl SDK

![Heimdahl Banner](https://via.placeholder.com/800x150?text=Heimdahl+Blockchain+Data+Platform)

[![npm version](https://img.shields.io/npm/v/heimdahl-js.svg)](https://www.npmjs.com/package/heimdahl-js)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

A powerful JavaScript SDK for interacting with the Heimdahl blockchain data platform. Access cross-chain swap, transfer,
and event data through a unified interface.

## 🚀 Features

- **Cross-Chain Support** - Query data across multiple blockchains with a single API
- **Unified Interface** - Consistent patterns for accessing different data types
- **Rich Data Types** - Access swaps, transfers, events, and more
- **Environment Agnostic** - Works in both Node.js and browser environments
- **Promise-Based** - Full async/await support for modern JavaScript applications
- **Pagination Support** - Easily handle large datasets with built-in pagination
- **Lightweight** - No heavy dependencies

## 📦 Installation

### Node.js

```bash

git clone https://github.com/yourusername/heimdahl-js.git
cd heimdahl-js

```

### Browser

```html
<!-- Or include the file directly -->
<script src="path/to/heimdahl.min.js"></script>
```

### How to run demo page 

###

```
npm install 
node server.js 
```

It should be running in your browser at localhost:3000/demo





## 🔑 Authentication

You'll need an API key from Heimdahl to use this SDK. Get yours by:

1. Creating an account at [heimdahl.xyz](https://drakar.heimdahl.xyz)
2. Navigating to your dashboard
3. Generating a new API key

## 🚦 Quick Start

### Node.js (CommonJS)

```javascript
const Index = require('heimdahl-js');

// Initialize the client with your API key
const client = new Index('your-api-key');

async function main() {
    try {
        // Get supported chains
        const chains = await client.getChains();
        console.log('Supported chains:', chains);

        // Get USDC/WETH swaps on Ethereum
        const swaps = await client.getSwaps({
            chain: 'ethereum',
            token1: 'USDC',
            token2: 'WETH',
            sizeBucket: 'all',
            pageSize: 5
        });

        console.log(`${swaps.swaps.length} swaps found`);
    } catch (error) {
        console.error('Error:', error);
    } finally {
        client.close();
    }
}

main();
```

### Node.js (ES Modules)

```javascript
import Index from 'heimdahl-js';

// Initialize the client with your API key
const client = new Index('your-api-key');

// Use as shown in the CommonJS example
```

### Browser

```html

<script src="heimdahl.min.js"></script>
<script>
    // Initialize the client with your API key
    const client = new Index('your-api-key');

    // Get supported chains
    client.getChains()
            .then(chains => {
                console.log('Supported chains:', chains);
            })
            .catch(error => {
                console.error('Error:', error);
            });
</script>
```

## 📘 API Reference

### Client Initialization

```javascript
const client = new Index(apiKey, baseUrl);
```

Parameters:

- `apiKey` (string, required): Your Heimdahl API key
- `baseUrl` (string, optional): API base URL. Defaults to `https://api.heimdahl.xyz/v1`

### Available Methods

#### Chains

```javascript
// Get list of supported chains
const chains = await client.getChains();
```

#### Contracts

```javascript
// Get list of registered contracts
const contracts = await client.getContracts();
```

#### Swaps

```javascript
// Get cross-chain swap data
const swaps = await client.getSwaps({
    chain: "ethereum",      // Blockchain name or "all"
    network: "mainnet",     // Network (mainnet, testnet)
    token1: "USDC",         // First token address or symbol
    token2: "WETH",         // Second token address or symbol
    sizeBucket: "all",      // Size category (micro, small, medium, large, whale, all)
    page: 0,                // Page number for pagination
    pageSize: 10            // Number of results per page
});
```

#### Transfers

```javascript
// Get token transfer data
const transfers = await client.getTransfers({
    chain: "arbitrum",      // Blockchain name or "all"
    network: "mainnet",     // Network (mainnet, testnet)
    token: "USDC",          // Token address or symbol
    fromAddress: "0x123..", // Filter by sender address
    toAddress: null,        // Filter by recipient address
    page: 0,                // Page number for pagination
    pageSize: 10            // Number of results per page
});
```

#### Events

```javascript
// Get raw blockchain events
const events = await client.getEvents({
    chain: "arbitrum",
    tokenAddress: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
    eventName: "Transfer"
});
```

#### Advanced Queries

```javascript
// Search for swaps between a specific token pair
const filteredSwaps = await client.searchSwapsByTokenPair({
    token1: "USDC",
    token2: "WETH",
    chain: "all",
    limit: 100
});

// Get all transfers for a specific token
const tokenTransfers = await client.getTokenTransfers({
    token: "USDC",
    fromAddress: "0x123..",
    chain: "all",
    limit: 100
});
```

## 📊 Examples

### Example 1: Tracking Token Swaps

```javascript
// Track USDC/WETH swaps across multiple chains
async function trackTokenSwaps() {
    const chains = ["ethereum", "arbitrum", "optimism"];
    const results = {};

    for (const chain of chains) {
        const swaps = await client.getSwaps({
            chain,
            token1: "USDC",
            token2: "WETH",
            pageSize: 10
        });

        results[chain] = swaps.swaps;
    }

    return results;
}
```

### Example 2: Monitoring Whale Transfers

```javascript
// Monitor large transfers of a specific token
async function trackWhaleTransfers(token, threshold) {
    const transfers = await client.getTransfers({
        chain: "all",
        token,
        pageSize: 100
    });

    // Filter for transfers above the threshold
    return transfers.filter(t =>
        parseFloat(t.amount) >= threshold
    );
}
```

### Example 3: Analyzing Contract Events

```javascript
// Analyze Transfer events for a specific token
async function analyzeTransferEvents(chain, tokenAddress) {
    const events = await client.getEvents({
        chain,
        tokenAddress,
        eventName: "Transfer"
    });

    // Process event data
    const summary = events.events.reduce((acc, event) => {
        // Custom analysis logic
        return acc;
    }, {totalTransfers: 0, uniqueAddresses: new Set()});

    return summary;
}
```

## 🧩 Advanced Usage

### Handling Pagination

```javascript
// Function to fetch all pages of data
async function fetchAllPages(fetchFunction, params = {}) {
    let allResults = [];
    let page = 0;
    let hasMore = true;

    while (hasMore) {
        const results = await fetchFunction({
            ...params,
            page,
            pageSize: 100
        });

        if (results.length === 0) {
            hasMore = false;
        } else {
            allResults = [...allResults, ...results];
            page++;
        }
    }

    return allResults;
}

// Usage
const allTransfers = await fetchAllPages(client.getTransfers.bind(client), {
    chain: "ethereum",
    token: "USDC"
});
```

### Error Handling

```javascript
try {
    const swaps = await client.getSwaps({
        chain: "ethereum",
        token1: "USDC",
        token2: "WETH"
    });

    // Process successful response
} catch (error) {
    if (error.message.includes('rate limit')) {
        // Handle rate limiting
        console.log('Rate limited. Retrying in 1 minute...');
        setTimeout(retryFunction, 60000);
    } else if (error.message.includes('404')) {
        // Handle not found errors
        console.error('Resource not found');
    } else {
        // Handle other errors
        console.error('API Error:', error);
    }
}
```

## 🛠️ Development

Want to contribute to the Heimdahl SDK? Great! Here's how to set up the development environment:

```bash
# Clone the repository
git clone https://github.com/yourusername/heimdahl-js.git
cd heimdahl-js

# Install dependencies
npm install

# Run tests
npm test

# Build for production
npm run build
```

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

Having issues or questions? Here's how to get help:

- Open an [issue](https://github.com/yourusername/heimdahl-js/issues)
- Contact us at support@heimdahl.xyz
- Join our Discord community: [Heimdahl Discord](https://discord.gg/uA6B88VS)
- Documentation: https://heimdahl.gitbook.io

---

Built with ❤️ by [Heimdahl.xyz]
