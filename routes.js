// Set-up environment 
const express = require('express'); // Import the web framework express 
const envelopes = require('./db.js'); // Import envelopes array
const db = require('./queries');

const envelopesRouter = express.Router() /* An express router provides a subset of express methods. To create a subset of one we invoke the .Router() method on the top-level Express import. This gives us access to the Router object through envelopesRouter*/

envelopesRouter.use(express.json()); /* This allows us to access the body data in a HTTP request packet through the object req.body. .use mounts the specified middleware of function at a specified route. Instances without a path specified mean the middleware mounted will be executed for every request to the app */


// Read all envelopes
envelopesRouter.get('/', db.getEnvelopes)

// Read a single envelope
envelopesRouter.get('/:envelope', db.getEnvelope)

// Update an envelope's balance: minus money
envelopesRouter.put('/:envelope/minus', db.putMinus)

// Update an envelope's balance: add money
envelopesRouter.put('/:envelope/add', db.putAdd)


// Transfer budget from one envelope to another
envelopesRouter.put('/transfer/:from/:to', db.putTransfer)


// Create an envelope
envelopesRouter.post('/', (req, res, next) => {
    const id = envelopes.length + 1
    const a = {
        "ID": id,
        "envelope": Object.values(req.body)[0],
        "balance": Object.values(req.body)[1]
    }
    envelopes.push(a);
    res.status(201).send(envelopes[id - 1])
})

// Delete an envelope
envelopesRouter.delete('/:envelope', (req, res, next) => {
    const index = envelopes.findIndex(x => { // find index of array by envelope
        return x.envelope === req.params.envelope;
    })
    if (index !== -1) {
        envelopes.splice(index, 1);
        res.status(202).send()
    } else {
        res.status(404).send()
    }
})


// Export router
module.exports = envelopesRouter;