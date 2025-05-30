const HeimdahlClient = require('../src/index');


async function runExample() {
    const client = new HeimdahlClient("demo");

// Start real-time Raydium CPMM stream
    client.streamSwaps("pumpfun", (event) => {
        if (event.type === "raydium") {
            console.log("Raydium Swap:");
            if (event.instruction === "swapBaseInput") {
                console.log("  Event type:", event.instruction);
                console.log("  Amount In:", event.amountIn);
                console.log("  Min Out  :", event.minAmountOut);
                console.log("  Tx       :", event.tx);
            }

            if (event.instruction === "swapBaseOutput") {
                console.log("  Event type:", event.instruction);
                console.log("  Amount Out:", event.amountOut);
                console.log("  Max In  :", event.maxAmountIn);
                console.log("  Tx       :", event.tx);
            }
        } else if (event.type === "pumpfun") {
            if (event.instruction === "buy") {
                console.log("Pump.fun Buy:");
                console.log("  Amount  :", event.amount);
                console.log("  Max SOL Cost :", event.maxSol);
                console.log("  Tx      :", event.tx);
            }

            if (event.instruction === "sell") {
                console.log("Pump.fun Sell:");
                console.log("  Amount  :", event.amount);
                console.log("  Min SOL Output :", event.minSol);
                console.log("  Tx      :", event.tx);
            }
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