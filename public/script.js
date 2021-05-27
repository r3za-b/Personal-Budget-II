
// Information to reach API
const url = 'http://localhost:4001/envelopes';

// Selects page elements
// Add to envelope
const addEnv_butt = document.getElementById('addEnv_butt');
const addEnv_env = document.getElementById('addEnv_env');
const addEnv_bal = document.getElementById('addEnv_bal');

//GET Data on start up and insert data into table in HTML
fetch(url)
.then(res => res.json())
.then(res => { 
  addHtmlTable(res)
})

//POST envelope
const addEnv = () => {
    const envQuery = addEnv_env.value;
    const balQuery = addEnv_bal.value;
    const obj = {};
    obj[envQuery] = balQuery;
    console.log(obj)
  
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      mode: 'cors',
      body: JSON.stringify(obj)
    })
    .then(response => {
      if (response.ok) {
        console.log(response)
        return response.json();
      } throw new Error('Request failed!');
    }, networkError => {
      console.log(networkError.message)
    })
    .then((jsonResponse => {
    console.log(jsonResponse)
  }))
}

// ADD to envelope




// Functions

const addHtmlTable = (data) => {
  data.forEach(element => { 
    const table = document.getElementById('table');
    newRow = table.insertRow(table.length);
    cell1 = newRow.insertCell(0);
    cell2 = newRow.insertCell(1);
    envelope = element['envelope'];
    balance = element['balance'];
    cell1.innerHTML = envelope;
    cell2.innerHTML = balance;
  })
}

addEnv_butt.addEventListener("click", (e) => {
  e.preventDefault()
  addEnv()
  refreshPage()
});

const refreshPage = () => {
  window.location.reload();
} 