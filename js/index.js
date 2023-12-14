const express = require('express');
const express2 = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const multer = require('multer');
const parser = multer({ dest: 'public/uploads/' });
const app = express();
const app2 = express2();
app.use(express.static('public'));
require('dotenv').config()
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
var cookieParser = require('cookie-parser')
const https = require('https')
const fs = require(`fs`);
const banco = require("./banco")

const Usuario = require("./Usuario")
const livros = require("./livros")
const imagens = require("./imagens");
const { Console, error } = require('console');

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', '*');
  next();
});
app2.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', '*');
  next();
});
async function encontrarUsuarioPorEmail(email) {
  const resultado = await Usuario.Usuario.findAll({
    where: { email: email }
  })
  if (resultado.length == 0) return null
  return resultado[0]
}
async function encontrarUsuarioPorId(id) {
  const resultado = await Usuario.Usuario.findByPk(id)
  return resultado
}

const jsonParser = bodyParser.json();
// const db = mysql.createConnection({
//   host: 'localhost',
//   user: 'juliacristina',
//   password: 'Abcd&123',
//   database: 'TCCCERTO',
// });
app.listen(3000)
app.use(express.json())
const portaServidor = 3001
app2.use(express2.json())
app2.use(cookieParser())
banco.conexao.sync(function () {
  console.log("Banco de dados conectado.");
})

// const corsOptions = {
//   origin: ['http://127.0.0.1:5500'],
//   methods: 'GET,POST'
// };

// app2.use(cors(corsOptions));

// app.listen(portaServidor,()=>{
//   console.log("Servidor rodando na porta "+portaServidor);
// })

var options = {
  key: fs.readFileSync("key.pem"),
  cert: fs.readFileSync("cert.pem"),
}

https.createServer(options, app2).listen(portaServidor, () => {
  console.log("Servidor conectado na porta " + portaServidor);
});

app2.get("/", (req, res) => {
  res.status(200).json({ msg: "Sucesso" })
})



// Registrar Usuário
app2.post('/auth/register/', async (req, res) => {
  const name = req.body.name
  const email = req.body.email
  const password = req.body.password
  const confirmPassword = req.body.confirmPassword
  if (!name) {
    return res.status(422).send({ msg: "O nome é obrigatório" })
  }
  if (!email) {
    return res.status(422).send({ msg: "O email é obrigatório" })
  }
  if (!password) {
    return res.status(422).send({ msg: "A senha é obrigatória" })
  }
  if (password != confirmPassword) {
    return res.status(422).send({ msg: "As senhas não conferem" })
  }
  const usuario = await encontrarUsuarioPorEmail(email)
  if (usuario != null) {
    return res.status(422).send({ msg: "Email já utilizado" })
  }
  const salt = await bcryptjs.genSalt(12)
  const passwordHash = await bcryptjs.hash(password, salt)

  const resultado = await Usuario.Usuario.create({
    "nome": name,
    "email": email,
    "hash": passwordHash
  })
  res.status(201).send({ msg: "Usuário criado com sucesso" })
})

app2.post("/auth/user/", async (req, res) => {
  const email = req.body.email
  const password = req.body.password
  if (!email) {
    return res.status(422).send({ msg: "O email é obrigatório" })
  }
  if (!password) {
    return res.status(422).send({ msg: "A senha é obrigatória" })
  }

  const usuario = await encontrarUsuarioPorEmail(email)
  if (usuario == null) {
    return res.status(422).send({ msg: "Usuário não encontrado" })
  }
  const checkPassword = await bcryptjs.compare(password, usuario.hash)
  if (!checkPassword) {
    return res.status(422).send({ msg: "Senha Inválida" })
  }

  try {
    const secret = process.env.SECRET

    const token = jwt.sign({
      id: usuario.id
    }, secret, { expiresIn: "24h" })

    //res.cookie('auth',token);
    res.status(200).json({ msg: "Autenticação realizada com sucesso!", id: usuario.id, token })
  } catch (error) {
    console.log(error);
    return res.status(500).send({ msg: "Erro no servidor. Tente novamente mais tarde!" })
  }
})

