$(document).ready(function() {
  $("#mytable #checkall").click(function() {
    if ($("#mytable #checkall").is(":checked")) {
      $("#mytable input[type=checkbox]").each(function() {
        $(this).prop("checked", true);
      });
    } else {
      $("#mytable input[type=checkbox]").each(function() {
        $(this).prop("checked", false);
      });
    }
  });

  $("[data-toggle=tooltip]").tooltip();
});

function loadEditData(event) {
  const row = event.parentElement.parentElement.parentElement.children;
  const id = row[1].innerText,
    fname = row[2].innerText,
    lname = row[3].innerText,
    address = row[4].innerText,
    email = row[5].innerText,
    contact = row[6].innerText,
    type = row[7].innerText,
    shopNumber = row[8].innerText;

  $("#currentIdSelection").val(id);

  $("#inputName").val(fname);
  $("#inputLastName").val(lname);
  $("#inputAddress").val(address);
  $("#inputemail").val(email);
  $("#inputContact").val(contact);
  $("#inputShopNumber").val(shopNumber);
  ["admin", "employee", "user"].map(userProfile => {
    if (type == userProfile) {
      $(".selectpicker").append(
        `<option selected='selected' value=${userProfile}>${userProfile}</option>`
      );
    } else {
      $(".selectpicker").append(
        `<option  value=${userProfile}>${userProfile}</option>`
      );
    }
  });
}
function loadDeleteData(event) {
    const row = event.parentElement.parentElement.parentElement.children;
    const id = row[1].innerText;
    
    $("#currentIdSelection").val(id);  
  
  }
function deleteRow(event) {
    
    
    const id = $("#currentIdSelection").val();
  
    const url = 'http://localhost:8080/deleteUser';
  
    let data = {
      id
    }
   
    let fetchData = { 
        method: 'DELETE', 
        credentials: 'same-origin',
        body: JSON.stringify(data),
        headers: new Headers({
          'Content-Type': 'application/json'
        })
    }
   

    fetch(url, fetchData)
    .then(function() {
        location.reload();
    });
  }

function updateRow() {
    
  const id = $("#currentIdSelection").val();
  const fname = $("#inputName").val();
  const lname = $("#inputLastName").val();
  const address = $("#inputAddress").val();
  const email = $("#inputemail").val();
  const contact = $("#inputContact").val();
  const shopNumber = $("#inputShopNumber").val();
  const type = $(".selectpicker").val();

  const url = 'http://localhost:8080/updateUser';

  let data = {
    id,fname,lname,address,email,contact,type,shopNumber
  }
 
  let fetchData = { 
      method: 'PUT', 
      credentials: 'same-origin',
      body: JSON.stringify(data),
      headers: new Headers({
        'Content-Type': 'application/json'
      })
  }
  fetch(url, fetchData)
  .then(function() {
    location.reload();
  });
}
function addUser(){
  
  const fname = $("#AddName").val();
  const lname = $("#AddLastName").val();
  const address = $("#AddAddress").val();
  const email = $("#Addemail").val();
  const contact = $("#AddContact").val();
  const shopNumber = $("#AddShopNumber").val();
  const type = $(".addDDR").val();
  const username = $("#AddUsername").val();
  const password = $("#AddPassword").val();

  const url = 'http://localhost:8080/addUser';

  let data = {
    fname,lname,address,email,contact,type,shopNumber,username,password
  }
 
  let fetchData = { 
      method: 'POST', 
      credentials: 'same-origin',
      body: JSON.stringify(data),
      headers: new Headers({
        'Content-Type': 'application/json'
      })
  }
  fetch(url, fetchData)
  .then(function() {
    location.reload();
  });

}
