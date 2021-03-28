import React, { useEffect, useState, useRef } from 'react';
import database from '../database';

import { Link, useRouteMatch, useParams } from "react-router-dom";
import NotePost from './NotePost';
import UploadNote from './UploadNote';
import '../styles/Container.css'

function ContentGrouping(props) {
  const {path, url} = useRouteMatch();
  const dbPath = props.path + props.name + '/notes/';
  const title = useState(props.name.split('-').join(' '));
  const [list, setList] = useState([]);
  const numPosts = useRef(0);
  const params = useParams();

  useEffect(() => {
    let newList = [];
    database.ref(dbPath).on('value', (snapshot) => {
      snapshot.forEach(item => {
        // if (item.val().fileUrl !== 'blank') {
          newList.push
            (
              <div className="post-container">
                  <NotePost
                    school={params.school}
                    course={params.course}
                    folderName={params.folderName}
                    dbKey = {item.key}
                    url= {item.val().fileUrl}
                    title={item.val().filename}
                    rating= {item.val().ratingSum/item.val().numRatings}
                    posted = {new Date(item.val().postTimeMs)}
                  />
              </div>
              )
            // <li>
            //   <Link to={`${dbPath + item.key}`}>{item.val().fileUrl}</Link>
            // </li>
            
          numPosts.current += 1;
        // }
      })
      setList(newList);
    })
  }, [])

  return (
    <>
      <h3>{title}</h3>
      <UploadNote
        school={params.school}
        course={params.course}
        folderName={params.folderName} 
      />
      <ul>
        {list}
      </ul>
      {numPosts.current === 0 ?
        <div>There are no notes yet.</div>
        :''
      }
      <div style={{paddingBottom: "70px"}}>
        
      </div>
    </>
  )
}

export default ContentGrouping;