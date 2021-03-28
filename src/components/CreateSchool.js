import React, { Component } from 'react';
import database from '../database';

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
        console.log(this.state.school);
        if (!this.schoolExists(this.state.school)) {
            database.ref('schools/' + this.state.school + '/').push("example-course");
            this.props.readSchools();
        }
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
            <div>
                <form onSubmit={this.submit}>
                    Create a School: 
                    <input type="text" placeholder="School Name" onChange={this.handleChange} />
                    <input type="submit" />
                </form>
            </div>
        )
    }
}

export default CreateSchool;