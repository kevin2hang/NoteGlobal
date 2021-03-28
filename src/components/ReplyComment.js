import React from 'react';
import database from '../database';

class ReplyComment extends React.Component {
  constructor(props) {
    super(props);
  }

  flag = () => {
    database.ref(this.props.dpPath+this.props.dbKey+'/flagged/').set(true);
  }
  render() {
    return (
    <div className='reply-comment comment'>
        <span>{this.props.content}</span>
        <span className='time-display'>{this.props.postDate} - {this.props.postTime}</span>
        <div className='flag' onClick={this.flag}></div>
    </div>
    );
  } 
}

export default ReplyComment;