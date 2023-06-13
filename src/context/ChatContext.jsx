import { createContext, useContext, useEffect, useState } from "react";

import { addDoc, arrayUnion, collection, doc, onSnapshot, query, serverTimestamp, updateDoc, where } from "firebase/firestore";

import { db } from "../firebase";
import { useAuth } from "./AuthContext";

const ChatContext = createContext();

export function useChat() {
    return useContext(ChatContext);
}

export function ChatProvider({ children }) {
    const { currentUser } = useAuth();

    // const [currentUserInfo, setCurrentUserInfo] = useState();
    const [loading, setLoading] = useState(false)

    const userColRef = collection(db, 'user')
    const messageGroupColRef = collection(db, 'group')

    // useEffect(() => {
    //     // const q = query(userColRef, where(userColRef.id, '==', currentUser.id))
    //     const docRef = doc(userColRef, currentUser.uid);
    //     onSnapshot(docRef, (docSnap) => {
    //         setCurrentUserInfo({ ...docSnap.data(), id: docSnap.id })
    //         setLoading(false)
    //     })
    // }, [])

    // useEffect(() => {
    //     let users = [];
    //     // let ids = [];

    //     const unsubscribeUserList = onSnapshot(userColRef, (snap) => {
    //         snap.docs?.forEach(docUser => {
    //             let data = { ...docUser.data(), id: docUser.id };
    //             if (currentUser.uid == docUser.id) {
    //                 setCurrentUserInfo(data)
    //                 getGroupDoc(currentUser.uid)
    //             }
    //             users.push(data)
    //         })

    //         setUsersInfo(users);
    //         setLoading(false);
    //     });

    //     return unsubscribeUserList;
    // }, [])

    function createGroup(group_name) {
        const data = {
            created_at: serverTimestamp(),
            owner_id: currentUser.uid,
            group_name,
            participants: [currentUser.uid]
        }

        return addDoc(messageGroupColRef, data);
    }

    function updateCreatedGroupInUser(group_id) {
        const currentUserRef = doc(db, 'user', currentUser.uid)
        return updateDoc(currentUserRef, {
            joined_groups: arrayUnion(group_id),
        })
    }

    function createUserMessage(docRef, content) {
        const data = {
            created_at: serverTimestamp(),
            sender_id: currentUser.uid,
            content,
        }

        return addDoc(docRef, data);
    }

    // function getGroupDoc(doc_id) {
    //     const q = query(messageGroupColRef,
    //         // where("creater_id", "==", doc_id),
    //         where("participants", "array-contains", doc_id))
    //     getDocs(q).then((snap) => snap.docs.forEach((item) => console.log(item.data())))
    // }

    // function getGroupNames() {
    //     let names = [];
    //     let ids = [...currentUserInfo.joined_groups, ...currentUserInfo.created_groups]

    //     ids.forEach(async (id) => {
    //         const snap = await getDoc(doc(messageGroupColRef, id));
    //         let data = snap.data();
    //         names.push({ name: data.group_name, id: snap.id })
    //     })
    // console.log(names)
    //     return names;
    // }

    // console.log(currentUserInfo)
    // console.log(userInfo)
    // console.log(messageColInfo)

    const value = {
        messageGroupColRef,
        createGroup, createUserMessage, updateCreatedGroupInUser,
    };

    return (
        <ChatContext.Provider value={value}>
            {!loading && children}
        </ChatContext.Provider>
    );
}
