import React, { Component } from 'react';
import database from '../database';
import { Redirect } from 'react-router-dom'
import CreateSchool from './CreateSchool';
import CreateCourse from './CreateCourse';

import '../styles/SearchCourses.css';

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

        // this.readSchools()
    }

    // componentDidUpdate(prevProps, prevState, snapshot) {
    //     if (prevState.schools.length != this.state.schools.length) {
    //         this.readSchools();
    //     }
    // }

    componentDidMount() {
        this.readSchools()
    }

    readSchools = () => {
        let newSchools = this.state.schools;
        database.ref('schools/').on("value", (snapshot) => {
            let i = 0;
            snapshot.forEach(school => {
                if (i == 0) {
                    this.setState({ 
                        school: school.key 
                    });
                }
                if (!this.schoolsContains(school.key))
                    newSchools.push(school.key);
                i++;
            })
            this.setState({schools: newSchools})
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

        let newCourses = this.state.courses;
        database.ref('schools/' + school + '/').on("value", (snapshot) => {
            let i = 0;
            snapshot.forEach(course => {
                if (i == 0) {
                    this.setState({ course: course.val() })
                }
                if (!this.coursesContains(course.val()))
                    newCourses.push(course.val());
                i++;
            })
            this.setState({
                courses: newCourses
            })
        });
    }

    coursesContains = (course) => {
        for (let i = 0; i < this.state.courses.length; i++) {
            if (course == this.state.courses[i])
                return true;
        }
        return false;
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
            this.setState({
                waitingFor: 'course'
            });
            this.readCourses(this.state.school);
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
                {this.state.waitingFor == 'course' && <button id="backBtn" className="btn btn-secondary" onClick={this.moveBack}>Back</button>}
                {this.state.waitingFor == 'school' &&
                    <div className="dropdownForm">

                        <form onSubmit={this.schoolSubmit}>
                            <label>Choose a school (or create one if yours isn't there): </label>

                            <select value={this.state.school} id="schoolSelector" onChange={this.handleSchoolChange} value={this.state.school}>
                                {this.state.schools.map(school => {
                                    return <option value={school}>{school}</option>
                                })}
                            </select>
                            <input className="submitBtn btn btn-primary" type="submit" value="Submit" />
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
                            <input className="submitBtn btn btn-primary" type="submit" value="Submit" />
                        </form>

                        <CreateCourse school={this.state.school}/>
                    </div>
                }
                {this.state.waitingFor == 'nothing' &&
                  <Redirect to={`/${this.state.school}/${this.state.course}`}/>
                    // <Link to={`/${this.state.school}/${this.state.course}`}>Move on to {`/${this.state.school}/${this.state.course}`}</Link>
                    }
            </div>
        );
    };
}

export default SearchCourses;