const sequelize = require("sequelize");
const banco = require("./banco")
const imagens = require("./imagens")

var livros = banco.conexao.define(
    "livros",
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
        link:{
            type:sequelize.STRING,
            allowNull:false
        },
        sinopse:{
            type:sequelize.STRING,
            allowNull:false
        }
    }
)
livros.hasMany(imagens.imagens)
module.exports = {livros: livros}