

var favorite = document.getElementsByClassName("button-favorites");
var adopt = document.getElementsByClassName("button-adopt");
var trash = document.getElementsByClassName("fa-trash");

Array.from(favorite).forEach(function(element) {
      element.addEventListener('click', function(){
        const description=this.parentNode.parentNode.childNodes[3].innerText
        const name =this.parentNode.parentNode.childNodes[1].innerText
        fetch('adopt', {
          method: 'post',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({           
            description,
            name,
          })
        })
        .then(response => {
          if (response.ok) return response.json()
        })
        .then(data => {
          console.log(data)
          window.location.reload(true)
        })
      });
});

Array.from(adopt).forEach(function(element) {
  element.addEventListener('click', function(){
    const _id= this.parentNode.getAttribute('id')
    console.log(_id)
    fetch('adopt', {
      method: 'put',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        '_id': _id
      })
    })
    .then(response => {
      if (response.ok) return response.json()
    })
    .then(data => {
      console.log(data)
      window.location.reload(true)
    })
  });
});

Array.from(trash).forEach(function(element) {
      element.addEventListener('click', function(){
        const _id= this.parentNode.getAttribute('id')
        console.log(_id)    
        fetch('delete', {
          method: 'delete',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
          _id,
          })
        }).then(function (response) {
          window.location.reload()
        })
      });
});
