const sequelize = require("sequelize");
const banco = require("./banco")
const imagens = require("./imagens");
const livros = require("./livros")
var Usuario = banco.conexao.define(
    "usuario",
    {
        id:{
            type:sequelize.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement:true
        },
        nome:{
            type:sequelize.STRING,
            allowNull:false
        },
        email:{
            type:sequelize.STRING,
            allowNull:false
        },
        hash:{
            type:sequelize.STRING,
            allowNull:false
        }
    }
)
Usuario.hasMany(imagens.imagens)
Usuario.hasMany(livros.livros)
module.exports = {Usuario: Usuario}