import React from 'react';
import database from '../database';
import FlagIcon from '@material-ui/icons/Flag';
import FlagOutlinedIcon from '@material-ui/icons/FlagOutlined';

class ReplyComment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      flagged: this.props.flagged !== undefined ? this.props.flagged : false
    }
  }

  handleFlag = () => {
    database.ref(this.props.dpPath + this.props.dbKey + '/flagged/').set(!this.state.flagged);
    this.setState({ flagged: !this.state.flagged });
  }

  render() {
    return (
      <div className='reply-comment comment'>
        <span>{this.props.content}</span>
        <div className='right'>
          <span className='time-display'>{this.props.postDate} - {this.props.postTime}</span>
          <div className='flag-button' onClick={this.handleFlag}>
            {this.state.flagged ? <FlagIcon /> : <FlagOutlinedIcon />}
          </div>
        </div>
      </div>
    );
  }
}

export default ReplyComment;