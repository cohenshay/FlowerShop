async function addFlower() {
  const fname = $("#AddName").val();
  const lname = $("#AddLastName").val();
  
  const avatar = document.getElementById('file').files[0];
  

  const url = "http://localhost:8080/addFlower";

  let data = {
    fname,
    lname,
    avatar
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
  }


}

$("#addFlowerForm").submit(function(e){
    e.preventDefault();
});
function add(){
    var output = document.getElementById('output');
    document.getElementById('upload').onclick = function () {
      var data = new FormData();
      data.append('foo', 'bar');
      data.append('file', document.getElementById('file').files[0]);
      var config = {
        onUploadProgress: function(progressEvent) {
          var percentCompleted = Math.round( (progressEvent.loaded * 100) / progressEvent.total );
        }
      };
      axios.put('/upload/server', data, config)
        .then(function (res) {
          output.className = 'container';
          output.innerHTML = res.data;
        })
        .catch(function (err) {
          output.className = 'container text-danger';
          output.innerHTML = err.message;
        });
    };
}