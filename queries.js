const Pool = require('pg').Pool

const pool = new Pool({
  user: 'Reza',
  host: 'localhost',
  database: 'envelopes',
  password: null,
  port: 5432,
})

// create functions for each route

// GET all categories
const getCategories = (req, res) => {
    pool.query('SELECT * FROM envelopes ORDER BY id ASC', (error, results) => { 
        if (error) {
            throw error
        }
        res.status(200).send(results.rows)
    })
}

// GET a single category
const getCategory = (req, res) => {
    const category = req.params.category
    pool.query('SELECT * FROM envelopes where category = $1', [category], (error, results) => { 
        if (error) {
            throw error
        }
        res.status(200).send(results.rows)
    })
}

// PUT minus from balance of existing category
const putMinus = (req, res) => {
    const category = req.params.category;
    const cost = Object.values(req.body)[0];
    let balance = Number(0);
    
    // I had to create a Promise because I was getting an error that balance could not be calculated as it was still waiting for the query result
    pool
    .query('SELECT balance FROM envelopes where category = $1', [category])
    .then(results => {
        balance = Object.values(results.rows[0]);
        console.log('bal', balance)
    })
    .then(() => {
        balance -=cost;
        console.log('bal1', balance)
    })
    .catch(e => console.error(e))
    pool.query('UPDATE envelopes SET balance = $1 where category = $2', [balance, category], (error, results) => { 
        if (error) {
            throw error;
        }
        console.log('bal2', balance)
        res.status(200).send(`${category} updated with balance of ${balance}`);
    })
} 

// PUT add to balance of existing category
const putAdd = (req, res) => {
    const category = req.params.category;
    const value = Object.values(req.body)[0];
    addMoney(category, value, res)
} 

// PUT Transfer some of the balance of one category to another
const putTransfer = (req, res) => {
    // Minus money from "from" category
    const category = req.params.from;
    const money = req.headers.value;
    let balance = Number(0);
    pool
    .query('SELECT balance FROM envelopes where category = $1', [category])
    .then(results => {
        balance = Object.values(results.rows[0]);
    })
    .then(() => {
        balance -= money;
    })
    .catch(e => console.error(e))
    pool.query('UPDATE envelopes SET balance = $1 where category = $2', [balance, category], (error, results) => { 
        if (error) {
            throw error;
        }
        res.status(200).send(`${category} updated with balance of ${balance}`);
    })
    // Add money to "to" category
} 


// functions

/*const addMoney = (category, value, res) => {
    let balance = Number(0)
    pool
    .query('SELECT balance FROM envelopes where category = $1', [category])
    .then(results => {
        balance = Object.values(results.rows[0]);
        console.log(balance);
    })
    .then(() => {
        balance += Number(value);
    })
    .catch(e => console.error(e))
    pool.query('UPDATE envelopes SET balance = $1 where category = $2', [balance, category], (error, results) => { 
        if (error) {
            throw error;
        }
        res.status(200).send(`${category} updated with balance of ${balance}`);
    })
}*/

module.exports = {
    getCategories,
    getCategory,
    putMinus,
    putAdd
};
