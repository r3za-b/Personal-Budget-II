const express = require('express'); // Import express module 
const app = express(); // Create an instance of express 
const cors = require('cors');

app.use(express.static("public"));
app.use(cors());

const PORT = 4001;

const envelopesRouter = require('./routes.js'); // Import the envelopesRouter
app.use('/envelopes', envelopesRouter); // We mount a router at a certain path using app.use()

app.listen(PORT, () => { // Listen for requests on a certain port 
    console.log(`Server is listening on ${PORT}`);
});

