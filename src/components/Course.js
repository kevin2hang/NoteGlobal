import React from 'react';
import database from '../database';

import { Route, Link, useRouteMatch } from 'react-router-dom';
import ContentGrouping from './ContentGrouping';

export const ContentGroupingPreview = (props) => {
  const { path, url } = useRouteMatch();

  return (
    <div>
      <Link to={url + '/' + props.name}>{props.name}</Link>
      <Route path={path + '/' + props.name} render={() =>
        <ContentGrouping path={props.dbPath} name={props.name} />}
      >
      </Route>
    </div>

  );
}

class Course extends React.Component {
  constructor(props) {
    super(props);

  }

  render() {
    return (
      <div className='course'>
        <h1>{this.props.schoolName} - {this.props.courseName}</h1>
        <div className='alt-course-name-display'>
          {this.props.altNames !== undefined ? this.props.altNames.map((name) => {
            <div className='alt-course-name'>{name}</div>
          }) : ''}
        </div>
        {database.ref(this.props.dbPath + 'notes/').on("value", (snapshot) => {
          snapshot.forEach(contentGrouping => {
            <ContentGroupingPreview
              dbPath={this.props.dbPath + '/notes/'}
              name={contentGrouping.key}
            />
          });
        })}
      </div>
    );
  }
}

export default Course;