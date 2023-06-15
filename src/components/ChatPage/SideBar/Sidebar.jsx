import { useAuth } from '../../../context/AuthContext'
import { useChat } from '../../../context/ChatContext'

import { useState, useEffect } from 'react'

import './Sidebar.css'

function Sidebar({ groupId, setGroupId }) {
    const { currentUser, userNameArr } = useAuth()
    const { currentUserGroups, createGroup, updateJoinedGroupInUser } = useChat();

    const username = userNameArr[0] + " " + userNameArr[1];
    const [formError, setFormError] = useState('');


    // NEW FEATURE FRIENDS
    // const friends = ['Dhan Raj', 'Tushit'];


    function handleAactiveGroup(e) {
        if (e.target.id == groupId) return;
        return setGroupId(e.target.id);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        const groupName = e.target.elements.group_name;

        try {
            if (groupName.value == '') return setFormError("Required a valid group name");
            else if (groupName.value.length < 3) return setFormError("Required atleast 3 letters");

            const groupRef = await createGroup(groupName.value);
            setFormError('')
            await updateJoinedGroupInUser(groupRef.id);
        } catch (err) {
            console.log(err)
        } finally {
            groupName.value = ''
        }
    }

    useEffect(() => {
        const dataModal = document.querySelector('[data-modal]')
        const openBtn = document.querySelector('[data-open-modal]')
        const closeBtn = document.querySelector('[data-close-modal]')

        const forClose = () => {
            setFormError('')
            dataModal.close()
        }
        closeBtn?.addEventListener('click', forClose)

        const forOpen = () => {
            dataModal.close()
            dataModal.showModal()
        }
        openBtn?.addEventListener('click', forOpen)

        const forModal = (e) => {
            const dialogDimensions = dataModal.getBoundingClientRect()
            if (
                e.clientX < dialogDimensions.left || e.clientX > dialogDimensions.right ||
                e.clientY < dialogDimensions.top || e.clientY > dialogDimensions.bottom
            ) {
                setFormError('')
                dataModal.close()
            }
        }
        dataModal?.addEventListener('click', forModal)

        return () => {
            closeBtn?.removeEventListener('click', forClose)
            openBtn?.removeEventListener('click', forOpen)
            dataModal?.removeEventListener('click', forModal)
        }
    }, [])

    return (
        <div className='chat-user-list'>
            {/* <button className='btn-random'>Random</button> */}

            {/* <Group groupType={'Group'} groupItems={groupNames} /> */}
            {/* <Group groupType={'Friends'} groupItems={friends} marginTop={'-0.5'} /> */}

            <div className="group-container">
                <span className='group-title'>
                    <h2>Groups</h2>

                    <button className='btn-add-group-item' data-open-modal>
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" className="bi bi-plus-circle" viewBox="0 0 16 16">
                            <path className='path-1' d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                            <path className='path-2' d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                        </svg>
                    </button>

                    <dialog className='dialog-container' data-modal>
                        <h3>Add new Group</h3>
                        {
                            formError &&
                            <p style={{ color: 'red' }}>{formError}</p>
                        }
                        <form className='dialog-form' onSubmit={handleSubmit}>
                            <input type="text" name='group_name' placeholder={`Type new Group name...`} />
                            <span className='form-btn-container'>
                                <button type="button" formMethod="dialog" data-close-modal>Close</button>
                                <button type='submit' formMethod='dialog' autoFocus>Add</button>
                            </span>
                        </form>
                    </dialog>
                </span>
                <ul className='group-list'>
                    {
                        currentUserGroups.map((item) => {
                            return (
                                <li className={item.id === groupId ? 'active' : ''} onClick={handleAactiveGroup} id={item.id} key={item.id}>{item.group_name}</li>
                            )
                        })
                    }
                </ul>
            </div>

            <div className='profile-container'>
                <a href='#' className='profile-person'>
                    {
                        currentUser ?
                            <img src={currentUser.photoURL} style={{ borderRadius: '50%', backgroundColor: 'rgb(71, 22, 163)' }} height={'30px'} width={'30px'} alt="🎈" />
                            :
                            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-person-circle" viewBox="0 0 16 16">
                                <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                                <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z" />
                            </svg>
                    }

                    {username}
                </a>
                <a href='#' className='profile-settings'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-gear" viewBox="0 0 16 16">
                        <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z" />
                        <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z" />
                    </svg>
                </a>
            </div>
        </div >
    )
}

export default Sidebar