// Adicionar o checkToken em todos as URLS que você quer proteger.
app2.get("/user/:id", checkToken, async (req, res) => {
  const id = req.params.id
  const usuario = await encontrarUsuarioPorId(id)
  if (usuario == null) {
    return res.status(404).send({ msg: "Usuário não encontrado" })
  }

  // Adicionar depois para mostrar que só esta logado.
  var infoToken = jwt.verify(req.headers.token, process.env.SECRET);
  if (usuario.id != infoToken.id) {
    return res.status(401).send({ msg: "Acesso Negado!" })
  }

  res.status(200).send({ id: usuario.id, nome: usuario.nome, email: usuario.email })
})

function checkToken(req, res, next) {
  const token = req.headers.token
  if (token) {

    jwt.verify(token, process.env.SECRET, function (err, token_data) {
      if (err) {
        return res.status(400).send({ msg: "Token inválido" })
      } else {
        next();
      }
    });

  } else {
    return res.status(401).send({ msg: "Acesso Negado!" })
  }
}


app2.put("/auth/user/:id", checkToken, jsonParser, async (req, res) => {
  const id = req.params.id;
  const nome = req.body.nome;
  const email = req.body.email;

  // Validar os dados recebidos
  if (!nome) {
    return res.status(422).send({ msg: "O nome é obrigatório" });
  }

  if (!email) {
    return res.status(422).send({ msg: "O e-mail é obrigatório" });
  }

  // Verificar se o usuário existe
  const usuario = await encontrarUsuarioPorId(id);
  if (!usuario) {
    return res.status(404).send({ msg: "Usuário não encontrado" });
  }

  // Atualizar os dados do usuário
  usuario.nome = nome;
  usuario.email = email;

  // Atualizar a senha se uma nova senha foi fornecid

  // Salvar as alterações no banco de dados
  try {
    await usuario.save();
    const usuarioAtualizado = {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
    };
    res.status(200).send(usuarioAtualizado);
  } catch (error) {
    console.error(error);
    res.status(500).send({ msg: "Erro ao atualizar o usuário" });
  }
});

//AREA IMAGEM
// app.post('/avatar', async (req, res) => {
//   parser.single('avatar')(req, res, async (err) => {
//     if (err) {
//       res.status(500).json({ error: 1, payload: err });
//     } else {
//       const image = {};
//       image.url = `/uploads/${req.file.filename}`;
//       const idLivro = req.body.idLivro; // Assumindo que você está passando o idLivro no formulário

//       // Verifique se já existe uma imagem associada ao livro
//       const existingImageQuery = 'SELECT * FROM imagens WHERE idLivro = ?';
//       const [existingImageRows] = await db.promise().query(existingImageQuery, [idLivro]);

