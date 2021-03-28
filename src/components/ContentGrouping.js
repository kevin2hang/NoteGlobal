import React, { useState } from 'react';
import database from '../database';
import { isSignedIn } from './localStorageFunctions';

function ContentGrouping(props) {
  const dbPath = props.path+props.name +'/';
  const title = useState(props.name.split('-').join(' '));


  return (
    <div>
      <h3>{title}</h3>      
      <ul>
        {database.ref(dbPath).on('value', (snapshot) => {
          snapshot.forEach(item => {
            <li>{item.val().filename}</li> // TODO: replace this with NotePost component
          })
        })}
      </ul>
    </div>
  )
}

export default ContentGrouping;