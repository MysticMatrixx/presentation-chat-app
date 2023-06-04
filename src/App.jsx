// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import { useState } from 'react'

import { ChatPage } from './components/ChatPage/ChatPage'
import { LoginPage } from './components/LoginPage/LoginPage'
import { Navbar } from './components/Navbar/Navbar'
import './App.css'

function App() {
  const [pageNow, setPageNow] = useState("")
  const [userLoggedIn, setUserLoggedIn] = useState(false)

  return (
    <>
      <Navbar userLoggedIn={userLoggedIn} setPageNow={setPageNow} />
      <div id='PageView'>
        {pageNow === "ChatPage" ? <ChatPage /> : <LoginPage />}
      </div>
    </>
  )
}

export default App