//       if (existingImageRows.length > 0) {
//         // Já existe uma imagem, então atualize-a
//         const updateImageQuery = 'UPDATE imagens SET url = ? WHERE idLivro = ?';
//         try {
//           await db.promise().query(updateImageQuery, [image.url, idLivro]);
//           res.status(200).json({ error: 0, payload: { id: existingImageRows[0].id, url: image.url } });
//         } catch (error) {
//           console.error('Erro ao atualizar a imagem no banco de dados:', error);
//           res.status(500).json({ error: 1, payload: 'Erro ao atualizar a imagem no banco de dados' });
//         }
//       } else {
//         // Nenhuma imagem existe, então insira a nova imagem
//         try {
//           const result = await db.promise().query('INSERT INTO imagens (url, idLivro) VALUES (?, ?)', [
//             image.url,
//             idLivro,
//           ]);
//           const insertedId = result[0].insertId; // Obtenha o ID gerado automaticamente
//           res.status(200).json({ error: 0, payload: { id: insertedId, url: image.url } });
//         } catch (error) {
//           console.error('Erro ao salvar a imagem no banco de dados:', error);
//           res.status(500).json({ error: 1, payload: 'Erro ao salvar a imagem no banco de dados' });
//         }
//       }
//     }
//   });
// });
app.post('/avatar', async (req, res) => {
  parser.single('avatar')(req, res, async (err) => {
    if (err) {
      console.log({error: 2, payload: err});
      res.status(500).json({ error: 1, payload: err });
    } else {
      const image = {};
      image.url = `/uploads/${req.file.filename}`;
      console.log(req.file.filename);
      const idLivro = req.body.idLivro;

      try {
        console.log('Checking existing image...');
        const existingImage = await imagens.findOne({ where: { idLivro } });
        console.log('Existing image:', existingImage);

        if (existingImage) {
          // Update the existing image
          await existingImage.update({ url: image.url });
          res.status(200).json({ error: 0, payload: { id: existingImage.id, url: image.url } });
        } else {
          // Insert a new image
          const newImage = await imagens.create({ url: image.url, idLivro });
          res.status(200).json({ error: 0, payload: { id: newImage.id, url: image.url } });
        }
      } catch (error) {
        console.error('Error interacting with the database:', error);
        res.status(500).json({ error: 1, payload: 'Error interacting with the database' });
      }
    }
  });
});

app.get("/imagens/:livroId", async function (req, res) {
  try {
    const resultado = await imagens.imagens.findAll({
      where: { livroId: req.params.livroId }
    });

    if (resultado === null) {
      res.status(404).send({});
    } else {
      const imageUrl = resultado.url
      res.json(imageUrl);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Erro interno do servidor" });
  }
});

//FIM AREA IMAGEM
app.get("/livros/", async function (req, res) {
  const resultado = await livros.livros.findAll()
  res.json(resultado);
})

app.get("/livros/:id", async function (req, res) {
  const resultado = await livros.livros.findByPk(req.params.id)
  if (resultado == null) {
    res.status(404).send({})
  }
  res.json(resultado);
})

app.get("/livros/nome/:nome", async function (req, res) {
  const resultado = await livros.livros.findAll({
    where: { nome: req.params.nome }
  })
  if (resultado == null) {
    res.status(404).send({})
  }
  res.json(resultado);
})

app.post("/livros/", async function (req, res) {
  const resultado = await livros.livros.create({
    nome: req.body.nome,
    link: req.body.link,
    sinopse: req.body.sinopse,
    usuarioId: req.body.usuarioId
  })
  res.json(resultado)
})

app.put("/livros/:id", async function (req, res) {
  const resultado = await livros.livros.update({
    nome: req.body.nome,
    link: req.body.link,
    sinopse: req.body.sinopse,
    usuarioId: req.body.usuarioId
  }, {
    where: { id: req.params.id }
  })
  if (resultado == 0) {
    res.status(404).send({})
  } else {
    res.json(await livros.livros.findByPk(req.params.id))
  }
})

app.delete('/livros/:id', async (req, res) => {
  const livroId = req.params.id;

  try {
    // Inicie uma transação Sequelize
    await sequelize.transaction(async (t) => {
      // Exclua as imagens associadas a este livro
      await imagens.destroy({
        where: {
          livroId: livroId
        },
        transaction: t
      });

      // Em seguida, exclua o livro
      const livroExcluido = await livros.destroy({
        where: {
          id: livroId
        },
        transaction: t
      });

      if (livroExcluido === 0) {
        // Se nenhum livro foi excluído, significa que o livro não foi encontrado
        return res.status(404).json({ error: 'Livro não encontrado' });
      }

      res.json({ message: 'Livro e imagens associadas excluídas com sucesso' });
    });
  } catch (error) {
    console.error('Erro ao excluir livro e imagens:', error);
    res.status(500).json({ error: 'Erro ao excluir livro e imagens' });
  }
});