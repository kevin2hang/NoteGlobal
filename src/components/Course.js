import React, { useEffect, useState } from 'react';
import database from '../database';

import '../styles/Course.css';

import { Route, Link, useRouteMatch, useParams } from 'react-router-dom';
import ContentGrouping from './ContentGrouping';
import { isSignedIn, getGoogleId, getEmail } from './localStorageFunctions';

export const ContentGroupingPreview = (props) => {
  const { path, url } = useRouteMatch();

  return (
    <div className='content-grouping-preview'>
      <Link to={url + '/' + props.folderName}>{props.folderName}</Link>
    </div>

  );
}

const Course = (props) => {
  const params = useParams();
  const dbPath = `gen/${params.school}/courses/${params.course}/notes/`;
  const [newContentGrouping, setNewContentGrouping] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [folders, setFolders] = useState([]);

  const updateFolders = () => {
    database.ref(dbPath).on("value", (contentGroupings) => {
      const copyFolders = [];
      contentGroupings.forEach(contentGrouping => {
        copyFolders.push(
        {
          dbPath: dbPath,
          folderName: contentGrouping.key,
        });
      });
      setFolders(copyFolders)
    })
  }

  const addContentGrouping = () => {
    if (newContentGrouping === '' || newContentGrouping.trim() === '') return false;
    database.ref(dbPath).on("value", (contentGroupings) => {
      contentGroupings.forEach(contentGrouping => {
        if (contentGrouping.key == newContentGrouping) {
           return false;
        }
      })
    });
    const contentGroupingObj = {
      'googleId': getGoogleId(),
      'email': getEmail(),
      postTimeMs: Date.now()
    };
    database.ref(dbPath+newContentGrouping+'/').set(contentGroupingObj);
    setNewContentGrouping('');
    setShowAddForm(false);
    updateFolders();
    return true;
  }

  const toggleShowButton = () => {
    setShowAddForm(!showAddForm);
  }

  const handleChange = (event) => {
    setNewContentGrouping(event.target.value);
  }

  useEffect(() => {
    updateFolders();
  }, [])
  return (
    <div className='course'>
      <h1>{params.school} - {params.course}</h1>
      <div className='alt-course-name-display'>
        {props.altNames !== undefined ? props.altNames.map((name) => {
          <div className='alt-course-name'>{name}</div>
        }) : ''}
      </div>
      <div className='folders'>
        {folders.map((obj) => <ContentGroupingPreview {...obj} /> )}
      </div>
      { !showAddForm ? 
        <button class='show-add-content-grouping-form btn btn-primary' onClick={toggleShowButton}>Add New Folder</button>
        : ''
      }
      { showAddForm ? 
        <div className='add-content-grouping-form'>
            <input className='add-content-grouping-input form-control' value={newContentGrouping} onChange={handleChange} />
            <button className='btn btn-primary' onClick={addContentGrouping}>Add New Folder</button>
        </div>
        : ''
      }
    </div>
  );

}

export default Course;