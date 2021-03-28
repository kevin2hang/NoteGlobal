import React, { Component } from 'react';
import database from '../database';

import '../styles/SearchCourses.css';

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
        // trimming doesn't work
        let school = this.state.school;
        let course = this.state.course;
        let trimmedSchool = school.trim();
        let trimmedCourse = course.trim();
        this.setState({
            school : trimmedSchool,
            course : trimmedCourse
        });

        if (this.state.school == '' || this.state.course == '')
            return;

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
            <div className="create">
                <form onSubmit={this.submit}>
                    Create a Course:
                    <input type="text" placeholder="School Name" value={this.state.school} onChange={this.handleSchoolChange} />
                    <input type="text" placeholder="Course name" value={this.state.course} onChange={this.handleCourseChange} />
                    <input className='btn' type="submit" />
                </form>
            </div>
        )
    }
}

export default CreateCourse;