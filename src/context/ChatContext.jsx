import { createContext, useContext, useEffect, useState } from "react";

import {
    orderBy, addDoc, arrayUnion, collection, doc,
    onSnapshot, query, serverTimestamp, updateDoc, where
} from "firebase/firestore";

import { db } from "../firebase";
import { useAuth } from "./AuthContext";

const ChatContext = createContext();

export function useChat() {
    return useContext(ChatContext);
}

export function ChatProvider({ children }) {
    const { currentUser } = useAuth();

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

    // update joined_group array in user
    function updateJoinedGroupInUser(group_id) {
        return updateDoc(doc(userColRef, currentUser.uid), {
            joined_groups: arrayUnion(group_id),
        })
    }

    // send message with current user
    function createUserMessage(docRef, content) {
        const data = {
            created_at: serverTimestamp(),
            sender_id: currentUser.uid,
            content,
        }

        return addDoc(docRef, data);
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
        addUserToGroup,
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
