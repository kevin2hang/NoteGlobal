import React, { Component } from 'react';
import PropTypes from 'prop-types';
import database from '../database';
import { isSignedIn, getGoogleId, getEmail } from './localStorageFunctions';

class UploadNote extends Component{
    
    constructor(props){
        super(props)
        this.state = {
            selectedFile: null,
            encodedFile: null,
            fileName: null,
            numPages: null,
            pageNumber: 1,
            signedIn: isSignedIn(),
        }
    }

    // On file select (from the pop up)
    handleChange = (event) => {
      // Update the state
      this.setState({ selectedFile: event.target.files[0] });
    
    }

    handleUpload = async () => {
        let selectedFile = this.state.selectedFile;
        console.log(selectedFile);
        let file = null;
        let fileName = "";
        //Check File is not null
        if (selectedFile) {
            console.log("not null")
            // Select the very first file from list
            let fileToLoad = selectedFile;
            fileName = fileToLoad.name;
            this.setState({fileName: fileName})
            // FileReader function for read the file.
            let fileReader = new FileReader();
            // Onload of file read the file content
            fileReader.onload = (fileLoadedEvent) => {
                file = fileLoadedEvent.target.result;
                // Print data in console
                this.setState({encodedFile: file})
                // console.log(this.state.encodedFile)

                const dbPath = 'gen/'+this.props.school+'/courses/'+this.props.course+'/notes/'+this.props.folderName+'/notes/';
                const postObj = {
                    'fileUrl': this.state.encodedFile,
                    'filename': ''+this.state.fileName,
                    'ratingSum': 0,
                    'numRatings': 0,
                    'ratings': {},
                    'comments': {},
                    'googleId': getGoogleId(),
                    'email': getEmail(),
                    'flagged': false,
                    'postTimeMs': Date.now()
                };
                database.ref(dbPath).push(postObj);

            };
            // Convert data to base64
            fileReader.readAsDataURL(fileToLoad);

        }
        
    }

    onDocumentLoadSuccess = ({ numPages }) => {
        this.setState({numPages: numPages});
    }

    render() {
        return(
            <>
            {this.state.signedIn ? 
            <>
                {!this.state.encodedFile ?
                (<div>
                    <input className='form-control' type="file" accept="application/pdf" onChange={this.handleChange} />
                    <button className='btn btn-primary' onClick={this.handleUpload}>
                        Upload!
                    </button>
                </div>)
                :
                <div className="alert alert-success" role="alert">Upload Successful!</div>
                }
            </>
            :
            <div>You must be signed in to upload your notes. If you have signed in, please reload the page.</div>
            }
            </>
        )
    }
}

UploadNote.propTypes = {
    path: PropTypes.string
}

export default UploadNote;