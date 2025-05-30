const HeimdahlClient = require('../src/index');


async function runExample() {
    const client = new HeimdahlClient("demo");

// Start real-time Raydium CPMM stream
    client.streamSwaps("pumpfun", (event) => {
            // if (event.type === "raydium") {
            //     console.log("Raydium Swap:");
            //     if (event.instruction === "swapBaseInput") {
            //         console.log("  Event type:", event.instruction);
            //         console.log("  Amount In:", event.amountIn);
            //         console.log("  Min Out  :", event.minAmountOut);
            //         console.log("  Tx       :", event.tx);
            //     }
            //
            //     if (event.instruction === "swapBaseOutput") {
            //         console.log("  Event type:", event.instruction);
            //         console.log("  Amount Out:", event.amountOut);
            //         console.log("  Max In  :", event.maxAmountIn);
            //         console.log("  Tx       :", event.tx);
            //     }
            // }
            // else
            //     if (event.type === "pumpfun") {
            if (event.Instruction === "buy") {
                console.log("Pump.fun Buy:");
                console.log("  Timestamp           :", event.timestamp);
                console.log("  Slot                :", event.slot);
                console.log("  Tx Signature        :", event.tx_signature);
                console.log("  Program             :", event.program);
                console.log("  Instruction         :", event.instruction);
                console.log("  Arguments:");
                console.log("    Amount            :", event.arguments.Amount);
                console.log("    MaxSolCost        :", event.arguments.MaxSolCost);
                console.log("  Accounts:");
                console.log("    Global            :", event.accounts.Global);
                console.log("    FeeRecipient      :", event.accounts.FeeRecipient);
                console.log("    Mint              :", event.accounts.Mint);
                console.log("    BondingCurve      :", event.accounts.BondingCurve);
                console.log("    AssociatedBondingCurve :", event.accounts.AssociatedBondingCurve);
                console.log("    AssociatedUser    :", event.accounts.AssociatedUser);
                console.log("    User              :", event.accounts.User);
                console.log("    SystemProgram     :", event.accounts.SystemProgram);
                console.log("    TokenProgram      :", event.accounts.TokenProgram);
                console.log("    Rent              :", event.accounts.Rent);
                console.log("    EventAuthority    :", event.accounts.EventAuthority);
                console.log("    Program (again)   :", event.accounts.Program);

            }

            if (event.Instruction === "sell") {
                console.log("Pump.fun Sell:");
                console.log("  Timestamp           :", event.timestamp);
                console.log("  Slot                :", event.slot);
                console.log("  Tx Signature        :", event.tx_signature);
                console.log("  Program             :", event.program);
                console.log("  Instruction         :", event.instruction);
                console.log("  Arguments:");
                console.log("    Amount            :", event.arguments.Amount);
                console.log("    MinSolOutput      :", event.arguments.MinSolOutput);
                console.log("  Accounts:");
                console.log("    Global            :", event.accounts.Global);
                console.log("    FeeRecipient      :", event.accounts.FeeRecipient);
                console.log("    Mint              :", event.accounts.Mint);
                console.log("    BondingCurve      :", event.accounts.BondingCurve);
                console.log("    AssociatedBondingCurve :", event.accounts.AssociatedBondingCurve);
                console.log("    AssociatedUser    :", event.accounts.AssociatedUser);
                console.log("    User              :", event.accounts.User);
                console.log("    SystemProgram     :", event.accounts.SystemProgram);
                console.log("    AssociatedTokenProgram :", event.accounts.AssociatedTokenProgram);
                console.log("    TokenProgram      :", event.accounts.TokenProgram);
                console.log("    EventAuthority    :", event.accounts.EventAuthority);
                console.log("    Program (again)   :", event.accounts.Program);

            }
        }
    )
    ;
}


// Run the examples
if (typeof window !== 'undefined') {
    // In browser, run when the page loads
    window.addEventListener('DOMContentLoaded', runExamples);
} else {
    // In Node.js, run immediately
    runExample();
}