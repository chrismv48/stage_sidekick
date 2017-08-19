const Api = (endpoint, method = 'get', payload = null) => {
  const fetchOptions = {
    method,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  }
  if (payload) {
    fetchOptions.body = JSON.stringify(payload)
  }

  return fetch(`http://localhost:3005/${endpoint}`, fetchOptions)
    .then(response => {
      return response.json()
        .then(data => data)
    })
    .catch(error => {
      throw error;
    })
};

export default Api
