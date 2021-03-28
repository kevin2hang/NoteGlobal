import React, { useEffect, useState } from 'react';
import database from '../database';

import { Route, Link, useRouteMatch, useParams } from 'react-router-dom';
import ContentGrouping from './ContentGrouping';
import { isSignedIn, getGoogleId, getEmail } from './localStorageFunctions';

export const ContentGroupingPreview = (props) => {
  const { path, url } = useRouteMatch();

  return (
    <div>
      <Link to={url + '/' + props.folderName}>{props.folderName}</Link>
      <Route path={path + '/' + props.folderName} render={() =>
        <ContentGrouping path={props.dbPath} name={props.folderName} />}
      >
      </Route>
    </div>

  );
}

const Course = (props) => {
  const params = useParams();
  const dbPath = `gen/${params.school}/courses/${params.course}/notes/`;
  const [newContentGrouping, setNewContentGrouping] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [folders, setFolders] = useState([]);

  const doesNotContain = (folderName) => {
    for (let i = 0; i < folders.length; i++) {
      if (folders[i].folderName === folderName) {
        return false;
      }
    }
    return true;
  }
  const updateFolders = () => {
    database.ref(dbPath).on("value", (contentGroupings) => {
      contentGroupings.forEach(contentGrouping => {
        if (doesNotContain(contentGrouping.key)){
          const copyFolders = folders;
          copyFolders.push(
          {
            dbPath: dbPath,
            folderName: contentGrouping.key,
          });
          setFolders(copyFolders)
        }
      });
    })
  }

  const addContentGrouping = () => {
    const blankNotePost = {
      'fileUrl': 'blank',
    };
    database.ref(dbPath+newContentGrouping+'/').push(blankNotePost);
    setNewContentGrouping('');
    setShowAddForm(false);
    updateFolders();
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
      {folders.map((obj) => <ContentGroupingPreview {...obj} /> )}
      {/* {database.ref(dbPath).on("value", (contentGroupings) => {
        contentGroupings.forEach(contentGrouping => {
          <ContentGroupingPreview
            dbPath={dbPath}
            name={contentGrouping.key}
          />
        });
      })} */}
      { !showAddForm ? 
        <button class='show-add-content-grouping-form' onClick={toggleShowButton}>Add New Folder</button>
        : ''
      }
      { showAddForm ? 
        <div className='add-content-grouping-form'>
            <input className='add-content-grouping-input' value={newContentGrouping} onChange={handleChange} />
            <button className onClick={addContentGrouping}>Add New Folder</button>
        </div>
        : ''
      }
    </div>
  );

}

export default Course;