// Set-up environment 
const express = require('express'); // Import the web framework express 
const envelopes = require('./db.js'); // Import envelopes array
const db = require('./queries');

const envelopesRouter = express.Router() /* An express router provides a subset of express methods. To create a subset of one we invoke the .Router() method on the top-level Express import. This gives us access to the Router object through envelopesRouter*/

envelopesRouter.use(express.json()); /* This allows us to access the body data in a HTTP request packet through the object req.body. .use mounts the specified middleware of function at a specified route. Instances without a path specified mean the middleware mounted will be executed for every request to the app */


// Read all envelopes
envelopesRouter.get('/', db.getCategories)

// Read a single envelope
envelopesRouter.get('/:category', db.getCategory)

// Update an envelope's balance: minus money
envelopesRouter.put('/:category', db.putMinus)

// Update an envelope's balance: add money


// Create an envelope
envelopesRouter.post('/', (req, res, next) => {
    const id = envelopes.length + 1
    const a = {
        "ID": id,
        "category": Object.values(req.body)[0],
        "balance": Object.values(req.body)[1]
    }
    envelopes.push(a);
    res.status(201).send(envelopes[id - 1])
})

// Transfer budget from one envelope to another
envelopesRouter.post('/transfer/:from/:to', (req, res, next) => {
    const value = req.headers.value;
    const indexFrom = envelopes.findIndex(x => { // find index of array by category
    return x.category === req.params.from;
    })
    const indexTo = envelopes.findIndex(x => { // find index of array by category
    return x.category === req.params.to;
    })
    envelopes[indexFrom]["balance"] -= Number(value);
    envelopes[indexTo]["balance"] += Number(value)
    res.status(201).send(envelopes[indexTo]);
})

// Delete an envelope
envelopesRouter.delete('/:category', (req, res, next) => {
    const index = envelopes.findIndex(x => { // find index of array by category
        return x.category === req.params.category;
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