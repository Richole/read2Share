DROP DATABASE IF EXISTS `readToShare`;
CREATE DATABASE `readToShare` CHARACTER SET utf8;
USE `readToShare`;

CREATE TABLE `user` (
  `uid`            INT(11)       NOT NULL  AUTO_INCREMENT,                                         -- 用户ID
  `name`           VARCHAR(20)   NOT NULL,                                                         -- 用户姓名
  `phone`          VARCHAR(11)   NOT NULL,                                                         -- 用户手机号码
  `email`          VARCHAR(30)   NOT NULL,                                                         -- 用户邮箱
  `password`       VARCHAR(20)   NOT NULL,                                                         -- 用户密码
  `open_id`        VARCHAR(70)   NULL,                                                             -- 用户微信绑定账号
  `created_at`     TIMESTAMP     NOT NULL  DEFAULT 0,                                              -- 用户创建时间
  `email_verify`   BOOLEAN       NULL      DEFAULT FALSE,                                          -- 邮箱验证
  `last_login_at`  TIMESTAMP     NULL      DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,  -- 用户最后登陆时间
  `last_login_ip`  VARCHAR(15)   NULL,                                                             -- 用户最后登陆ip
  `head_img`       VARCHAR(100)  NULL,                                                             -- 用户头像
  PRIMARY KEY (`uid`),
  UNIQUE KEY `uid_UNIQUE` (`uid`),
  UNIQUE KEY `phone_UNIQUE` (`phone`),
  UNIQUE KEY `email_UNIQUE` (`email`)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `message` (
  `message_id`           INT(11)        NOT NULL  AUTO_INCREMENT,             -- 微博ID
  `uid`                  INT(11)        NOT NULL,                             -- 用户ID
  `other_message_id`     INT(11)        NULL,                                 -- 转发拥有者ID
  `text`                 VARCHAR(3000)  NULL,                                 -- 微博内容
  `image_url`            TEXT           NULL,                                 -- 图片url
  `video_url`            VARCHAR(100)   NULL,                                 -- 视频url
  `thumb_video_url`      VARCHAR(100)   NULL,                                 -- 视频缩略图url
  `music_url`            VARCHAR(100)   NULL,                                 -- 音乐url
  `good`                 INT(11)        NULL      DEFAULT 0,                  -- 点赞数
  `retransmission_nums`  INT(11)        NULL      DEFAULT 0,                  -- 转发量
  `comment_nums`         INT(11)        NULL      DEFAULT 0,                  -- 评论量
  `created_at`           TIMESTAMP      NULL      DEFAULT CURRENT_TIMESTAMP,  -- 微博创建时间
  `come_from`            VARCHAR(30)    NULL,                                 -- 微博来源
  PRIMARY KEY (`message_id`),
  UNIQUE KEY `message_id_UNIQUE` (`message_id`),
  UNIQUE KEY `other_message_id_uid_UNIQUE` (`uid`,`other_message_id`),
  CONSTRAINT `FK_message_1` FOREIGN KEY (`uid`) REFERENCES `user` (`uid`) ON DELETE CASCADE ON UPDATE CASCADE
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `comment` (
  `message_id`        INT(11)       NOT NULL,                              -- 微博ID
  `uid`               INT(11)       NOT NULL,                              -- 用户ID
  `text`              VARCHAR(300)  NOT NULL,                              -- 评论内容
  `created_at`        TIMESTAMP     NULL       DEFAULT CURRENT_TIMESTAMP,  -- 评论创建时间
  CONSTRAINT `FK_comment_1` FOREIGN KEY (`message_id`) REFERENCES `message` (`message_id`) ON DELETE CASCADE ON UPDATE CASCADE
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `good` (
  `message_id`        INT(11)       NOT NULL,                              -- 微博ID
  `uid`               INT(11)       NOT NULL,                              -- 用户ID
  `created_at`        TIMESTAMP     NULL       DEFAULT CURRENT_TIMESTAMP,  -- 点赞创建时间
  CONSTRAINT `FK_good_1` FOREIGN KEY (`message_id`) REFERENCES `message` (`message_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_good_2` FOREIGN KEY (`uid`) REFERENCES `user` (`uid`) ON DELETE CASCADE ON UPDATE CASCADE
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `identifyCode` (
  `uid`         INT(11)     NOT NULL,                              -- 用户ID
  `code`        VARCHAR(6)  NOT NULL,                              -- 验证码
  `created_at`  TIMESTAMP   NULL       DEFAULT CURRENT_TIMESTAMP,  -- 验证码创建时间
  CONSTRAINT `FK_identifyCode_1` FOREIGN KEY (`uid`) REFERENCES `user` (`uid`) ON DELETE CASCADE ON UPDATE CASCADE
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `care` (
  `uid`         INT(11)     NOT NULL,                              -- 用户ID
  `careId`      INT(11)     NOT NULL,                              -- 关注用户ID
  `created_at`  TIMESTAMP   NULL       DEFAULT CURRENT_TIMESTAMP,  -- 关注创建时间
  CONSTRAINT `FK_care_1` FOREIGN KEY (`uid`) REFERENCES `user` (`uid`) ON DELETE CASCADE ON UPDATE CASCADE
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `book` (
  `book_id`            INT(11)        NOT NULL  AUTO_INCREMENT,             -- 用户ID
  `book_author`        VARCHAR(100)   NOT NULL,                             -- 用户ID
  `publish_time`       VARCHAR(30)    NOT NULL,                             -- 用户ID
  `publishing`         VARCHAR(30)    NOT NULL,                             -- 用户ID
  `book_name`          VARCHAR(50)    NOT NULL,                             -- 用户ID
  `foreign_book_name`  VARCHAR(50)    NULL,                                 -- 用户ID
  `page_num`           VARCHAR(20)    NULL,                                 -- 用户ID
  `book_language`      VARCHAR(20)    NULL,                                 -- 用户ID
  `book_type`          VARCHAR(20)    NOT NULL,                             -- 用户ID
  `author_profile`     VARCHAR(3000)  NULL,                                 -- 关注用户ID
  `catalogue`          VARCHAR(3000)  NULL,                                 -- 关注用户ID
  `introduction`       VARCHAR(3000)  NULL,                                 -- 关注用户ID
  `abstract`           VARCHAR(3000)  NULL,                                 -- 关注用户ID
  `share_num`          INT(11)        NULL      DEFAULT 0,                  -- 关注用户ID
  `search_num`         INT(11)        NULL      DEFAULT 0,                  -- 关注用户ID    
  `created_at`         TIMESTAMP      NULL      DEFAULT CURRENT_TIMESTAMP,  -- 关注创建时间
  PRIMARY KEY (`book_id`)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- 存储过程
-- DROP PROCEDURE IF EXISTS procedure_retransmission;
-- DELIMITER //
-- CREATE PROCEDURE procedure_retransmission(message_message_id INT(11))
-- BEGIN
--   DECLARE message_text VARCHAR(3000) DEFAULT '';
--   SET message_text = (SELECT a.text FROM message a,message b WHERE a.message_id = b.other_message_id AND b.message_id = message_message_id);
--   UPDATE message SET text = message_text WHERE message_id = message_message_id;
-- END
-- //

-- 触发器
-- DROP TRIGGER IF EXISTS trigger_retransmission;
-- DELIMITER //
-- CREATE TRIGGER trigger_retransmission
-- BEFORE INSERT ON message
-- FOR EACH ROW
-- BEGIN
--   IF NEW.other_message_id then
--     SET NEW.TEXT = (SELECT text FROM message WHERE message_id = new.other_message_id);
--   END IF;
-- END;
-- //
-- DELIMITER ;
