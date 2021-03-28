import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Document, Page } from 'react-pdf';
import { Grid, IconButton, Slider } from '@material-ui/core'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import FlagIcon from '@material-ui/icons/Flag';
import FlagOutlinedIcon from '@material-ui/icons/FlagOutlined';
import '../styles/Viewer.css';
import database from '../database';
import Comment from './Comment';
import { isSignedIn, getEmail, getGoogleId } from './localStorageFunctions';
import '../styles/Note.css';

class NotePost extends Component {

    constructor(props) {
        super(props)
        this.state = {
            numPages: null,
            pageNumber: 1,
            flagged: false,
            rating: 0,
            comments: [],
            showAddComment: false,
            commentVal: ''
        }
        this.dbPath = 'gen/' + this.props.school + '/courses/' + this.props.course + '/notes/' + this.props.folderName + '/notes/' + this.props.dbKey;
    }

    doesNotContain = (dbKey) => {
        for (let i = 0; i < this.state.comments.length; i++) {
            if (this.state.comments[i].key === dbKey) {
                return false;
            }
        }
        return true;
    }

    componentDidMount = () => {
        // TODO: Grab current user's rating and flagged status from DB, and set state vals to them
        // TODO: Grab comments array
        database.ref(this.dbPath + '/').on("value", snapshot => {
            this.setState({
                flagged: snapshot.flagged !== undefined ? snapshot.flagged : false,
            })
        })

        let googleId = getGoogleId();
        database.ref(this.dbPath + '/ratings/').on("value", snapshot => {
            snapshot.forEach(rating => {
                if (rating.key == googleId) {
                    this.setState({ rating: rating.key });
                    return; // break out of anonymous function
                }
            })
        })

        let copyComments = [];
        database.ref(this.dbPath + '/comments/').on("value", snapshot => {
            snapshot.forEach(comment => {
                if (this.doesNotContain(comment.key)) {
                    copyComments.push(comment);
                }
            })
            this.setState({
                comments: copyComments
            })
        })

    }

    onDocumentLoadSuccess = ({ numPages }) => {
        this.setState({ numPages: numPages });
    }

    handleLeft = () => {
        if (this.state.pageNumber > 1) this.setState({ pageNumber: this.state.pageNumber - 1 });
    }

    handleRight = () => {
        if (this.state.pageNumber < this.state.numPages) this.setState({ pageNumber: this.state.pageNumber + 1 });
    }

    handleFlag = () => {
        this.setState({ flagged: !this.state.flagged })
        // TODO: Change user flag status in DB
        console.log(this.dbPath)
        console.log(this.state.flagged)
        database.ref(this.dbPath + '/').update({
            flagged: this.state.flagged
        })
    }

    onChangeCommitted = (event, value) => {
        // this.setState({ rating: value });
        // TODO: Change user rating in DB to value

        let newAvgRating;
        let ratedB4 = this.userRatedBefore();

        let oldRatingSum = 0;
        let numRatings = 0;
        // read
        database.ref(this.dbPath + '/').on("value", snapshot => {
            oldRatingSum = snapshot.val().ratingSum;
            numRatings = snapshot.val().numRatings;
        })

        let googleId = getGoogleId();

        if (ratedB4) {
            let oldRating = 0;
            // read
            database.ref(this.dbPath + '/ratings/' + googleId + '/').on("value", snapshot => {
                oldRating = snapshot.val();
            })

            // update
            database.ref(this.dbPath + '/').update({
                ratingSum: (oldRatingSum - oldRating + value)
            });

            newAvgRating = (oldRatingSum - oldRating + value) / (10 * numRatings);
        }
        else {
            numRatings++;
            database.ref(this.dbPath + '/').update({
                numRatings: numRatings,
                ratingSum: oldRatingSum + value
            })

            newAvgRating = (oldRatingSum + value) / (10 * numRatings);
        }
        database.ref(this.dbPath + '/ratings/' + googleId + '/').set(value);

        this.setState({
            rating: newAvgRating
        })
    }

