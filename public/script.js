
// Information to reach API
const url = 'http://localhost:4001/envelopes';

// Selects page elements
// Post envelope
const postButt = document.getElementById('postButt');
const postEnv = document.getElementById('postEnv');
const postBal = document.getElementById('postBal');

// Add to envelope
const addButt = document.getElementById('addButt');
const addEnv = document.getElementById('addEnv');
const addVal = document.getElementById('addVal');

// Minus from envelope
const minButt = document.getElementById('minButt');
const minEnv = document.getElementById('minEnv');
const minVal = document.getElementById('minVal');

// Delete envelope
const delButt = document.getElementById('delButt');
const delEnv = document.getElementById('delEnv');

// Transfer between envelopes
const tranButt = document.getElementById('tranButt');
const fromEnv = document.getElementById('fromEnv');
const toEnv = document.getElementById('toEnv');
const tranVal = document.getElementById('tranVal');


//GET Data on start up and insert data into table in HTML

const fetchTable = () => {
  fetch(url)
  .then(res => res.json())
  .then(res => { 
  addHtmlTable(res)
})
}
fetchTable();

//POST envelope
const postEnvFunc = () => {
    const envQuery = postEnv.value;
    const balQuery = postBal.value;
    const obj = {};
    obj[envQuery] = balQuery;

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
        return response.text();
      } throw new Error('Request failed!');
    }, networkError => {
      console.log(networkError.message)
    })
    .then((textResponse => {
    document.getElementById('display').innerHTML = `${textResponse}`
    $('#table').load('http://localhost:4001/ #table th')
    fetchTable();
  }))
}

// ADD to envelope
const addEnvFunc = () => {
    const envQuery = addEnv.value;
    const valQuery = addVal.value;
    const obj = {};
    obj[envQuery] = valQuery;
    
    const endpoint = `${url}/${envQuery}/add`

    fetch(endpoint, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      mode: 'cors',
      body: JSON.stringify(obj)
    })
    .then(response => {
      if (response.ok) {
        console.log(response)
        return response.text();
      } throw new Error('Request failed!');
    }, networkError => {
      console.log(networkError.message)
    })
    .then((textResponse => {
      document.getElementById('display').innerHTML = `${textResponse}`
      $('#table').load('http://localhost:4001/ #table th')
      fetchTable();
  }))
}

// MINUS from envelope
const minEnvFunc = () => {
  const envQuery = minEnv.value;
  const valQuery = minVal.value;
  const obj = {};
  obj[envQuery] = valQuery;
  
  const endpoint = `${url}/${envQuery}/minus`

  fetch(endpoint, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    mode: 'cors',
    body: JSON.stringify(obj)
  })
  .then(response => {
    if (response.ok) {
      console.log(response)
      return response.text();
    } throw new Error('Request failed!');
  }, networkError => {
    console.log(networkError.message)
  })
  .then((textResponse => {
    document.getElementById('display').innerHTML = `${textResponse}`
    $('#table').load('http://localhost:4001/ #table th')
    fetchTable();
}))
}

// DELETE envelope
const delEnvFunc = () => {
  const envQuery = delEnv.value;
  const endpoint = `${url}/${envQuery}`

  fetch(endpoint, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    mode: 'cors',
  })
  .then(response => {
    if (response.ok) {
      console.log(response)
      return response.text();
    } throw new Error('Request failed!');
  }, networkError => {
    console.log(networkError.message)
  })
  .then((textResponse => {
    document.getElementById('display').innerHTML = `${textResponse}`
    $('#table').load('http://localhost:4001/ #table th')
    fetchTable();
}))
}

// TRANSFER between envelopes
const tranEnvFunc = () => {
  const fromQuery = fromEnv.value;
  const toQuery = toEnv.value;
  const valQuery = tranVal.value

  
  const endpoint = `${url}/transfer/${fromQuery}/${toQuery}`

  fetch(endpoint, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'value': valQuery
    },
    mode: 'cors',
  })
  .then(response => {
    if (response.ok) {
      console.log(response)
      return response.text();
    } throw new Error('Request failed!');
  }, networkError => {
    console.log(networkError.message)
  })
  .then((textResponse => {
    document.getElementById('display').innerHTML = `${textResponse}`
    $('#table').load('http://localhost:4001/ #table th')
    fetchTable();
}))
}

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


// Event triggers

postButt.addEventListener("click", (e) => {
  e.preventDefault()
  postEnvFunc()
});

addButt.addEventListener("click", (e) => {
  e.preventDefault()
  addEnvFunc()
});

minButt.addEventListener("click", (e) => {
  e.preventDefault()
  minEnvFunc()
});

delButt.addEventListener("click", (e) => {
  e.preventDefault()
  delEnvFunc()
});

tranButt.addEventListener("click", (e) => {
  e.preventDefault()
  tranEnvFunc()
});