import React, { Component} from 'react';
import database from '../database';

class CreateCourse extends Component {
    constructor(props) {
        super(props);
        this.state = {
            school : '',
            course : ''
        }
    }

    handleSchoolChange = (e) => {
        this.setState({
            school : e.target.value
        })
    };

    handleCourseChange = (e) => {
        this.setState({
            course : e.target.value
        })
    };

    submit = (e) => {
        e.preventDefault();
        // if (!schoolExists(this.state.school)) {
            database.ref('schools/'+this.state.school+'/').push(this.state.course)
        // }
        // else {
            
        // }
    };

    

    render() {
        return(
            <div>
                <form onSubmit={this.submit}>
                    Create a Course: 
                    <input type="text" placeholder="School Name" onChange={this.handleSchoolChange}/>
                    <input type="text" placeholder="Course name" onChange={this.handleCourseChange}/>
                    <input type="submit"/>
                </form>
            </div>
        )
    }
}

export default CreateCourse;