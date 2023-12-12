const URL = "http://localhost:3000/livros/"

var idLivro = null
lerParametros()
function lerParametros(){
    const urlParams = new URLSearchParams(window.location.search)
    idLivro = urlParams.get("id")
    var nomeLivro = urlParams.get("nome")
    var linkLivro = urlParams.get("link")
    var sinopseLivro = urlParams.get("sinopse")
    document.getElementById("campoNome").value = nomeLivro
    document.getElementById("campoLink").value = linkLivro
    document.getElementById("campoSinopse").value = sinopseLivro
}

function validarValores(nome,link, sinopse){
    if(nome.length < 3){
        return false
    }
    if(link.length < 3) {
        return false;
    }
    if(sinopse.length < 3){
        return false;
    }
    return true;
}

function mostrarErro(mensagemErro){
    var erro = document.getElementById("erro")
    erro.innerText = mensagemErro
}

var botaoAdicionar = document.getElementById("botaoAdicionar")
botaoAdicionar.addEventListener("click",function(){
    var nomeLivro = document.getElementById("campoNome").value
    var linkLivro = document.getElementById("campoLink").value
    var sinopseLivro = document.getElementById("campoSinopse").value

    if(! validarValores(nomeLivro, linkLivro, sinopseLivro)){
        mostrarErro("Erro nos dados digitados")
        return;
    }
    if(idLivro == null){
        console.log("POST")
        enviaPOST(nomeLivro, linkLivro, sinopseLivro)
    }else{
        console.log("PUT")
        enviarPUT(idLivro, nomeLivro, linkLivro, sinopseLivro)
    }
})


function enviaPOST(nomeLivro, linkLivro, sinopseLivro){
     var header={
        method: "POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
            nome:nomeLivro,
            link:linkLivro,
            sinopse:sinopseLivro
        })
    }
    fetch(URL,header).then(function(response){
        return response.json()
    }).then(function(data){
        window.location.href= "audiobooksContos.html"
    }).catch(function(){
        var mensagemErro = document.getElementById("erro")
        mensagemErro.style.display = "visible"
    })
}

function enviarPUT(id, nomeLivro, linkLivro, sinopseLivro){
    var header = {
       method: "PUT",
       headers:{"Content-Type":"application/json"},
       body:JSON.stringify({
          nome:nomeLivro,
          link:linkLivro,
          sinopse:sinopseLivro
       })
    }
    fetch(URL+id,header)
    .then(function(response){
       return response.json()
    }).then(function(data){
       window.location.href = "audiobooksContos.html"
    }).catch(function(){
        var mensagemErro = document.getElementById("erro")
        mensagemErro.style.display = "visible"
    })
  }
