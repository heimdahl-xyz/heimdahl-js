const express = require('express');
const app = express();
const PORT = 3000;

// Serve static files from the 'public' directory
app.use(express.static('.'));

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

