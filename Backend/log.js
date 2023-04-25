let monToken = localStorage;
console.log(monToken);

let user = {
  email: 'email',
  password: 'password'
};

async function submit() {
  let response = fetch ('http://localhost:5678/api/users/login', {

    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(user)
  })
  let result = await response.json();

  if (result.status === 200) {
    location = "index.html";
  } else {
    alert("HTTP-Error: " + response.status);
  };
}

