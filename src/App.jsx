import React, { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router'
import './App.css'
import SignIn from './components/sign__in'
import SignUp from './components/sign__up'
import ForgotPass from './components/forgot__pasword'
import Course from './components/coursePage/course'
import HtmlPage from './components/coursePage/html/html'
import CssPage from './components/coursePage/css/css'
import JavascriptPage from './components/coursePage/js/javascript'
import Lesson from './components/coursePage/html/lesson'

function App() {

const [isLoggedIn, setIsLoggedIn] = useState(Boolean(localStorage.getItem('token')))
  return (
    <Routes>
      <Route
        path="/sign__up"
        element={
          isLoggedIn
            ? <Navigate to="/course" replace />
            : <SignUp setIsLoggedIn={setIsLoggedIn} />
        }
      />      

      <Route
        path="/sign__in"
        element={
          isLoggedIn
            ? <Navigate to="/course" replace />
            : <SignIn setIsLoggedIn={setIsLoggedIn} />
        }
      />
      
      <Route
        path="/course"
        element={
        isLoggedIn
          ? <Course setIsLoggedIn={setIsLoggedIn} />
          : <Navigate to="/sign__up" replace />
        }
      />
      
      <Route
        path="/html"
        element={isLoggedIn ? <HtmlPage /> : <Navigate to="/sign__in" replace />}
      />
      
      <Route
        path="/forgot__pasword"
        element={isLoggedIn ? <ForgotPass /> : <Navigate to="/forgot__pasword" replace />}
      />

      <Route
        path="/css"
        element={isLoggedIn ? <CssPage /> : <Navigate to="/sign__in" replace />}
      />

      <Route
        path="/javascript"
        element={isLoggedIn ? <JavascriptPage /> : <Navigate to="/sign__in" replace />}
      />

      <Route
        path="*"
        element={<Navigate to={isLoggedIn ? "/course" : "/sign__up"} replace />}
        
        />

        <Route 
        path="/html/lesson/:id" 
        element={<Lesson />} 
        />
    </Routes>
  )
}

export default App
