import React, { Component } from 'react';
import database from '../database';

class CreateCourse extends Component {
    constructor(props) {
        super(props);
        this.state = {
            school: '',
            course: ''
        }
    }

    handleSchoolChange = (e) => {
        this.setState({
            school: e.target.value
        })
    };

    handleCourseChange = (e) => {
        this.setState({
            course: e.target.value
        })
    };

    submit = (e) => {
        e.preventDefault();

        database.ref('schools/' + this.state.school + '/').push(this.state.course)
     
        database.ref('gen/' + this.state.school + '/courses/' + this.state.course + '/').set({
            'alternate-names': {},
            'notes': {},
            'verifiedAdmins': { '0': '02347407531' },
            'requestAdminPrivilegeUsers': { '1': '835698735' }
        })

        let key = undefined;
        database.ref('schools/' + this.state.school + '/').on("value", snapshot => {
            snapshot.forEach(course => {
                console.log(course.val())
                if (course.val() == 'example-course')
                    key = course.key;
            })
        })

        if (key != undefined) {
            database.ref('schools/' + this.state.school + '/' + key + '/').remove();
            console.log('deleting example course from schools/'+ this.state.school + '/' + key + '/');
        }
        database.ref('gen/' + this.state.school + '/courses/example-course/').remove();

        this.setState({
            school :'',
            course : ''
        })
    };



    render() {
        return (
            <div>
                <form onSubmit={this.submit}>
                    Create a Course:
                    <input className="form-control" type="text" placeholder="School Name" value={this.state.school} onChange={this.handleSchoolChange} />
                    <input className="form-control" type="text" placeholder="Course name" value={this.state.course} onChange={this.handleCourseChange} />
                    <input className="btn btn-primary" type="submit" />
                </form>
            </div>
        )
    }
}

export default CreateCourse;