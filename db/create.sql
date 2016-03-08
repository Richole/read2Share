DROP DATABASE IF EXISTS `readToShare`;
CREATE DATABASE `readToShare` CHARACTER SET utf8;
USE `readToShare`;

CREATE TABLE `user` (
  `uid`            INT(11)      NOT NULL  AUTO_INCREMENT,                                         #用户ID
  `name`           VARCHAR(20)  NOT NULL,                                                         #用户姓名       
  `phone`          VARCHAR(11)  NOT NULL,                                                         #用户手机号码
  `email`          VARCHAR(30)  NOT NULL,                                                         #用户邮箱
  `password`       VARCHAR(20)  NOT NULL,                                                         #用户密码
  `open_id`        VARCHAR(70)  NULL,                                                             #用户微信绑定账号
  `created_at`     VARCHAR(30)  NOT NULL,                                                         #用户创建时间
  `email_verify`   BOOLEAN      NULL      DEFAULT FALSE,                                          #邮箱验证
  `last_login_at`  TIMESTAMP    NULL      DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,  #用户最后登陆时间
  `last_login_ip`  VARCHAR(15)  NULL,                                                             #用户最后登陆ip
  PRIMARY KEY (`uid`),
  UNIQUE KEY `uid_UNIQUE` (`uid`),
  UNIQUE KEY `phone_UNIQUE` (`phone`),
  UNIQUE KEY `email_UNIQUE` (`email`)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;