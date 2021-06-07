// Set-up environment 
const express = require('express'); // Import the web framework express 
const db = require('./queries');

const envelopesRouter = express.Router() /* An express router provides a subset of express methods. To create a subset of one we invoke the .Router() method on the top-level Express import. This gives us access to the Router object through envelopesRouter*/

envelopesRouter.use(express.json()); /* This allows us to access the body data in a HTTP request packet through the object req.body. .use mounts the specified middleware of function at a specified route. Instances without a path specified mean the middleware mounted will be executed for every request to the app */


/*envelopesRouter.get('/', (req, res, next) =>{
    res.sendFile(__dirname + '/public/index.html');
})

envelopesRouter.get('/style.css', function(req, res) {
    res.sendFile(__dirname + "/public/style.css");
});

envelopesRouter.get('/script.js', function(req, res) {
    res.sendFile(__dirname + "/public/script.js");
});*/



// Read all envelopes
envelopesRouter.get('/', db.getEnvs)

// Read a single envelope
envelopesRouter.get('/:envelope', db.getEnv)

// Update an envelope's balance: minus money
envelopesRouter.put('/:envelope/minus', db.putMinus)

// Update an envelope's balance: add money
envelopesRouter.put('/:envelope/add', db.putAdd)


// Transfer budget from one envelope to another
envelopesRouter.put('/transfer/:from/:to', db.putTransfer)


// Create an envelope
envelopesRouter.post('/', db.postEnv)

// Delete an envelope
envelopesRouter.delete('/:envelope', db.delEnv)


// Export router
module.exports = envelopesRouter;