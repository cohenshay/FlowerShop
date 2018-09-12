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
      name = row[2].innerText,
      location = row[3].innerText;
  
    $("#currentIdSelection").val(id);
  
    $("#inputName").val(name);
    $("#inputLocation").val(location);
   
  }
  function loadDeleteData(event) {
      const row = event.parentElement.parentElement.parentElement.children;
      const id = row[1].innerText;
      
      $("#currentIdSelection").val(id);  
    
    }
  function deleteRow(event) {
      
      
      const id = $("#currentIdSelection").val();
    
      const url = 'http://localhost:8080/deleteShop';
    
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
    const lname = $("#inputLocation").val();
   
  
    const url = 'http://localhost:8080/updateShop';
  
    let data = {
      id,fname,lname,address,email,contact,type
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
  