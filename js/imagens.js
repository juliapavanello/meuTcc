const sequelize = require("sequelize");
const banco = require("./banco")

var imagens = banco.conexao.define(
    "imagens",
    {
        id:{
            type:sequelize.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement:true
        },
        url:{
            type:sequelize.STRING,
            allowNull:false
        }
    },
    {
        timestamps:false
    }
)

module.exports = {imagens: imagens}