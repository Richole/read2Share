define(function (require, exports, module) {
  var vue = require('vue.js');

  function footer_bar() {
    var self = this;
    this.init = function () {
      vueObj = new vue({
        el: "#chat-form",
        data: {
          imageLength: 0,
          videoLength: 0,
          musicLength: 0,
        },
        methods: {
          showBuble: self.showBuble,
          submit: self.submit,
          imageChange: self.imageChange,
          videoChange: self.videoChange,
          musicChange: self.musicChange
        }
      });
      this.bindCommonEvent();
      this.initBuble();
    };

    this.imageChange = function () {
      var file = event.srcElement.files;
      if(vueObj.videoLength || vueObj.musicLength) {
        alert('只能上传一种多媒体文件，请重新上传');
        $('#chat-box-reset').click();
        vueObj.videoLength = 0;
        vueObj.musicLength = 0;
        vueObj.imageLength = 0;
        return;
      }
      else if(file.length > 8) {
        alert('上传图片数量不能大于8张');
        $('#chat-box-reset').click();
        vueObj.imageLength = 0;
        return;
      }
      vueObj.imageLength = file.length;
    };

    this.videoChange = function () {
      var file = event.srcElement.files;
      if(vueObj.imageLength || vueObj.musicLength) {
        alert('只能上传一种多媒体文件，请重新上传');
        $('#chat-box-reset').click();
        vueObj.videoLength = 0;
        vueObj.musicLength = 0;
        vueObj.imageLength = 0;
        return;
      }
      else if(file.length > 1) {
        alert('视频文件只能上传一个，请重新上传');
        $('#chat-box-reset').click();
        vueObj.imageLength = 0;
        return;
      }
      vueObj.videoLength = file.length;
    };

    this.musicChange = function () {
      var file = event.srcElement.files;
      if(vueObj.videoLength || vueObj.imageLength) {
        alert('只能上传一种多媒体文件，请重新上传');
        $('#chat-box-reset').click();
        vueObj.videoLength = 0;
        vueObj.musicLength = 0;
        vueObj.imageLength = 0;
        return;
      }
      else if(file.length > 1) {
        alert('音频文件只能上传一个，请重新上传');
        $('#chat-box-reset').click();
        vueObj.imageLength = 0;
        return;
      }
      vueObj.musicLength = file.length;
    };

    this.formatText = function () {
      var text = $('.chat-box').html();
      var reg = /(<img.*?data-type="(.+?)".*?>)/img;
      var reg1 = /<br(.*?)>/img;
      text = text.replace(reg, '[f_$2]');
      text = text.replace(reg1,'');
      return text;
    }

    this.bindCommonEvent = function () {
      $('.chat-emotion-table td').click(function () {
        var $img = $(this).find('img');
        if($img) {
          if($('.chat-box div').length) {
            $('.chat-box div:last').append($img.clone());
          }
          else {
            $('.chat-box').append($img.clone());
          }
          $('.chat-emotion-table').toggleClass('hide');
        }
      });
      $(window.document).click(function () {
        if(!$('.chat-emotion-table.hide').length) {
          $('.chat-emotion-table').addClass('hide');
        }
      });
      $('.chat-icon-image').click(function () {
        return $('#images-choose').click();
      });
      $('.chat-icon-music').click(function () {
        return $('#musics-choose').click();
      });
      $('.chat-icon-video').click(function () {
        return $('#videos-choose').click();
      });
      $('.chat-box').keyup(function () {
        var text = self.formatText();
        var tips = text.length <= 140 ? '还可以输入{0}个字'.format(140 - text.length) : '超出字数';
        $('.content-box .type-tips').text(tips);
      });
    };

    this.submit = function () {
      var text = self.formatText();
      if(text.length > 140) {
        alert('字数超出要求');
        return;
      }
      $('#chat-box-content').val(text);
      $.ajax({
        url : '/index/userMessage',
        type : 'POST',
        data : new FormData($('#chat-form').get(0)),
        processData : false,  //必须false才会避开jQuery对 formdata 的默认处理,XMLHttpRequest会对 formdata 进行正确的处理
        contentType : false, //必须false才会自动加上正确的Content-Type
        success : function(res) {
          console.log(res);
          if(res.success) {
            alert('提交成功。');
            window.location.href = window.location.href;
          }
          else {
            alert(res.message);
          }
        },
        error : function(err) {
          alert('提交失败。');
        }
      });
    };

    this.showBuble = function () {
      var $element = $('.chat-emotion-table');
      if($element.hasClass('hide')) {
        $element.removeClass('hide');
      }
      else {
        $element.addClass('hide');
      }
      event.stopPropagation();
    };

    this.initBuble = function () {
      for(var i = 1; i <= 45; i++) {
        $('.chat-emotion-table td').eq(i-1).append('<img src="/images/paopao/{0}.png" data-type="{0}" class="add-paopao" />'.format(i));
      }
    };
  }

  module.exports = new footer_bar();
});
