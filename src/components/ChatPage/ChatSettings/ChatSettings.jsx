import './ChatSettings.css'

export default function ChatSettings({ groupId }) {
    return (
        <>
            <div id='side-nav' className='chat-settings-container'>
                <div className='settings-title'>Group Settings</div>

                <div className='people-container'>
                    <span className='people-title'>Participants</span>
                    <ul className='people-list'>
                        <li>Raj
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-person-circle" viewBox="0 0 16 16">
                                <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                                <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z" />
                            </svg>
                        </li>
                        <li>Tushit
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-person-circle" viewBox="0 0 16 16">
                                <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                                <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z" />
                            </svg>
                        </li>

                    </ul>
                    <span className='people-find'>
                        <input type="search" placeholder='Add participant...' />
                    </span>
                </div>

                <div className='group-option-container'>
                    <span className='group-option-title'>Options</span>
                    <ul className="group-option-list">
                        <button><li>Delete Group</li></button>
                    </ul>
                </div>
            </div>
        </>
    )
}
