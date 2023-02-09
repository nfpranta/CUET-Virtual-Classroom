import image from '../images/1.jpg'
import styles from '../my_style.module.css'
import SendIcon from "@mui/icons-material/Send";
import PeopleIcon from '@mui/icons-material/People';
import { Box, Button, Paper, TextField,Typography } from '@mui/material';
import { useState } from 'react';
import {
    addDoc,
    collection,
    doc,
    getDocs,
    updateDoc,
  } from "firebase/firestore";
import { db } from '../firebase';
import { useEffect } from 'react';
function Comment({post, user}){
   
    const [newComment, setNewComment]=useState("");
    const [comments, setComments]=useState([]);
    const commentsCollectionRef = collection(db, "comments");
    useEffect(() => {
        const getComments = async()=>{
            const data = await getDocs(commentsCollectionRef);
            const commentData = data.docs.map((doc)=>({...doc.data(), id:doc.id}));
            commentData.sort((a,b)=>{
      
            let a1=Number(Date.parse(a['date']));
            let b1=Number(Date.parse(b['date']));
            
            if(a1>b1)
                return -1;
            else if(a1<b1)
                return 1; 
            });
            setComments(commentData);
        }
        getComments();
    },[]);
   
    const createComment =async() =>{
        
        const date = new Date();
        console.log("date == ",date);
        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();
        let hour = date.getHours();
        let minute = date.getMinutes();
        let second = date.getSeconds();
        let currentDate = `${day}-${month}-${year}, ${hour}:${minute}:${second}`;
        const c={date: currentDate, postid:post.id, userDp: user.dp, userName:user.name, comment:newComment};
        await addDoc(commentsCollectionRef, c);
        let commentData =[...comments, c];

        commentData.sort((a,b)=>{
      
            let a1=Number(Date.parse(a['date']));
            let b1=Number(Date.parse(b['date']));
            
            if(a1>b1)
                return -1;
            else if(a1<b1)
                return 1; 
            });
        setComments(commentData);
        setNewComment("");
    };
    
    return(
        <div>
            <Box sx={{display: 'flex', alignItems:'center'}}>
                <PeopleIcon/>
                <Typography sx={{mt:1, ml:2}} variant="subtitle1" gutterBottom>
                Class comments
                </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems:'center' ,mt:2 }}>
                <img className={styles.shareProfileImg} src={user.dp} alt=""/>
                <TextField sx={{borderRadius:100 ,height:55}} fullWidth id="input-with-sx" label="Add class comment..." variant="outlined" value={newComment} onChange={(e)=>setNewComment(e.target.value)}/>
                <Button variant="contained" sx={{height:55}} onClick={createComment}><SendIcon/></Button>
            </Box>
            
        </div>
    )
}
export default Comment;