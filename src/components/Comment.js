import React from 'react';
import database from '../database';
import FlagIcon from '@material-ui/icons/Flag';
import FlagOutlinedIcon from '@material-ui/icons/FlagOutlined';
import { getGoogleId, getEmail } from './localStorageFunctions';
import ReplyComment from './ReplyComment';
import '../styles/Comment.css';

class Comment extends React.Component {
  constructor(props) {
    super(props);

    this.dbPath = this.props.path + this.props.dbKey + '/';
    this.state = {
      showReplyInput: false,
      replyContent: '',
      replies: [],
      flagged: this.props.flagged !== undefined ? this.props.flagged : false
    }
  }

  doesNotContain = (dbKey) => {
    for (let i = 0; i < this.state.replies.length; i++) {
      const obj = this.state.replies[i];
      if (obj.dbKey === dbKey) {
        return false;
      }
    }
    return true;
  }

  componentDidMount() {
    const newReplies= this.state.replies;
    database.ref(this.dbPath + 'childComments/').on('value', (snapshot) => {
      snapshot.forEach(replyComment => {
        if (this.doesNotContain(replyComment.key)) {
          newReplies.push(
            {
              content: replyComment.val().content,
              postDate: replyComment.val().dateDay,
              postTime: replyComment.val().dateTime,
              googleId: replyComment.val().googleId,
              flagged: replyComment.val().flagged,
              dbPath: this.dbPath + 'childComments/',
              dbKey: replyComment.key,
            }
          );
        }
      });
      this.setState({replies: newReplies});
    });
  }

  addReplyComment = () => {
    let replyComment = {
      content: this.state.replyContent,
      googleId: getGoogleId(),
      email: getEmail(),
      dateDay: new Date().toLocaleDateString(),
      dateTime: new Date().toLocaleTimeString()
    };
    database.ref(this.dbPath + 'childComments/').push(replyComment);
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

  handleFlag = () => {
    database.ref(this.dbPath).update({flagged :!this.state.flagged});
    this.setState({flagged: !this.state.flagged});
  }

  render() {
    return (
      <div className='comment-block'>
        <div className='parent-comment comment'>
          <span>{this.props.content}</span>
          <div className='right'>
            <span className='time-display'>{this.props.dateDay} - {this.props.dateTime}</span>
            <div className='flag-button' onClick={this.handleFlag}>
              {this.state.flagged ? <FlagIcon/> : <FlagOutlinedIcon/>}
            </div>
          </div>
        </div>
        {this.state.replies.map((reply) => <ReplyComment {...reply} />)}

        <button className='show-reply-button' onClick={this.toggleReplyInput}>Reply</button>
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

export default Comment;