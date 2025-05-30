const HeimdahlClient = require('../src/index');


async function runExample() {
    const client = new HeimdahlClient("demo");

// Start real-time Raydium CPMM stream
    client.streamSwaps("raydium-cpmm", (event) => {
        if (event.type === "raydium") {
            console.log("Raydium Swap:");
            console.log("  Amount In:", event.amountIn);
            console.log("  Min Out  :", event.minOut);
            console.log("  Tx       :", event.tx);
        } else if (event.type === "pumpfun") {
            console.log("Pump.fun Buy:");
            console.log("  Amount  :", event.amount);
            console.log("  Max SOL :", event.maxSol);
            console.log("  Tx      :", event.tx);
        }
    });
}


// Run the examples
if (typeof window !== 'undefined') {
    // In browser, run when the page loads
    window.addEventListener('DOMContentLoaded', runExamples);
} else {
    // In Node.js, run immediately
    runExample();
}