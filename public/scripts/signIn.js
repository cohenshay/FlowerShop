$(document).ready(function() {
    $('select').formSelect();
});


async function addUser() {

      

  const fname = $("#first_name").val();
  const lname = $("#last_name").val();
  const address = $("#address").val();
  const email = $("#email").val();
  const contact = $("#contact").val();
  const shopNumber = $("#shopNumber").val();
  const type = "user";
  const username = $("#username").val();
  const password = $("#password").val();

const url = "http://localhost:8080/addUser";

let data = {
  fname,
  lname,
  address,
  email,
  contact,
  type,
  shopNumber,
  username,
  password
};

let fetchData = {
  method: "POST",
  credentials: "same-origin",
  body: JSON.stringify(data),
  headers: new Headers({
    "Content-Type": "application/json"
  })
};

const result = await fetch(url, fetchData);
const json = await result.json();

}


