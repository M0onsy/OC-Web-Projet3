let monToken = localStorage;

console.log(monToken);
let user = {
  email: 'email',
  password: 'password'
};

localStorage.setItem(user, token);
async function submit() {
  let response = await fetch ('http://localhost:5678/api/users/login', {

    methode: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(user)
  });

}