const URL_USER = "https://localhost:3001/auth/user/"
var idUsuario = localStorage.getItem("id")
lerParametros();

function lerParametros(){
    var name = localStorage.getItem("nome")
    var email = localStorage.getItem("email")

        document.getElementById("nome").value = name
    
        document.getElementById("email").value = email
}

var botaoAdicionar = document.getElementById("alterar");
botaoAdicionar.addEventListener("click", function(){
    var nome = document.getElementById("nome").value;
    var email = document.getElementById("email").value;
    var token = localStorage.getItem("token");  // Obtém o token armazenado localmente

    enviaPUT(idUsuario, nome, email, token);
});

function enviaPUT(idUsuario, nome, email, token){
    var header = {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "token": token  // Adiciona o token ao cabeçalho
        },
        body: JSON.stringify({
            nome: nome,
            email: email
        })
    };
    fetch(URL_USER + idUsuario, header)
    .then(function(response){
        return response.json();
    }).then(function(data){
        window.location.href = 'audiobooksContos.html';
    }).catch(function(){
        alert("Erro");
    });
}