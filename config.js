function config_module () {
  this.host = 'localhost';                                        // 数据库地址
  this.user = 'root';                                             // 数据库账号
  this.password = 'ddainn1314';                                   // 数据库密码
  this.database = 'readToShare';                                  // 数据库名称
  this.key = 'ChenBaby';                                          // 加密密码
  this.algorithm = 'aes256';                                      // 加密算法
  this.mailHost = 'localhost';                                    // 邮箱验证链接前缀
  this.appID = 'wx1417dc4330e0eeb8';                              // 微信appID
  this.appsecret = '1f6c73ac481c4e6d5a5982ccdb0e55d1';            // 微信appsecret
  this.token = 'ddainn';                                          // 微信token
  this.weixinNumber = 'gh_83bf83bc4284';                          // 微信号
  this.pictureFolderPath = '/root/work/pictures';                 // 图片存放路径
  this.musicFolderPath = '/root/work/musics';                     // 音频存放路径
  this.videoFolderPath = '/root/work/videos';                     // 视频存放路径
  this.access_token = null;                                       // 微信access_token
  this.access_token_created_at = null;                            // 微信access_token过期时间
}

var config = new config_module ();

module.exports = config;
