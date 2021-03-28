import React, { useEffect, useState } from 'react';
import database from '../database';
import { isSignedIn } from './localStorageFunctions';

import {Link} from  "react-router-dom";

function ContentGrouping(props) {
  const dbPath = props.path+props.name +'/';
  const title = useState(props.name.split('-').join(' '));
  const [list, setList] = useState([]);

  useEffect(()=>{
    let newList = [];
    database.ref(dbPath).on('value', (snapshot) => {
      snapshot.forEach(item => {
        newList.push
        (<li>
            <Link to={`${dbPath + item.key}`}>{item.val().displayName}</Link>
        </li>)
      })
    })
    setList(newList);
  },[])

  return (
    <div>
      <h3>{title}</h3>      
      <ul>
        {list}
      </ul>
    </div>
  )
}

export default ContentGrouping;