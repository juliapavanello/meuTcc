const URL_AUTH = "https://localhost:3001/auth/register/"

var botaoCadastrar = document.getElementById("botaoCadastrar")
botaoCadastrar.addEventListener("click",()=>{
    var name = document.getElementById("campoNome").value
    var email = document.getElementById("campoEmail").value
    var senha = document.getElementById("campoSenha").value
    var confirmarSenha = document.getElementById("confirmarSenha").value

    enviaPOST( name, email, senha, confirmarSenha )
})

function enviaPOST( name, email, password, confirmPassword ){
    var header = {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
            name, email, password, confirmPassword
        })
    }
    var status = 0
    fetch(URL_AUTH,header)
    .then(function(response){
        status = response.status
        if (!response.ok && response.status === 422) {
            return response.json();            
        }else if(response.ok && response.status == 201 ) {
            window.location.href = "login.html"
        }
    }).then(function(data){
        
    }).catch(function(error){
        console.log(error)
    })
}