async function submit() {
  let user = {
    email: 'email',
    password: 'password'
  };
  try {
    let response = await fetch('http://localhost:5678/api/users/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(user)
  }).then(response1 => {
    console.log(typeof response1)
    return response1

  }).catch(e => console.log(e))
  
  

  console.log(response);

  localStorage.setItem('token', JSON.stringify(response))

  if (response.status === 200) {
    console.log('cadada')
   // window.location.href = "index.html";
  }

  }catch(e){
    console.log(e)
  }

  console.log('tata')
  
}

document.getElementById('submit').addEventListener('click', async function(e) {
  e.preventDefault()
  console.log('toto')
  await submit()
})