create database exemplo;
use exemplo;

create table imagens(
	id varchar(255) primary key auto_increment,
    url varchar(255) not null
);
drop table imagens;
create user 'usuarioExemplo'@'%' identified with mysql_native_password by 'Abcd&123';
grant all on exemplo.* to 'usuarioExemplo'@'%';

select * from imagens;