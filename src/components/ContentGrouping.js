import React, { useEffect, useState, useRef } from 'react';
import database from '../database';
import { isSignedIn } from './localStorageFunctions';

import { Link } from "react-router-dom";

function ContentGrouping(props) {
  const dbPath = props.path + props.name + '/';
  const title = useState(props.name.split('-').join(' '));
  const [list, setList] = useState([]);
  const numPosts = useRef(0);

  useEffect(() => {
    let newList = [];
    database.ref(dbPath).on('value', (snapshot) => {
      snapshot.forEach(item => {
        if (item.val().fileUrl !== 'blank') {
          newList.push
            (<li>
              <Link to={`${dbPath + item.key}`}>{item.val().fileUrl}</Link>
            </li>);
          numPosts.current += 1;
        }
      })
    })
    setList(newList);
  }, [])

  return (
    <div>
      <h3>{title}</h3>
      <ul>
        {list}
      </ul>
      {numPosts.current === 0 ?
        <div>There are no notes yet.</div>
        :''
      }
    </div>
  )
}

export default ContentGrouping;