import { createContext, useContext, useEffect, useState } from "react";

import {
    orderBy, addDoc, arrayUnion, arrayRemove, collection, doc,
    onSnapshot, query, serverTimestamp, updateDoc, where, deleteDoc
} from "firebase/firestore";

import { db } from "../firebase";
import { useAuth } from "./AuthContext";

const ChatContext = createContext();

export function useChat() {
    return useContext(ChatContext);
}

export function ChatProvider({ children }) {
    const { currentUser, userNameArr } = useAuth();

    const userColRef = collection(db, 'user')
    const messageGroupColRef = collection(db, 'group')

    const [loading, setLoading] = useState(true)
    const [allUsers, setAllUsers] = useState([]);
    const [currentUserGroups, setCurrentUserGroups] = useState([]);

    // Current user's all groups (joined & created both).
    useEffect(() => {
        const q = query(messageGroupColRef,
            where('participants', 'array-contains', currentUser.uid),
            orderBy('created_at', 'desc'))

        const unsub = onSnapshot(q, (docSnap) => {
            let groups = []

            docSnap.docs.forEach((doc) => {
                groups.push({ ...doc.data(), id: doc.id })
            })

            setCurrentUserGroups(() => groups);
            setLoading(false);
        })
        return () => unsub();
    }, [])

    // All users with the required informations
    useEffect(() => {
        const unsub = onSnapshot(userColRef, (docSnap) => {
            let users = []

            docSnap.docs.forEach((doc) => {
                users.push({ ...doc.data(), id: doc.id })
            })
            setAllUsers(() => users);
        })
        return () => unsub();
    }, [])

    // create a group by the current user
    function createGroup(group_name) {
        const data = {
            created_at: serverTimestamp(),
            owner_id: currentUser.uid,
            group_name,
            participants: [currentUser.uid]
        }

        return addDoc(messageGroupColRef, data);
    }

    // send message with current user
    function createUserMessage(docRef, content, type) {
        // const date = new Date();
        const data = {
            created_at: serverTimestamp(),
            // created_at: date.toLocaleTimeString('hi-IN', { hour: '2-digit', minute: '2-digit' }),
            sender_id: currentUser.uid,
            photo: currentUser.photoURL,
            first_name: userNameArr[0],
            type,
            content,
        }

        return addDoc(docRef, data);
    }

    // FOR NOW : Delete only if Current user is the Group owner
    function deleteGroup(groupId) {
        const groupRef = doc(messageGroupColRef, groupId);
        return deleteDoc(groupRef)
    }

    // update joined_group array in user
    function updateJoinedGroupInUser(group_id, user_id = '') {
        return updateDoc(doc(userColRef, user_id ? user_id : currentUser.uid), {
            joined_groups: arrayUnion(group_id),
        })
    }

    // update joined_group array in user and participants in group
    function leaveJoinedGroup(group_id, user_id) {
        return (
            updateDoc(doc(userColRef, user_id), {
                joined_groups: arrayRemove(group_id),
            }),

            updateDoc(doc(messageGroupColRef, group_id), {
                participants: arrayRemove(user_id),
            })
        )
    }

    // add the user_id to group's participant field
    function addUserToGroup(groupId, userId) {
        const groupRef = doc(messageGroupColRef, groupId);
        updateDoc(groupRef, {
            participants: arrayUnion(userId),
        })
    }

    const value = {
        messageGroupColRef, userColRef, currentUserGroups, allUsers,
        createGroup, createUserMessage, updateJoinedGroupInUser,
        addUserToGroup, deleteGroup, leaveJoinedGroup,
    };

    return (
        <ChatContext.Provider value={value}>
            {
                !loading ?
                    children
                    :
                    <h1 style={{ textAlign: 'center' }}>Loading...</h1>
            }
        </ChatContext.Provider>
    );
}
