const URL_AUTH = "https://localhost:3001/auth/user/"
const URL_USER = "https://localhost:3001/user/"

var botaoCadastrar = document.getElementById("botaoLogin")
botaoCadastrar.addEventListener("click",()=>{
    var email = document.getElementById("campoEmail").value
    var senha = document.getElementById("campoSenha").value

    enviaPOST( email, senha )
})

function enviaPOST( email, password ){
    var header = {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
            email, password
        })
    }
    var status = 0
    fetch(URL_AUTH,header)
    .then(function(response){
        status = response.status
        return response.json()
    }).then( function(data){
        if (status == 422) {
            if( data != undefined ){
                alert("errado")
            }
        }else if(status == 200 ) {
            localStorage.setItem('token', data.token)
            localStorage.setItem('id', data.id)
            window.location.href = "audiobooksContos.html"
        }
    })
    .catch(function(error){
        console.log(error)
    })
}
enviaGET(localStorage.getItem('id'))

function enviaGET( id ){
    var header = {
        method:"GET",
        headers:{
            "Content-Type":"application/json",
            "token":localStorage.getItem('token')
        }
    }
    var status = 0
    fetch(URL_USER+id,header)
        .then(function(response) {
            status = response.status
            return response.json()
    }).then(function(data){
        if (status == 400  || status === 401 || status === 404) {
           var alterar = document.getElementById("alterar")
           alterar.style.display = "none";
        }else if(status == 200 ) {
          
        }
    }).catch(function(err) {
        console.log(err);
    });
}