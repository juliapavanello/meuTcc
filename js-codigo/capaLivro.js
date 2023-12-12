var form = document.getElementById("formulario");

function submitForm(event) {
  event.preventDefault();
  let formData = new FormData();
  formData.append('avatar', event.target[0].files[0]);

  // Extrair o ID do livro da URL
  const urlParams = new URLSearchParams(window.location.search);
  const idLivro = urlParams.get('id');

  // Verificar se o ID do livro foi encontrado na URL
  if (idLivro !== null) {
    // Adicionar o ID do livro aos dados do formulário
    formData.append('idLivro', idLivro);

    fetch('http://localhost:3000/avatar', { method: 'post', body: formData })
      .then(res => res.json())
      .then(res => {
        // avatar.src = `http://localhost:3001${res.payload.url}`;
        // console.log(res.payload)
        window.location.href = `audiobooksContos.html?image_url=http://localhost:3000${res.payload.url}`;
      })
      .catch(console.log);
  } else {
    console.error('ID do livro não encontrado na URL');
    // Lide com a situação em que o ID do livro não foi encontrado na URL
  }
}

form.addEventListener('submit', submitForm);
