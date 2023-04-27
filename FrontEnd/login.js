async function submit() {
  
  let user = {
    email: document.getElementById('email').value,
    password: document.getElementById('password').value
  };

  let response = await fetch('http://localhost:5678/api/users/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  body: JSON.stringify(user)
  })

  localStorage.setItem('token', JSON.stringify(response))

  if (response.status === 200) {
    window.location.href = "index-edit.html";
  }
}

document.getElementById('submit').addEventListener('click', async function(e) {
  e.preventDefault()
  await submit()
})