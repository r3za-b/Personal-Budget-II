const { Pool } = require('pg');

// connection to database when running from Heroku
const pool = new Pool({ 
    connectionString: process.env.DATABASE_URL,	// use DATABASE_URL environment variable from Heroku app 
    ssl: {
        rejectUnauthorized: false // don't check for SSL cert
      }
});

// connection to database when running app locally
/*const pool = new Pool({
  user: 'Reza',
  host: 'localhost',
  database: 'envelopes',
  password: null,
  port: 5432,
})*/

// create functions for each route

// GET all envelopes
const getEnvs = (req, res) => {
    pool.query('SELECT * FROM envelopes ORDER BY id ASC', (error, results) => { 
        if (error) {
            throw error
        }
        res.status(200).send(results.rows)
    })
}

// GET a single envelope
const getEnv = (req, res) => {
    const envelope = req.params.envelope
    pool.query('SELECT * FROM envelopes where envelope = $1', [envelope], (error, results) => { 
        if (error) {
            throw error
        }
        res.status(200).send(results.rows)
    })
}

// PUT minus from balance of existing envelope
const putMinus = (req, res) => {
    const envelope = req.params.envelope;
    const value = Object.values(req.body)[0];
    minusMoney(envelope, value, res)
} 

// PUT add to balance of existing envelope
const putAdd = (req, res) => {
    const envelope = req.params.envelope;
    const value = Object.values(req.body)[0];
    addMoney(envelope, value, res)
} 

// PUT Transfer some of the balance of one envelope to another
const putTransfer = (req, res) => {
    const value = req.headers.value;
    const fromEnv = req.params.from;
    const toEnv = req.params.to;
    transferMoney(fromEnv, toEnv, value, res);
} 

// POST envelope
const postEnv = (req, res) => {
    const envelope = Object.keys(req.body)[0];
    const value = Object.values(req.body)[0];
    addEnv(envelope, value, res);
}

// DELETE envelope
const delEnv = (req, res) => {
    const envelope = req.params.envelope;
    removeEnv(envelope, res);
}

// functions

const addMoney = (envelope, value, res) => {
    let balance = Number(0)
        // I had to create a Promise because I was getting an error that balance could not be calculated as it was still waiting for the query result
    pool
    .query('SELECT balance FROM envelopes where envelope = $1', [envelope])
    .then(results => {
        balance = Object.values(results.rows[0])[0];
    })
    .then(() => {
        balance += Number(value);
    })
    .then(() => {
        pool.query('UPDATE envelopes SET balance = $1 where envelope = $2', [balance, envelope], (error, results) => { 
            if (error) {
                throw error;
            }
            res.status(200).send(`${envelope} updated with balance of ${balance}`);
        })
    })
    .catch(e => console.error(e))
}

const minusMoney = (envelope, value, res) => {
    let balance = Number(0)
    pool
    .query('SELECT balance FROM envelopes where envelope = $1', [envelope])
    .then(results => {
        balance = Object.values(results.rows[0])[0];
    })
    .then(() => {
        balance -= Number(value);
    })
    .then(() => {
        pool.query('UPDATE envelopes SET balance = $1 where envelope = $2', [balance, envelope], (error, results) => { 
            if (error) {
                throw error;
            }
            res.status(200).send(`${envelope} updated with balance of ${balance}`);
        })
    })
    .catch(e => console.error(e))
}

const transferMoney = (fromEnv, toEnv, value, res) => {
    let balFrom = Number(0)
    let balTo = Number(0)
    // Minus from envelope
    pool
    .query('SELECT balance FROM envelopes where envelope = $1', [fromEnv])
    .then(results => {
        console.log('res1', results)
        balFrom = Object.values(results.rows[0])[0];
    })
    .then(() => {
        balFrom -= Number(value);
        console.log('balFrom', balFrom)
    })
    .then(() => {
        pool.query('UPDATE envelopes SET balance = $1 where envelope = $2', [balFrom, fromEnv], (error, results) => { 
            if (error) {
                throw error;
            }
        })
    })
    // Add to envelope
    .then(() => { 
        pool
        .query('SELECT balance FROM envelopes where envelope = $1', [toEnv])
        .then(results => {
            balTo = Object.values(results.rows[0])[0];     
        })
        .then(() => {
            balTo += Number(value);
        })
        .then(() => {
            pool.query('UPDATE envelopes SET balance = $1 where envelope = $2', [balTo, toEnv], (error, results) => { 
                if (error) {
                    throw error;
                }
                res.status(200).send(`${fromEnv} updated with balance of ${balFrom} and ${toEnv} updated with balance of ${balTo}`);
            })
        })
    })
    .catch(e => console.error(e))
}

const addEnv = (envelope, value, res) => {
    pool.query('INSERT INTO envelopes (envelope, balance) VALUES ($1, $2)', [envelope, value], (error, results) => { 
        if (error) {
            throw error;
        } res.status(201).send(`${envelope} with balance ${value} created and ready to use`) 
    })
}
//`${envelope} with balance ${value} created and ready to use`

const removeEnv = (envelope, res) => {
    pool.query('DELETE FROM envelopes WHERE envelope = $1', [envelope], (error, results) => { 
        if (error) {
            res.status(404).send();
            throw error;
        } res.status(202).send(`${envelope} has been removed`) 
    })
}

module.exports = {
    getEnvs,
    getEnv,
    putMinus,
    putAdd,
    putTransfer,
    postEnv,
    delEnv
};
