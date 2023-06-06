import { useEffect, useState } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext'

import { ChatPage } from './components/ChatPage/ChatPage'
import { LoginPage } from './components/LoginPage/LoginPage'
import { Navbar } from './components/Navbar/Navbar'
import './App.css'

function App() {
  const [pageNow, setPageNow] = useState("")
  const [userLoggedIn, setUserLoggedIn] = useState(false)

  // useEffect(() => {
  //   return () => {
  //     auth?.currentUser != null ? setUserLoggedIn(true) : setUserLoggedIn(false)
  //   };
  // }, [userLoggedIn, pageNow]);

  return (
    <AuthProvider>
      <Navbar userLoggedIn={userLoggedIn} setPageNow={setPageNow} />
      <div id='PageView'>
        {pageNow === "ChatPage" ? <ChatPage /> : <LoginPage />}
      </div>
    </AuthProvider>
  )
}

export default App
