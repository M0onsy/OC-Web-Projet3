function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

async function submit() {
  let emailInput = document.getElementById('email');
  let passwordInput = document.getElementById('password');
  let error = document.getElementById('errorActive');
  let isError = false;

  let email = emailInput.value;
  let password = passwordInput.value;

  console.log(validateEmail(email));
  if (email && !validateEmail(email)) {
    console.log("email");
    error.innerHTML = "Veuillez saisir une adresse e-mail valide.";
    if (!password) {
      error.innerHTML += "Veuillez saisir votre mot de passe.";
    }
    return;
  }

  if (!password) {
    error.innerHTML = "Veuillez saisir votre mot de passe.";
    return;
  }

  let user = {
    email: email,
    password: password
  };

  let response = await fetch('http://localhost:5678/api/users/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(user)
  });

  let result = await response.json();
  sessionStorage.setItem('authToken', result.token);

  if (response.status === 200) {
    window.location.href = "index.html";
  } else {
    error.innerHTML = "Une erreur est survenue. Veuillez vérifier votre adresse e-mail et/ou votre mot de passe.";
  }
}

document.getElementById('submit').addEventListener('click', async function(e) {
  e.preventDefault();
  await submit();
});

