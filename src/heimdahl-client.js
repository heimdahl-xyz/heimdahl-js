/**
 * JavaScript SDK for the Heimdahl blockchain data platform.
 *
 * Provides access to cross-chain swap, transfer, and event data with a unified interface.
 * Compatible with both browser and Node.js environments.
 */


// import fetch from "node-fetch";


class HeimdahlClient {
    /**
     * Initialize the Heimdahl client.
     *
     * @param {string} apiKey - Your Heimdahl API key
     * @param {string} [baseUrl="https://api.heimdahl.xyz/v1"] - API base URL (defaults to production)
     */
    constructor(apiKey, baseUrl = "https://api.heimdahl.xyz/v1") {
        this.apiKey = apiKey;
        this.baseUrl = baseUrl;
        this.headers = {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json"
        };
    }

    /**
     * Make a request to the Heimdahl API.
     *
     * @param {string} endpoint - API endpoint to call
     * @param {Object} [params=null] - Query parameters to include
     * @returns {Promise<Object>} - API response parsed as JSON
     * @private
     */
    async _makeRequest(endpoint, params = null) {
        const url = new URL(`${this.baseUrl}/${endpoint}`);

        // Add query parameters if they exist
        if (params) {
            Object.keys(params).forEach(key => {
                if (params[key] !== null && params[key] !== undefined) {
                    url.searchParams.append(key, params[key]);
                }
            });
        }

        // Use fetch API which works in both browser and Node.js (with node-fetch)
        let response;
        response = await fetch(url.toString(), {
            method: 'GET',
            headers: this.headers
        });

        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}: ${response.statusText}`);
        }

        return await response.json();
    }

    /**
     * Get list of supported chains.
     *
     * @returns {Promise<Array>} - List of supported chains
     */
    async getChains() {
        const endpoint = "chains";
        return this._makeRequest(endpoint, {});
    }

    /**
     * Get list of registered ethereum evm compatible contracts.
     *
     * @returns {Promise<Array>} - List of supported contracts
     */
    async getContracts() {
        const endpoint = "contracts";
        return this._makeRequest(endpoint, {});
    }

    /**
     * Get cross-chain swap data using the unified pattern.
     *
     * @param {Object} options - Swap query options
     * @param {string} [options.chain="all"] - Blockchain name (ethereum, arbitrum, solana, etc.) or "all"
     * @param {string} [options.network="mainnet"] - Network (mainnet, testnet)
     * @param {string} [options.token1=null] - First token address or symbol
     * @param {string} [options.token2=null] - Second token address or symbol
     * @param {string} [options.sizeBucket="all"] - Size category (micro, small, medium, large, whale, all)
     * @param {number} [options.page=0] - Page number for pagination
     * @param {number} [options.pageSize=10] - Number of results per page
     * @returns {Promise<Array>} - List of swap dictionaries
     */
    async getSwaps({
                       chain = "all",
                       network = "mainnet",
                       token1 = null,
                       token2 = null,
                       sizeBucket = "all",
                       page = 0,
                       pageSize = 10
                   } = {}) {
        // Build the pattern-based URL
        const patternParts = [chain, network];

        if (token1) {
            patternParts.push(token1);
            if (token2) {
                patternParts.push(token2);
                patternParts.push(sizeBucket);
            } else {
                patternParts.push("all"); // Default if token2 not specified
                patternParts.push(sizeBucket);
            }
        }

        // URL-encode each part if needed
        const encodedParts = patternParts.map(part => encodeURIComponent(part));
        const pattern = encodedParts.join(".");

        // Make the request
        const endpoint = `swaps/list/${pattern}`;
        const params = {
            page: page,
            pageSize: pageSize
        };

        return this._makeRequest(endpoint, params);
    }

    /**
     * Get token transfer data across chains.
     *
     * @param {Object} options - Transfer query options
     * @param {string} [options.chain="all"] - Blockchain name (ethereum, arbitrum, solana, etc.) or "all"
     * @param {string} [options.network="mainnet"] - Network (mainnet, testnet)
     * @param {string} [options.token=null] - Token address or symbol
     * @param {string} [options.fromAddress=null] - Filter by sender address
     * @param {string} [options.toAddress=null] - Filter by recipient address
     * @param {number} [options.page=0] - Page number for pagination
     * @param {number} [options.pageSize=10] - Number of results per page
     * @returns {Promise<Array>} - List of transfer dictionaries
     */
    async getTransfers({
                           chain = "all",
                           network = "mainnet",
                           token = null,
                           fromAddress = null,
                           toAddress = null,
                           page = 0,
                           pageSize = 10
                       } = {}) {
        // Build the pattern-based URL
        const patternParts = [chain, network];

        if (token) {
            patternParts.push(token);
            if (fromAddress) {
                patternParts.push(fromAddress);
                if (toAddress) {
                    patternParts.push(toAddress);
                } else {
                    patternParts.push("all"); // Default if to_address not specified
                }
            } else {
                patternParts.push("all"); // Default if from_address not specified
                if (toAddress) {
                    patternParts.push(toAddress);
                } else {
                    patternParts.push("all"); // Default if to_address not specified
                }
            }
        }

        patternParts.push("all"); // Final part of the pattern

        // URL-encode each part if needed
        const encodedParts = patternParts.map(part => encodeURIComponent(part));
        const pattern = encodedParts.join(".");

        // Make the request
        const endpoint = `transfers/list/${pattern}`;
        const params = {
            page: page,
            pageSize: pageSize
        };

        return this._makeRequest(endpoint, params);
    }

    /**
     * Get raw blockchain events for a specific token and event type.
     *
     * @param {Object} options - Event query options
     * @param {string} options.chain - Blockchain name
     * @param {string} options.tokenAddress - Token contract address
     * @param {string} options.eventName - Event name (e.g., "Transfer")
     * @returns {Promise<Array>} - List of event dictionaries
     */
    async getEvents({
                        chain,
                        tokenAddress,
                        eventName
                    }) {
        // Make the request
        const endpoint = `events/list/${chain}.mainnet.${tokenAddress}.${eventName}`;
        return this._makeRequest(endpoint);
    }

    /**
     * Search for swaps between a specific token pair.
     *
     * @param {Object} options - Search options
     * @param {string} options.token1 - First token symbol or address
     * @param {string} options.token2 - Second token symbol or address
     * @param {string} [options.chain="all"] - Blockchain name or "all"
     * @param {string} [options.network="mainnet"] - Network (mainnet, testnet)
     * @param {string} [options.sizeBucket="all"] - Size category
     * @param {number} [options.limit=100] - Maximum number of results to return
     * @returns {Promise<Array>} - List of matching swaps
     */
    async searchSwapsByTokenPair({
                                     token1,
                                     token2,
                                     chain = "all",
                                     network = "mainnet",
                                     sizeBucket = "all",
                                     limit = 100
                                 }) {
        const results = [];
        let page = 0;
        const pageSize = Math.min(100, limit);

        while (results.length < limit) {
            const swaps = await this.getSwaps({
                chain,
                network,
                token1,
                token2,
                sizeBucket,
                page,
                pageSize
            });

            if (!swaps || !swaps.swaps || swaps.swaps.length === 0) {
                break;
            }

            results.push(...swaps.swaps);
            if (swaps.swaps.length < pageSize) {
                break;
            }

            page += 1;
        }

        return results.slice(0, limit);
    }

    /**
     * Get all transfers for a specific token, optionally filtered by address.
     *
     * @param {Object} options - Token transfer options
     * @param {string} options.token - Token symbol or address
     * @param {string} [options.fromAddress=null] - Optional sender address
     * @param {string} [options.toAddress=null] - Optional recipient address
     * @param {string} [options.chain="all"] - Blockchain name or "all"
     * @param {string} [options.network="mainnet"] - Network (mainnet, testnet)
     * @param {number} [options.limit=100] - Maximum number of results
     * @returns {Promise<Array>} - List of matching transfers
     */
    async getTokenTransfers({
                                token,
                                fromAddress = null,
                                toAddress = null,
                                chain = "all",
                                network = "mainnet",
                                limit = 100
                            }) {
        const results = [];
        let page = 0;
        const pageSize = Math.min(100, limit);

        while (results.length < limit) {
            const transfers = await this.getTransfers({
                chain,
                network,
                token,
                fromAddress,
                toAddress,
                page,
                pageSize
            });

            if (!transfers || transfers.length === 0) {
                break;
            }

            results.push(...transfers);
            if (transfers.length < pageSize) {
                break;
            }

            page += 1;
        }

        return results.slice(0, limit);
    }

    /**
     * Close the client (mostly for compatibility with Python version)
     * In JavaScript, this is a no-op as fetch doesn't maintain persistent connections
     */
    close() {
        // No-op in JavaScript - added for API compatibility with Python SDK
    }
}

// Export the client for both Node.js and browser environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HeimdahlClient;
} else if (typeof window !== 'undefined') {
    window.HeimdahlClient = HeimdahlClient;
}