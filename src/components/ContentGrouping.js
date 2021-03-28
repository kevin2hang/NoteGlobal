import React, { useState } from 'react';
import database from '../database';
import { isSignedIn } from './localStorageFunctions';

function ContentGrouping(props) {
  const dbPath = props.path+props.name +'/';
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(props.name.split('-').join(' '));

  const displayTitle = () => {
    return editing 
      ? <input value={title} onChange={(e)=>setTitle(e.target.value)}></input>
      : <span>{title}</span>
  }

  return (
    <div>
      <h3>{displayTitle()}</h3>
      {isSignedIn() && <button onClick={()=>setEditing(!editing)}> Edit title </button>}
      
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