    userRatedBefore = () => {
        let googleId = getGoogleId();
        let found = false;
        database.ref(this.dbPath + '/ratings/').on("value", snapshot => {
            snapshot.forEach(rating => {
                if (rating.key == googleId) {
                    found = true;
                }
            })
        })

        return found;
    }

    toggleShowAddComment = () => {
        this.setState({ showAddComment: !this.state.showAddComment });
    }

    addComment = () => {
        if (this.state.commentVal === '' || this.state.commentVal.trim() === '') {
            return;
        }
        const newComment = {
            content: this.state.commentVal,
            googleId: getGoogleId(),
            email: getEmail(),
            dateDay: new Date().toLocaleDateString(),
            dateTime: new Date().toLocaleTimeString(),
            flagged: false,
            childComments: {}
        };
        database.ref(this.dbPath + '/comments/').push(newComment);
        this.setState({ showAddComment: false, commentVal: '' });
    }

    handleText = (event) => {
        this.setState({ commentVal: event.target.value });
    }

    render() {
        return (
            <>
                <Grid container spacing={4}>
                    <Grid item lg={5} xs={12}>
                        <div style={{ display: "flex" }}>
                            <IconButton onClick={this.handleLeft} disabled={this.state.pageNumber <= 1}>
                                <ChevronLeftIcon />
                            </IconButton>
                            <IconButton onClick={this.handleRight} disabled={this.state.pageNumber >= this.state.numPages}>
                                <ChevronRightIcon />
                            </IconButton>
                            <p>Page {this.state.pageNumber} of {this.state.numPages}</p>

                        </div>
                        <Document
                            file={this.props.url}
                            onLoadSuccess={this.onDocumentLoadSuccess}
                        >
                            <Page pageNumber={this.state.pageNumber} className="viewer" />
                        </Document>
                    </Grid>
                    <Grid item lg={7} xs={12} style={{ width: '100%' }}>
                        <p> {this.props.title} </p>
                        <p> Posted {this.props.posted.toLocaleDateString()} </p>
                        <p> Average Rating: {this.props.rating} </p>
                        <p> Rate This Note </p>
                        <Slider
                            min={0}
                            max={10}
                            marks
                            valueLabelDisplay="auto"
                            onChangeCommitted={this.onChangeCommitted} style={{ maxWidth: "200px" }}
                            defaultValue={this.state.rating}
                        />
                        <div style={{ display: "flex" }}>
                            <IconButton onClick={this.handleFlag}>
                                {this.state.flagged ? <FlagIcon /> : <FlagOutlinedIcon />}
                            </IconButton>
                            <p> Flag for Cheating</p>
                        </div>
                        <p> <h6>Comments </h6></p>
                        <div className='comments'>
                            {this.state.comments.map((commentObj) =>
                                <Comment
                                    content={commentObj.val().content}
                                    path={this.dbPath + '/comments/'}
                                    dbKey={commentObj.key}
                                    dateDay={commentObj.val().dateDay}
                                    dateTime={commentObj.val().dateTime}
                                    flagged={commentObj.val().flagged}
                                />
                            )}
                        </div>
                        {this.state.showAddComment ?
                            <>
                                <input className='add-comment-form reply-input' value={this.state.commentVal} onChange={this.handleText} />
                                <button className='add-comment-btn btn btn-success' onClick={this.addComment}>Add Comment</button>
                            </>
                            : <button className='show-add-comment-btn btn btn-success' onClick={this.toggleShowAddComment}>Add Comment</button>
                        }
                    </Grid>
                </Grid>
            </>
        )
    }
}

NotePost.propTypes = {
    url: PropTypes.string,
    title: PropTypes.string,
    rating: PropTypes.number,
    posted: PropTypes.instanceOf(Date)
}

export default NotePost;