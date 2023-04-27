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

  let result = await response.json()
  sessionStorage.setItem('authToken', result.token)

  if (response.status === 200) {
    window.location.href = "index.html";
  } else if (response.status !== 200) {
    const error = document.getElementById('errorActive');
    error.innerHTML = "Une erreur est survenue, veuillez vérifier votre mail et/ou votre mot de passe";
  }
}

document.getElementById('submit').addEventListener('click', async function(e) {
  e.preventDefault()
  await submit()
})