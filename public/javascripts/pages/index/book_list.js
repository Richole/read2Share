class List extends React.Component {
  constructor() {
    this.state = {
      books: [],
      listNum: 0
    };
  }

  changeList() {
    $.get(this.props.url, {
        listNum: this.state.listNum
      }, res => {
        var isEmpty = res.data.length == 0;
        var arr = res.data.map((item) => {
          item.url = `/book_details/${item.book_id}`;
          return (
            <li>
              <a href={item.url}>#{item.book_name}#</a>
              {item.search_num}
            </li>
          );
        });
        if(isEmpty) {
          alert('没有书籍啦');
        }
        this.setState({
          books: isEmpty ? this.state.books : arr,
          listNum: isEmpty ? 0 : this.state.listNum + 1
        });
      }
    );
  }

  componentDidMount() {
    this.changeList();
  }

  render() {
    return (
      <div className="content-box">
        <div className="hot-topic-header">
          <h3 className="topic">热门书籍</h3>
          <a href="javascript:;" className="change-topic" onClick={this.changeList.bind(this)}>
            <i className="glyphicon glyphicon-repeat"></i>
            换一换
          </a>
        </div>
        <ul className="topic-list">
          {this.state.books}
        </ul>
      </div>
    );
  }
}

exports.getList = (url, id) => {
  return React.render(
    <List url={url} />,
    document.getElementById(id)
  );
};
