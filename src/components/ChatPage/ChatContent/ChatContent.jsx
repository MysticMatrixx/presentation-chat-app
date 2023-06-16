import { useAuth } from '../../../context/AuthContext';
import { useChat } from '../../../context/ChatContext';

import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../../../firebase';

import { useEffect, useState } from 'react';
import './ChatContent.css';

export default function ChatContent({ groupId }) {
    const [currentFileToUpload, setCurrentFileToUpload] = useState(null);
    const [roomMessages, setRoomMessages] = useState([]);

    const scrollItDown = document.getElementById('dummy')

    const { currentUser } = useAuth();
    const { createUserMessage } = useChat();
    const groupMessageRef = collection(db, `group/${groupId}/messages`);
    const q = query(groupMessageRef, orderBy('created_at', 'asc'))

    //For Realtime Messages
    useEffect(() => {
        const unsub = onSnapshot(q, (docSnap) => {
            let message = []

            docSnap.docs.forEach((doc) => {
                message.push({ ...doc.data(), id: doc.id, created_at: doc.data().created_at.toDate().toLocaleTimeString('hi-IN', { hour: '2-digit', minute: '2-digit' }), })
            })
            // console.log(message);
            setRoomMessages(message);
            // console.log(message)
        })
        return () => unsub()
    }, [groupId])

    useEffect(() => {
        scrollItDown?.scrollIntoView({ behavior: 'smooth' })
    }, [roomMessages])

    function setMessages(item) {
        const isCurrentUser = (item.sender_id == currentUser.uid);
        // let firestoreTime = new Date(item && item?.created_at?.seconds);

        return (
            <div className={`chat-content  ${isCurrentUser ? 'sender' : 'reciever'}`} key={item.id}>
                <span className='profile'>
                    {
                        isCurrentUser ?
                            <img src={currentUser.photoURL} style={{ borderRadius: '50%', backgroundColor: 'transparent' }} height={'30px'} width={'30px'} alt="🎈" />
                            :
                            <img src={item.photo} style={{ borderRadius: '50%', backgroundColor: 'transparent' }} height={'30px'} width={'30px'} alt="🎈" />
                        // <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-person-circle" viewBox="0 0 16 16">
                        //     <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                        //     <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z" />
                        // </svg>
                    }
                </span>
                <p className='message'>
                    {(item.content).trim()}
                    <small className='user-info' >{item.first_name} &#x2022; {item.created_at}</small>
                </p>
            </div >
        )
    }

    async function handleAddMessage(e) {
        e.preventDefault();

        if (currentFileToUpload) return console.log("FILE NEEDS TO BE UPLOADED");

        const content = e.target.elements.content;

        try {
            if (content.value == '') return;

            await createUserMessage(groupMessageRef, content.value);
        } catch (err) {
            console.log(err)
        } finally {
            content.value = ''
        }
    }

    function changeTextArea(e) {
        const messageInput = document.querySelector('.message-box');

        const name = e.target.files[0].name;
        const type = e.target.files[0].type;
        let innerText = `Filename: ${name} \nType: `;

        messageInput.setAttribute('disabled', true);

        if (type == 'application/vnd.openxmlformats-officedocument.presentationml.presentation' || type == 'application/vnd.ms-powerpoint')
            innerText += 'Presentation'
        else if (type == 'image/png' || type == 'image/jpg' || type == 'image/jpeg')
            innerText += 'Image'
        else if (type == 'image/gif')
            innerText += 'GIF'
        else if (type == 'application/pdf')
            innerText += 'PDF'
        else
            innerText += type

        messageInput.innerHTML = innerText

        setCurrentFileToUpload(e.target.files[0])
    }

    return (
        <div className='chat-content-container'>
            <div className='scrollable-container'>
                {
                    roomMessages.map((item) => {
                        return setMessages(item)
                    })
                }
                <div id='dummy'></div>
            </div>

            <form className='input-message-container' onSubmit={handleAddMessage}>
                <div className='btn-camera'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" fill="currentColor" className="bi bi-camera-fill" viewBox="0 0 16 16">
                        <path style={{ color: "rgb(130, 88, 206)" }} d="M10.5 8.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z" />
                        <path d="M2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4H2zm.5 2a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1zm9 2.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0z" />
                    </svg>
                    <input type='file' accept="image/png, image/jpeg, image/gif , application/pdf, .pptx, .ppt" onChange={changeTextArea} />
                </div>
                <textarea className='message-box' name="content" placeholder='Type your message here...' disabled={false} autoFocus={true}></textarea>
                {/* <a href="#" className='btn-emoji' >
                        <svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" fill="currentColor" className="bi bi-emoji-smile" viewBox="0 0 16 16">
                            <path style={{ color: "rgb(130, 88, 206)" }} d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                            <path d="M4.285 9.567a.5.5 0 0 1 .683.183A3.498 3.498 0 0 0 8 11.5a3.498 3.498 0 0 0 3.032-1.75.5.5 0 1 1 .866.5A4.498 4.498 0 0 1 8 12.5a4.498 4.498 0 0 1-3.898-2.25.5.5 0 0 1 .183-.683zM7 6.5C7 7.328 6.552 8 6 8s-1-.672-1-1.5S5.448 5 6 5s1 .672 1 1.5zm4 0c0 .828-.448 1.5-1 1.5s-1-.672-1-1.5S9.448 5 10 5s1 .672 1 1.5z" />
                        </svg>
                    </a> */}
                <button className='btn-send'>
                    Send
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-send-fill" viewBox="0 0 16 16">
                        <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083l6-15Zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471-.47 1.178Z" />
                    </svg>
                </button>
            </form>
        </div>
    )
}
