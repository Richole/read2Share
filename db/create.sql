DROP DATABASE IF EXISTS `readToShare`;
CREATE DATABASE `readToShare` CHARACTER SET utf8;
USE `readToShare`;

CREATE TABLE `user` (
  `uid`            INT(11)       NOT NULL  AUTO_INCREMENT,                                         #用户ID
  `name`           VARCHAR(20)   NOT NULL,                                                         #用户姓名
  `phone`          VARCHAR(11)   NOT NULL,                                                         #用户手机号码
  `email`          VARCHAR(30)   NOT NULL,                                                         #用户邮箱
  `password`       VARCHAR(20)   NOT NULL,                                                         #用户密码
  `open_id`        VARCHAR(70)   NULL,                                                             #用户微信绑定账号
  `created_at`     VARCHAR(30)   NOT NULL,                                                         #用户创建时间
  `email_verify`   BOOLEAN       NULL      DEFAULT FALSE,                                          #邮箱验证
  `last_login_at`  TIMESTAMP     NULL      DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,  #用户最后登陆时间
  `last_login_ip`  VARCHAR(15)   NULL,                                                             #用户最后登陆ip
  `head_img`       VARCHAR(100)  NULL,                                                             #用户头像
  PRIMARY KEY (`uid`),
  UNIQUE KEY `uid_UNIQUE` (`uid`),
  UNIQUE KEY `phone_UNIQUE` (`phone`),
  UNIQUE KEY `email_UNIQUE` (`email`)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `message` (
  `message_id`        INT(11)       NOT NULL  AUTO_INCREMENT,                     #微博ID
  `uid`               INT(11)       NOT NULL,                                     #用户ID
  `other_message_id`  INT(11)       NULL,                                         #转发拥有者ID
  `text`              VARCHAR(300)  NULL,                                         #微博内容
  `image_url`         TEXT          NULL,                                         #图片url
  `video_url`         VARCHAR(100)  NULL,                                         #视频url
  `thumb_video_url`   VARCHAR(100)  NULL,                                         #视频缩略图url
  `music_url`         VARCHAR(100)  NULL,                                         #音乐url
  `good`              INT(11)       NULL      DEFAULT 0,                          #点赞数
  `created_at`        TIMESTAMP     NULL      DEFAULT CURRENT_TIMESTAMP,          #微博创建时间
  `come_from`         VARCHAR(30)   NULL,                                         #微博来源
  PRIMARY KEY (`message_id`),
  UNIQUE KEY `message_id_UNIQUE` (`message_id`),
  CONSTRAINT `FK_message_1` FOREIGN KEY (`uid`) REFERENCES `user` (`uid`) ON DELETE CASCADE ON UPDATE CASCADE
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `comment` (
  `message_id`        INT(11)       NOT NULL,                                     #微博ID
  `uid`               INT(11)       NOT NULL,                                     #用户ID
  `text`              VARCHAR(300)  NOT NULL,                                     #评论内容
  `created_at`        TIMESTAMP     NULL      DEFAULT CURRENT_TIMESTAMP,          #评论创建时间
  CONSTRAINT `FK_comment_1` FOREIGN KEY (`message_id`) REFERENCES `message` (`message_id`) ON DELETE CASCADE ON UPDATE CASCADE
)ENGINE=InnoDB DEFAULT CHARSET=utf8;
