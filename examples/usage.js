/**
 * Example usage of the Heimdahl JavaScript SDK.
 * This script can run in both Node.js and browser environments.
 */

// In Node.js environment, you would import like this:
const HeimdahlClient = require('../src');

// In browser, the Index would be available globally if you include the script

async function runExamples() {
    // Initialize the client with your API key
    const client = new Index("pk_dc07ea43afeb807362e9b67201e6d07054f7292edb2c4bad");

    try {
        // Example 1: Get supported chains
        console.log("Getting supported chains...");
        const chains = await client.getChains();
        chains.forEach(c => {
            console.log("chain", c.chain_name);
        });

        // Example 2: Get registered contracts
        console.log("\nGetting registered contracts...");
        const contracts = await client.getContracts();
        contracts.forEach(c => {
            console.log("contract", c.contract_name);
            console.log("address", c.contract_address);
            console.log("events", c.events);
        });

        // Example 3: Get USDC/WETH swaps on Ethereum
        console.log("\nGetting USDC/WETH swaps on Ethereum...");
        const swaps = await client.getSwaps({
            chain: "ethereum",
            token1: "USDC",
            token2: "WETH",
            sizeBucket: "all",
            pageSize: 5
        });

        console.log(`${swaps.swaps.length} swaps found`);
        swaps.swaps.forEach(e => {
            console.log("Token 1:", e.token1_symbol);
            console.log("Token 2:", e.token2_symbol);
            console.log("Amount 1:", e.token1_amount);
            console.log("Amount 2:", e.token2_amount);
            console.log("---");
        });

        // Example 4: Get transfers for a specific address
        console.log("\nGetting USDC transfers from specific address on Arbitrum...");
        const transfers = await client.getTransfers({
            chain: "arbitrum",
            token: "USDC",
            fromAddress: "0x51C72848c68a965f66FA7a88855F9f7784502a7F",
            pageSize: 5
        });

        console.log(`Found ${transfers.length} USDC transfers from the address on Arbitrum`);

        // Example 5: Get Transfer events for a token
        console.log("\nGetting Transfer events for USDC on Arbitrum...");
        const events = await client.getEvents({
            chain: "arbitrum",
            tokenAddress: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
            eventName: "Transfer"
        });

        console.log(`Found ${events.events.length} Transfer events for the token on Arbitrum`);

        if (events.events && events.events.length > 0) {
            console.log("\nFirst event:");
            console.log(events.events[0]);
        }

    } catch (error) {
        console.error("Error occurred:", error);
    } finally {
        // Close the client (not needed in JavaScript but included for API compatibility)
        client.close();
    }
}

// Run the examples
if (typeof window !== 'undefined') {
    // In browser, run when the page loads
    window.addEventListener('DOMContentLoaded', runExamples);
} else {
    // In Node.js, run immediately
    runExamples();
}