import React, { Component } from 'react';
import database from '../database';
import { Link } from 'react-router-dom'
import CreateSchool from './CreateSchool';
import CreateCourse from './CreateCourse';

class SearchCourses extends Component {
    constructor(props) {
        super(props);

        this.state = {
            school: 'UCLA',
            course: '',
            waitingFor: 'school',
            schools: [],
            courses: []
        }
    }


    componentDidMount() {
        this.readSchools()
    }

    readSchools = () => {
        let newSchools = [];
        database.ref('schools/').on("value", (snapshot) => {
            let i = 0;
            snapshot.forEach(school => {
                if (i == 0) {
                    this.setState({ school: school.key });
                }
                if (!this.schoolsContains(school.key))
                    newSchools.push(school.key);
                i++;
            })
        })

        this.setState({
            schools: newSchools
        })
    }
    schoolsContains = (school) => {
        for (let i = 0; i < this.state.schools.length; i++) {
            if (school == this.state.schools[i])
                return true;
        }
        return false;
    }

    readCourses = (school) => {
        if (school == '')
            return;

        let newCourses = [];
        database.ref('schools/' + school + '/').on("value", (snapshot) => {
            let i = 0;
            snapshot.forEach(course => {
                if (i == 0) {
                    this.setState({ course: course.val() })
                }
                console.log(course.val())
                newCourses.push(course.val());
                i++;
            })
        });

        this.setState({
            courses: newCourses
        })
    }

    handleSchoolChange = (e) => {
        this.setState({
            school: e.target.value
        })
    }

    handleCourseChange = (e) => {
        this.setState({
            course: e.target.value
        })
    }

    schoolSubmit = (e) => {
        e.preventDefault();
        console.log(e);

        this.readCourses(this.state.school);

        this.setState({
            waitingFor: 'course',
        })
    }

    courseSubmit = (e) => {
        e.preventDefault();

        this.setState({
            waitingFor: 'nothing'
        })
    }

    moveBack = () => {
        if (this.state.waitingFor == 'nothing') {
            this.readCourses(this.state.school);
            this.setState({
                waitingFor: 'course'
            });
        }
        else if (this.state.waitingFor == 'course') {

            this.setState({
                waitingFor: 'school',
            });
        }
    }

    render() {
        return (
            <div>
                <button id="backBtn" onClick={this.moveBack}>Back</button>
                {this.state.waitingFor == 'school' &&
                    <div className="dropdownForm">

                        <form onSubmit={this.schoolSubmit}>
                            <label>Choose a school (or create one if your's isn't there): </label>

                            {console.log(this.state.school)}
                            <select value={this.state.school} id="schoolSelector" onChange={this.handleSchoolChange} value={this.state.school}>
                                {this.state.schools.map(school => {
                                    return <option value={school}>{school}</option>
                                })}
                            </select>
                            <input type="submit" value="Submit" />
                        </form>

                        <CreateSchool readSchools={this.readSchools} />
                    </div>
                }

                {this.state.waitingFor == 'course' &&
                    <div className="dropdownForm">

                        <form onSubmit={this.courseSubmit}>
                            <label>Choose a course (or create one if your's isn't there): </label>

                            <select value={this.state.course} id="courseSelector" onChange={this.handleCourseChange} value={this.state.course}>
                                {this.state.courses.map(course => {
                                    return <option value={course}>{course}</option>
                                })}
                            </select>
                            <input type="submit" value="Submit" />
                        </form>

                        <CreateCourse />
                    </div>
                }
                {this.state.waitingFor == 'nothing' &&
                    <Link to={`/${this.state.school}/${this.state.course}`}>Move on to {`/${this.state.school}/${this.state.course}`}</Link>}
            </div>
        );
    };
}

export default SearchCourses;