create database TCCCERTO;
drop database tcccerto;
use TCCCERTO;

create table livros(
	id int auto_increment primary key,
    nome varchar(30),
	link varchar(200),
	sinopse varchar(200)
);
create table imagens(
	id int primary key auto_increment,
    url varchar(255) not null,
    idLivro int,
    foreign key (idLivro) REFERENCES livros (id)
);
drop table imagens;
drop table livros;
drop user'juliacristina';
create user 'juliacristina'@'%' identified with mysql_native_password by 'Abcd&123';
grant all on TCCCERTO.* to 'juliacristina'@'%';

insert into livros values(3,"dom casmurro","https://drive.google.com/file/d/1pt1tFSYgB1Ny_SXg1kKaJRfnBGsRtvhS/view","Quincas Borba");
select * from livros;
truncate usuarios;
select * from usuarios;