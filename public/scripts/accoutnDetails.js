$(document).ready(function() {
      $('select').formSelect();
});

async function updateRow() {
    
  const id = $("#id").val();
  const fname = $("#first_name").val();
  const lname = $("#last_name").val();
  const address = $("#address").val();
  const email = $("#email").val();
  const contact = $("#contact").val();
  const shopNumber = $("#shopNumber").val();
  const type = $("#status").val();
  const username = $("#username").val();
  const password = $("#password").val();

  const url = "http://localhost:8080/updateUser";

  let data = {
    id,
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
    method: "PUT",
    credentials: "same-origin",
    body: JSON.stringify(data),
    headers: new Headers({
      "Content-Type": "application/json"
    })
  };
  try {
    const result = await fetch(url, fetchData);
  
  
    if (result.status == 200) {
        
    }
  } catch (error) {
    console.log(error)
  }
}


async function addUser() {
  const fname = $("#AddName").val();
  const lname = $("#AddLastName").val();
  const address = $("#AddAddress").val();
  const email = $("#Addemail").val();
  const contact = $("#AddContact").val();
  const shopNumber = $("#AddShopNumber").val();
  const type = $(".addDDR").val();
  const username = $("#AddUsername").val();
  const password = $("#AddPassword").val();

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
  if (result.status == 200 && json != null) {
    $("tbody").append(` <tr class='userTable' key=${json._id}</tr>>
    <td><input type='checkbox' class='checkthis' /></td>
    <td>
        ${json._id}
    </td>
    <td>
        ${json.fname}
    </td>
    <td>
        ${json.lname}
    </td>
    <td>
        ${json.address}
    </td>
    <td>
        ${json.email}
    </td>
    <td>
        ${json.contact}
    </td>
    <td>
        ${json.type}
    </td>
    <td>
        <p data-placement='top' data-toggle='tooltip' title='Edit'><button
                onclick='loadEditData(this)' class='btn btn-primary btn-xs'
                data-title='Edit' data-toggle='modal' data-target='#edit'><span
                    class='glyphicon glyphicon-pencil'></span></button></p>
    </td>
    <td>
        <p data-placement='top' data-toggle='tooltip' title='Delete'><button
                onclick='loadDeleteData(this)' class='btn btn-danger btn-xs'
                data-title='Delete' data-toggle='modal' data-target='#delete'><span
                    class='glyphicon glyphicon-trash'></span></button></p>
    </td>
  </tr>`);
  }

  $(".close")[1].click();
}
