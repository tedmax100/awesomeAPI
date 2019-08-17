CREATE TABLE awesome.`user` (
	user_id BIGINT NOT NULL AUTO_INCREMENT,
	username VARCHAR(20) NOT NULL,
	password varchar(20) NOT NULL,
	name varchar(20) NOT NULL,
	email varchar(40) NOT NULL,
	mobile varchar(20) NULL,
	CONSTRAINT user_PK PRIMARY KEY (user_id)
)
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_la_0900_ai_ci;
CREATE UNIQUE INDEX user_username_IDX USING BTREE ON awesome.`user` (username);
CREATE UNIQUE INDEX user_mobile_IDX USING BTREE ON awesome.`user` (mobile);


CREATE TABLE awesome.login (
	id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
	token varchar(100) NOT NULL,
	`time` BIGINT UNSIGNED NOT NULL,
	user_id BIGINT UNSIGNED NOT NULL,
	CONSTRAINT login_PK PRIMARY KEY (id)
)
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci;
CREATE INDEX login_user_id_IDX USING BTREE ON awesome.login (user_id);




CREATE TABLE awesome.message (
	message_id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
	`text` TEXT NOT NULL,
	`time` BIGINT UNSIGNED NOT NULL,
	user_id BIGINT UNSIGNED NOT NULL,
	CONSTRAINT message_PK PRIMARY KEY (message_id)
)
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci;


CREATE TABLE awesome.reply (
	reply_id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
	user_id BIGINT UNSIGNED NOT NULL,
	message_id BIGINT UNSIGNED NOT NULL,
	reply TEXT NOT NULL,
	`time` BIGINT UNSIGNED NOT NULL,
	CONSTRAINT reply_PK PRIMARY KEY (reply_id)
)
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci;
CREATE INDEX reply_message_id_IDX USING BTREE ON awesome.reply (message_id);
CREATE INDEX reply_user_id_IDX USING BTREE ON awesome.reply (user_id);
