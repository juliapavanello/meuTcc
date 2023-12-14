const URL = "http://localhost:3000/livros/"
const URL2 = "http://localhost:3000/imagens/"



const URL_USER = "https://localhost:3001/user/"

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
            var dadosUsuarios = document.getElementById("bah")
            var esconder = document.getElementById("botaoAdicionar")
            dadosUsuarios.innerHTML = 'Somente pessoas autorizadas podem alterar'
            dadosUsuarios.style.color = "red"
            esconder.style.display = "none";
            var lapis = document.gete("lapis")
            var lixeira = document.getElementById("lixeira")
            lapis.style.display = "none";
            lixeira.style.display = "none";
        }else if(status == 200 ) {
          var dadosUsuarios = document.getElementById("bah")
          var emailUsu = document.getElementById("bah2")
          emailUsu.innerHTML = "Email: " + data.email;
          dadosUsuarios.innerHTML = "Bem vinda, " + data.nome;
          localStorage.setItem('nome', data.nome)
          localStorage.setItem('email', data.email)
        }
    }).catch(function(err) {
        console.log(err);
    });
}
function criarlinhaLivro(livro) {
  // Adicione um elemento <img> com uma classe para exibir a imagem
  const imagemElement = `<img class="livro-imagem"  width="140" height="200" data-id="${livro.id}" src="" alt="Capa do Livro">`;

  // Adicione um elemento <td> para a imagem
  const imagemTd = `<td class="fontemaior item"><a class="link-color" href="capaLivro.html?id=${livro.id}">${imagemElement}</a></td>`;
  fetch(`${URL2}${livro.id}`)
    .then(response => response.text())
    .then(imageUrl => {
      const imagem = document.querySelector(`.livro-imagem[data-id="${livro.id}"]`);
      console.log(">>>>>>>>>>>>>>");
      console.log("bah"+imageUrl);
      if (imageUrl) {
        imagem.src = "js/public/uploads/" + imageUrl;
        console.log(imagem)
      } else {
        // Defina uma URL padrão ou imagem de fallback, se necessário
        imagem.src = "js/public/uploads/transferir.png";
      }
    });
  const lapisTd = `<td class="fontemaior lapis auto-width " data-id="${livro.id}"><img class="item" id="lapis" src="imagens2/imagem4.png" alt="icone lixeira"></td>`;
  // Adicione um elemento <td> para a lixeira (excluir)
  const lixeiraTd = `<td class="fontemaior lixeira auto-width " data-id="${livro.id}"><img class="item" id="lixeira" src="imagens2/imagem.png" alt="icone lixeira"></td>`;

  return `<tr id="linhaLivro" class="linha centrar-itens">
    ${imagemTd}
    <td class="fontemaior item auto-width ">${livro.nome}</td>
    <td class="fontemaior item auto-width "><a class="link-color" target="_blank" href="${livro.link}">Disponível Aqui</a></td>
    <td class="sinopse">
      <div class="accordion accordion-flush" id="accordionFlushExample">
        <div class="accordion-item">
          <h2 class="accordion-header">
            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapse${livro.id}" aria-expanded="false" aria-controls="flush-collapseOne">
              Sinopse
            </button>
          </h2>
          <div class="tamanho">
          <div id="flush-collapse${livro.id}" class="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
            <div class="accordion-body"><p class="custom-font-size">${livro.sinopse}</p></div>
          </div>
          </div>
        </div>
      </div>
    </td>
    ${localStorage.getItem('token') ? lapisTd : ''}
    ${localStorage.getItem('token') ? lixeiraTd : ''}
    
  </tr>`;

}

function adicionarLivros(livros){
   const tabelaLivros = document.getElementById("tabelaLivros")
  //  tabelaLivros.innerHTML = iniciartabela()
   for(let i = 0;i < livros.length; i++){
      const l = livros[i]
      tabelaLivros.innerHTML += criarlinhaLivro(l)
   }
   cadastrarLixeiras()
   cadastrarLapis()
}
var listaLivros = []
 fetch(URL).then(function(response){
    return response.json()
 }).then(function(data){
    listaLivros = data
    adicionarLivros(data)
 }).catch(function(){
    console.log("Deu ruim!!")
 })

 var botaoMover = document.getElementById("botaoAdicionar")
   botaoMover.addEventListener("click", function(){
   window.location.href="adicionar.html"
 })

 function cadastrarLixeiras (){
   var lixeiras = document.getElementsByClassName("lixeira")   
   for (let i = 0; i < lixeiras.length; i++) {
       const l = lixeiras[i];
       l.addEventListener("click", function(event){
         var id = this.dataset.id;
         console.log(id);
           realizarExclusao(id)
       })
   }
}
function atualizarTela(id){
   listaLivros = listaLivros.filter( p => p.id != id)
   var tabelaLivros = document.getElementById("tabelaLivros")
   tabelaLivros.innerHTML = ""
   adicionarLivros(listaLivros)
}

 function realizarExclusao(id){
   var header = {
      method: "DELETE"
   }
   fetch(URL+id,header)
   .then(function(response){
      return response.text()
   }).then(function(data){
      console.log("Excluiu")
      atualizarTela(id)
   }).catch(function(error){
      alert("Erro ao deletar livro")
   })
 }


 //listar livros
 
 function listarLivrosPeloNome(nome) {
   fetch(URL+"nome/"+nome)
     .then(function (response) {
       return response.json();
     })
     .then(function (data) {
       listaLivros = data;
       adicionarLivros(listaLivros);
     })
     .catch(function () {
       console.log("Houve algum problema!");
     });
 }

 
 function editarURL(url,id,nome,link,sinopse){
   return url+"?id="+id+"&nome="+nome+"&link="+link+"&sinopse="+sinopse
 }

 function cadastrarLapis(){
   var lapis = document.getElementsByClassName("lapis")
   for (let i = 0; i < lapis.length; i++) {
      const l= lapis[i];
      l.addEventListener("click",function(event){
         var id = this.dataset.id
         var link = event.target.parentElement.parentElement.children[2].children[0].getAttribute("href");
         var nome = event.target.parentElement.parentElement.children[1].innerText;
         var sinopse = event.target.parentElement.parentElement.querySelector(".accordion-body p").innerText;

        window.location.href = editarURL("adicionar.html",id,nome,link,sinopse)     
      })    
   }
 }

 
