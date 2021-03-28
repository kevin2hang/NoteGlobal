import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Document, Page } from 'react-pdf';
import { Grid, IconButton, Slider } from '@material-ui/core'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import FlagIcon from '@material-ui/icons/Flag';
import FlagOutlinedIcon from '@material-ui/icons/FlagOutlined';
import '../styles/Viewer.css';

class NotePost extends Component{
    
    constructor(props){
        super(props)
        this.state = {
            numPages: null,
            pageNumber: 1,
            flagged: false,
            rating: 0,
            comments: []
        }
    }

    componentDidMount = () => {
        // TODO: Grab current user's rating and flagged status from DB, and set state vals to them
        // TODO: Grab comments array
    }

    onDocumentLoadSuccess = ({ numPages }) => {
        this.setState({numPages: numPages});
    }
    
    handleLeft = () => {
        if (this.state.pageNumber > 1) this.setState({pageNumber: this.state.pageNumber - 1});
    }

    handleRight = () => {
        if (this.state.pageNumber < this.state.numPages) this.setState({pageNumber: this.state.pageNumber + 1});
    }

    handleFlag = () => {
        this.setState({flagged: !this.state.flagged})
        // TODO: Change user flag status in DB
    }

    onChangeCommitted = (event, value) => {
        this.setState({rating: value});
        // TODO: Change user rating in DB to value
    }

    render() {
        return(
            <>
                <Grid container spacing={8}>
                    <Grid item xs={5}>
                        <div style={{display: "flex"}}>
                            <IconButton onClick={this.handleLeft} disabled={this.state.pageNumber <= 1}>
                                <ChevronLeftIcon/>
                            </IconButton>
                            <IconButton onClick={this.handleRight} disabled={this.state.pageNumber >= this.state.numPages}>
                                <ChevronRightIcon/>
                            </IconButton>
                            <p>Page {this.state.pageNumber} of {this.state.numPages}</p>

                        </div>
                        <Document
                            file={this.props.url}
                            onLoadSuccess={this.onDocumentLoadSuccess}
                        >
                            <Page pageNumber={this.state.pageNumber} height={650} className="viewer"/>
                        </Document>
                    </Grid>
                    <Grid item xs={7}>
                        <p> {this.props.title} </p>
                        <p> Posted {this.props.posted.toLocaleDateString()} </p>
                        <p> Average Rating: {this.props.rating} </p>
                        <p> Rate This Note </p> 
                        <Slider 
                            min={0} 
                            max={10} 
                            marks 
                            valueLabelDisplay="auto" 
                            onChangeCommitted={this.onChangeCommitted} style={{maxWidth: "200px"}}
                            defaultValue={this.state.rating}
                        />
                        <div style={{display: "flex"}}>
                            <IconButton onClick={this.handleFlag}>
                                {this.state.flagged ? <FlagIcon/> : <FlagOutlinedIcon/>}
                            </IconButton>
                            <p> Flag for Cheating</p> 
                        </div>
                        <p> Comments </p>
                        {/* TODO: Add Comments */}
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