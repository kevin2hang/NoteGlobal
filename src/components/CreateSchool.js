import React, { Component } from 'react';
import database from '../database';

import '../styles/SearchCourses.css';


class CreateSchool extends Component {
    constructor(props) {
        super(props);
        this.state = {
            school: ''
        }
    };

    handleChange = (e) => {
        this.setState({
            school: e.target.value
        })
    };

    submit = (e) => {
        e.preventDefault();
        // console.log(this.state.school);

        // trimming doesn't work
        let school = this.state.school;
        let trimmedSchool = school.trim();
        // console.log(trimmedSchool);
        this.setState({
            school : trimmedSchool
        });

        if (this.state.school == '')
            return;
        if (!this.schoolExists(this.state.school)) {
            database.ref('schools/' + this.state.school + '/').push("example-course");
            database.ref('gen/' + this.state.school + '/').set({
                'alternate-names': {},
                courses: {
                    'example-course': {
                        'alternate-names' : 'ex-course',
                        'notes': {},
                        'verifiedAdmins': { '0': '02347407531' },
                        'requestAdminPrivilegeUsers': { '1': '835698735' }
                    },
                }
            })
            this.props.readSchools();
        }

        this.setState({
            school : ''
        })
    };

    schoolExists = (school) => {
        database.ref('schools/').on("value", (snaphsot) => {
            snaphsot.forEach(data => {
                if (data.key == school) return true;
            })
        })
        return false;
    };

    render() {
        return (
            <div className="create">
                <form onSubmit={this.submit}>
                    Create a School:
                    <input className="form-control" type="text" placeholder="School Name" value={this.state.school} onChange={this.handleChange} />
                    <input className='submitBtn btn btn-primary' type="submit" />
                </form>
            </div>
        )
    }
}

export default CreateSchool;