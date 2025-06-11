const HeimdahlClient = require('../src/index');


async function runExample() {
    const client = new HeimdahlClient("demo");

    client.streamSwaps("meteora-dlmm", (event) => {
            console.log(JSON.stringify(event, null, 2));
        }
    );
}


// Run the examples
if (typeof window !== 'undefined') {
    // In browser, run when the page loads
    window.addEventListener('DOMContentLoaded', runExamples);
} else {
    // In Node.js, run immediately
    runExample();
}