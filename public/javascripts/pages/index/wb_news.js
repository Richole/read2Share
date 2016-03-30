class News extends React.Component {
  constructor() {
    this.state = {
      messages: []
    };
  }

  componentDidMount() {
    $.get(this.props.url, {
        type: 'all'
      },
      res => {
        res.data.map((item, index) => {
          if(item.other_message_id) {
            res.retransmission.map((retransmission_item, retransmission_index) => {
              if(retransmission_item.message_id == item.other_message_id) {
                var {come_from, created_at, head_img, name, other_message_id, ...retransmission_message} = retransmission_item;
                retransmission_message.uname = retransmission_item.name;
                Object.assign(res.data[index], retransmission_message);
              }
            });
          }
        });
        this.setState({
          messages: res.data || []
        });
      }
    );
  }

  render() {
    var messagesNode = this.state.messages.map((message, index) => {
      return (
        <New key={index} message={message} />
      );
    });
    return (
      <div>
        {messagesNode}
      </div>
    );
  }
}

class New extends React.Component {
  render() {
    var {head_img, name, created_at, come_from, uname, ...otherHead} = this.props.message;
    var {text, image_url, video_url, music_url, ...otherBody} = this.props.message;
    var {comment_nums, retransmission_nums, good, message_id, uid} = this.props.message;
    return (
      <div className="content-box">
        <NewHeader head_img={head_img} name={name} created_at={created_at} come_from={come_from} uname={uname} />
        <NewBody text={text} image_url={image_url} video_url={video_url} music_url={music_url} />
        <NewFooter comment_nums={comment_nums} retransmission_nums={retransmission_nums} good={good} message_id={message_id} uid={uid} />
      </div>
    );
  }
}

class NewHeader extends React.Component {
  formatTime() {
    return new Date(this.props.created_at).format('MM月DD日 hh:mm:ss')
  }
  render() {
    return (
      <div className="wb-header">
        <img src={this.props.head_img} className="wb-author-head-img" />
        <span>
          <p className="author-name">
            <a href="javascript:;">{ this.props.name }</a>
          </p>
          <p className="wb-time-and-info">
            {this.formatTime() } 来自 {this.props.come_from}
          </p>
          <p className="wb-retransmission-info">
            <a>{this.props.uname ? ` 转自 ${this.props.uname}` : ''}</a>
          </p>
        </span>
        <a href="javascript:;" className="my-care glyphicon glyphicon-heart-empty"></a>
      </div>
    );
  }
}

class NewBody extends React.Component {

  renderOtherType() {
    if(this.props.image_url.length) {
      var images = this.props.image_url.split('###');
      return <NewBodyImage images={images}/>;
    }
    else if(this.props.video_url.length) {
      return <NewBodyVideo video_url={this.props.video_url} />;
    }
    else if(this.props.music_url.length) {
      return <NewBodyMusic music_url={this.props.music_url}/>;
    }
    return "";
  }

  createText() {
    var text = decodeURIComponent(this.props.text);
    var reg = /\[f_(.*?)\]/gmi;
    text = text.replace(reg,'<img src="http://localhost/images/paopao/$1.png" data-type="$1" class="add-paopao">');
    return {__html: text};
  }

  render() {
    return (
      <div className="wb-body">
        <div className="wb-message">
          <p dangerouslySetInnerHTML={this.createText()}>
          </p>
        </div>
        { this.renderOtherType() }
      </div>
    );
  }
}

class NewBodyImage extends React.Component {
  render() {
    var imageNode = this.props.images.map((image, index) => {
      return (
        <img key={index} src={image} className="col-sm-4 col-md-4 col-lg-4" />
      );
    });
    return (
      <div className="wb-images row">
        {imageNode}
      </div>
    );
  }
}

class NewBodyVideo extends React.Component {
  render() {
    return (
      <div className="wb-video">
        <video src={this.props.video_url} controls="controls">
          your browser does not support.
        </video>
      </div>

    );
  }
}

class NewBodyMusic extends React.Component {
  render() {
    return (
      <div className="wb-audio">
        <audio src={this.props.music_url} controls="controls">
          your browser does not support.
        </audio>
      </div>
    );
  }
}

class NewFooter extends React.Component {
  constructor(props) {
    super(props);
    this.state = props;
  }

  sendGood() {
    $.post('/index/addGood', {
      message_id: this.state.message_id
    }, res => {
      if(res.success) {
        this.setState({good: this.state.good + 1});
      }
      else {
        alert(res.message);
      }
    });
  }

  sendRetransmission() {
    $.post('/index/retransmission', {
      message_id: this.state.message_id,
      uid: this.state.uid
    }, res => {
      if(res.success) {
        alert('转发成功');
        this.setState({retransmission_nums: this.state.retransmission_nums + 1});
      }
      else {
        alert(res.message);
      }
    });
  }

  sendComment() {

  }

  componentWillMount() {

  }

  componentDidMount() {

  }

  render() {
    return (
      <div className="wb-footer">
        <ul className="wb-footer-bar clearfix">
          <li>
            <a href="javascript:;">
              收藏
            </a>
          </li>
          <li>
            <a href="javascript:;" onClick={this.sendRetransmission.bind(this)}>
              转发 { this.state.retransmission_nums || '0' }
            </a>
          </li>
          <li>
            <a href="javascript:;" onClick={this.sendComment.bind(this)}>
              评论 { this.state.comment_nums || '0' }
            </a>
          </li>
          <li>
            <a href="javascript:;" onClick={this.sendGood.bind(this)}>
              <i className="glyphicon glyphicon-thumbs-up"></i>
              { ' ' + this.state.good || '0'}
            </a>
          </li>
        </ul>
      </div>
    );
  }
}


exports.getNews = function (url, id) {
  return React.render(
    <News url={url} />,
    document.getElementById(id)
  );
};
