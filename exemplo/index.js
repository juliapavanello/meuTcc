
const express = require('express')
const multer = require('multer');
const mysql = require('mysql2');

const parser = multer({ dest: 'public/uploads/' })
const app = express()
app.use(express.json())
app.use(express.static('public'));

const db = mysql.createConnection({
    host: 'localhost',
    user: 'usuarioExemplo',
    password: 'Abcd&123',
    database: 'exemplo',
  });

  db.connect((err) => {
    if (err) {
      console.error('Erro ao conectar ao banco de dados:', err);
    } else {
      console.log('Conexão com o banco de dados MySQL estabelecida.');
    }
  });


const PORTA = 3001
app.listen( PORTA, function(){
    console.log("Servidor iniciados na porta "+PORTA);
})


app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });


  app.post('/avatar', async (req, res) => {
    parser.single('avatar')(req, res, async (err) => {
      if (err) {
        res.status(500).json({ error: 1, payload: err });
      } else {
        const image = {};
        image.url = `/uploads/${req.file.filename}`;
        // Verifique se image.url não é nulo antes de salvar no banco de dados
        if (image.url) {
          try {
            const result = await db.promise().query('INSERT INTO imagens (url) VALUES (?)', [
              image.url,
            ]);
            const insertedId = result[0].insertId; // Obtenha o ID gerado automaticamente
            res.status(200).json({ error: 0, payload: { id: insertedId, url: image.url } });
          } catch (error) {
            console.error('Erro ao salvar a imagem no banco de dados:', error);
            res.status(500).json({ error: 1, payload: 'Erro ao salvar a imagem no banco de dados' });
          }
        } else {
          res.status(500).json({ error: 1, payload: 'A URL da imagem é nula' });
        }
      }
    });
  });
  

