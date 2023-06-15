import { useChat } from '../../context/ChatContext'

import React, { useState } from 'react'
import Select, { components } from 'react-select'

import './SearchPeople.css'

export default function SearchPeople({ listUsers, groupId }) {
    // const { Options } = components;
    const { addUserToGroup } = useChat()

    const [currentValue, setCurrentValue] = useState([]);
    const [isDisabled, setIsDisabled] = useState(false);

    // const listUsersOption = props => (
    //     <Options {...props} >
    //         <img src={props.data.icon} alt="🎈" />
    //         {props.data.label}
    //     </Options>
    // )

    async function handleAddUser(e) {
        try {
            setIsDisabled(true)
            await addUserToGroup(groupId, e.value)
            setCurrentValue([])
        } catch (err) {
            console.log(err);
        } finally {
            setIsDisabled(false)
        }
    }

    return (
        <>
            <Select
                className='list-people'
                isDisabled={isDisabled}
                isSearchable={true}
                value={currentValue}
                name="participant"
                onChange={e => { setCurrentValue({ ...e }); handleAddUser(e); }}
                options={listUsers}
            // components={{ Option: listUsersOption }}
            />
        </>
    )
}
