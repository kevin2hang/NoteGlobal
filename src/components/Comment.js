import React from 'react';
import database from '../database';

class Comment extends React.Component {
  constructor(props) {
    super(props);

    const dbPath = this.props.path + this.props.dbKey + '/';
    this.state = {
      showReplyInput: false,
      replyContent: '',
      replies: [],
    }
  }

  componentDidMount() {
    database.ref(dbPath + 'childComments/').on('value', (snapshot) => {
      snapshot.forEach(replyComment => {
        if (this.state.replies.find(replyComment.key) === undefined) {
          replies.push(
            <ReplyComment
              content={replyComment.val().content}
              postDate={replyComment.val().dateDay}
              postTime={replyComment.val().dateTime}
              googleId={replyComment.val().googleId}
              dbPath={dbPath + 'childComments/'}
              dbKey={replyComment.key}
            />
          );
        }
      });
    });
  }

  addReplyComment = () => {
    let replyComment = {
      content: this.state.replyContent,
      googleId: getGoogleId,
      email: getEmail,
      dateDay: new Date.toLocaleDateString(),
      dateTime: new Date.toLocaleTimeString()
    };
    database.ref(dbPath + 'childComments/').push(replyComment);
    this.setState({
      showReplyInput: false,
      replyContent: '',
    });
  }

  toggleReplyInput = () => {
    this.setState({ showReplyInput: !this.state.showReplyInput });
  }

  handleChange = (event) => {
    this.setState({ replyContent: event.target.value });
  }

  render() {
    return (
      <div className='comment-block'>
        <div className='parent-comment comment'>
          <span>{this.props.content}</span>
          <span className='time-display'>{this.props.dateDay} - {this.props.dateTime}</span>
          <div className='flag'></div>
        </div>
        {this.state.replies.map((reply) => reply)}

        <div className='show-reply-button' onClick={this.toggleReplyInput}>Reply</div>
        {this.state.showReplyInput ?
          <div>
            <input className='reply-input' value={this.state.value} onChange={this.handleChange} />

            <button className onClick={this.addReplyComment}>Reply</button>
          </div>
          : ''}
      </div>
    );
  }
}