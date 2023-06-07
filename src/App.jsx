import { useEffect, useState } from 'react'
import { AuthProvider } from './context/AuthContext'
import { Routes, Route } from 'react-router-dom'


import PrivateRoute from './components/PrivateRoute'
import { ChatPage } from './components/ChatPage/ChatPage'
import { LoginPage } from './components/LoginPage/LoginPage'
import { Navbar } from './components/Navbar/Navbar'
import { NotFound } from './components/NotFound/NotFound'

import './App.css'
function App() {
  // const [pageNow, setPageNow] = useState("")

  return (
    <AuthProvider>
      <Navbar />
      <div id='PageView'>
        <Routes>
          <Route path='/' element={
            <PrivateRoute>
              <ChatPage />
            </PrivateRoute>
          } />
          {/* <PrivateRoute path='/' component={ChatPage} /> */}
          <Route path='/auth' element={<LoginPage />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </div>
    </AuthProvider>
  )
}

export default App
