/* INIT DATABASES */

DROP DATABASE chat;
CREATE DATABASE chat;

USE chat;

CREATE TABLE USERS (
	id VARCHAR(512) NOT NULL,
	username VARCHAR(32) NOT NULL,
	password VARCHAR(512) NOT NULL,
	rankId INT NOT NULL,
	PRIMARY KEY(id)
) ENGINE=InnoDB;

CREATE TABLE RANKS (
	id INT NOT NULL,
	name VARCHAR(16)
) ENGINE=InnoDB;

CREATE TABLE CHATS (
	id VARCHAR(512) NOT NULL,
	name VARCHAR(32) NOT NULL,
	userId VARCHAR(512) NOT NULL,
	PRIMARY KEY(id),
	FOREIGN KEY(userId) REFERENCES USERS(id)
) ENGINE=InnoDB;

CREATE TABLE MESSAGES (
	id VARCHAR(512) NOT NULL,
	text VARCHAR(1000) NOT NULL,
	chatId VARCHAR(512) NOT NULL,
	userId VARCHAR(512) NOT NULL,
	date DATETIME NOT NULL,
	PRIMARY KEY(id),
	FOREIGN KEY(userId) REFERENCES USERS(id)
) ENGINE=InnoDB;


/* INIT RANKS */

INSERT INTO RANKS VALUES (
	1,
	"USER"
);

INSERT INTO RANKS VALUES (
	2,
	"MODERATOR"
);

INSERT INTO RANKS VALUES (
	3,
	"ADMINISTRATOR"
);
