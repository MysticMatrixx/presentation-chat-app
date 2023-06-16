import { useAuth } from '../../../context/AuthContext';
import { useChat } from '../../../context/ChatContext';

import { useEffect, useRef, useState } from 'react'

import SearchPeople from '../../SearchPeople/SearchPeople';
import './ChatSettings.css'

export default function ChatSettings({ groupId, groupInfo }) {
    const { currentUser } = useAuth();
    const { allUsers, deleteGroup } = useChat();

    const groupName = groupInfo.group_name;
    const [isDisable, setIsDisable] = useState(true);

    const isCurrentUserAdmin = (currentUser.uid === groupInfo?.owner_id);
    let listUsers = [];

    useEffect(() => {
        listUsers = []
    }, [groupId])

    async function handleDeleteGroup(e) {
        e.preventDefault();
        const groupName = e.target.elements.group_name;

        try {
            // console.log("GROUP DELETED")
            await deleteGroup(groupId);
            window.location.reload(false);
        } catch (err) {
            console.error("Can't Delete the group, Try Again later!");
        } finally {
            groupName.value = ''
        }
    }

    // function handleExitGroup() {
    //     return;
    // }

    useEffect(() => {
        const dataModal = document.querySelector('#delete-modal')
        const openBtn = document.querySelector('#open-delete-modal')
        const closeBtn = document.querySelector('#close-delete-modal')

        function forOpenDelete() {
            dataModal.showModal()
        }
        openBtn?.addEventListener('click', forOpenDelete)

        function forCloseDelete() {
            dataModal.close()
        }
        closeBtn?.addEventListener('click', forCloseDelete)

        const forDeleteModal = (e) => {
            const dialogDimensions = dataModal.getBoundingClientRect()
            if (
                e.clientX < dialogDimensions.left || e.clientX > dialogDimensions.right ||
                e.clientY < dialogDimensions.top || e.clientY > dialogDimensions.bottom
            ) {
                dataModal.close()
            }
        }
        dataModal?.addEventListener('click', forDeleteModal)

        return () => {
            closeBtn?.removeEventListener('click', forCloseDelete)
            openBtn?.removeEventListener('click', forOpenDelete)
            dataModal?.removeEventListener('click', forDeleteModal)
        }
    }, [])


    return (
        <>
            <div id='side-nav' className='chat-settings-container'>
                <div className='settings-title'>Group Settings</div>

                <div className='people-container'>
                    <span className='people-title'>Participants</span>
                    <ul className='people-list' >
                        {
                            allUsers?.map((item) => {
                                const isAdmin = (item.id === groupInfo.owner_id);
                                if (groupInfo.participants.includes(item.id))
                                    return (
                                        <li key={item.id} className={(isAdmin) ? 'admin' : 'not-admin'}>
                                            {
                                                (isAdmin) &&
                                                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" className="bi bi-emoji-sunglasses" viewBox="0 0 16 16">
                                                    <path d="M4.968 9.75a.5.5 0 1 0-.866.5A4.498 4.498 0 0 0 8 12.5a4.5 4.5 0 0 0 3.898-2.25.5.5 0 1 0-.866-.5A3.498 3.498 0 0 1 8 11.5a3.498 3.498 0 0 1-3.032-1.75zM7 5.116V5a1 1 0 0 0-1-1H3.28a1 1 0 0 0-.97 1.243l.311 1.242A2 2 0 0 0 4.561 8H5a2 2 0 0 0 1.994-1.839A2.99 2.99 0 0 1 8 6c.393 0 .74.064 1.006.161A2 2 0 0 0 11 8h.438a2 2 0 0 0 1.94-1.515l.311-1.242A1 1 0 0 0 12.72 4H10a1 1 0 0 0-1 1v.116A4.22 4.22 0 0 0 8 5c-.35 0-.69.04-1 .116z" />
                                                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-1 0A7 7 0 1 0 1 8a7 7 0 0 0 14 0z" />
                                                </svg>
                                            }
                                            <span className='li-item'>
                                                {item.first_name}
                                                {
                                                    item.photo ?
                                                        <img src={item.photo} style={{ borderRadius: '50%', backgroundColor: 'rgb(71, 22, 163)', textAlign: 'center' }} height={'30px'} width={'30px'} alt="🎈" />
                                                        :
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-person-circle" viewBox="0 0 16 16">
                                                            <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                                                            <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z" />
                                                        </svg>
                                                }
                                            </span>
                                        </li>
                                    )
                                else
                                    listUsers.push
                                        ({ value: item.id, label: item.first_name, icon: item.photo })
                            })
                        }
                    </ul>
                </div>
                <span className='people-find'>
                    <SearchPeople listUsers={listUsers} groupId={groupId} />
                </span>

                <div className='group-option-container'>
                    <span className='group-option-title'>Options</span>
                    <ul className="group-option-list">
                        {
                            isCurrentUserAdmin ?
                                <button id='open-delete-modal'><li>Delete Group</li></button>
                                : ""
                        }
                        {/*<button onClick={handleExitGroup}><li>Leave Group</li></button>*/}

                    </ul>

                    <dialog className='delete-dialog-container' id='delete-modal'>
                        <div className='delete-message'>
                            <h2> &#9888; Delete this group?</h2>
                            <p>
                                Doing so will permanently delete this group, including all its chat,
                                <br />removing all its joined users, with a page reload.
                            </p>
                        </div>
                        {/* {
                                formError &&
                                <p style={{ color: 'red' }}>{formError}</p>
                            } */}
                        <form className='delete-form' onSubmit={handleDeleteGroup}>
                            <p>Confirm you want to delete this group by typing its name: <strong>{groupName}</strong></p>
                            <input type="text" onChange={e => {
                                if (e.target.value === groupName)
                                    setIsDisable(false);
                                else if (!isDisable)
                                    setIsDisable(true);

                            }} name='group_name' placeholder={groupName} />
                            <span className='btn-form'>
                                <button type="button" className='btn-1' formMethod="dialog" id='close-delete-modal'>Cancel</button>
                                <button type='submit' className='btn-2' formMethod='dialog' disabled={isDisable}>Delete</button>
                            </span>
                        </form>
                    </dialog>
                </div>
            </div>
        </>
    )
}
