
import React, { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router'
import './App.css'

import SignIn from './components/sign__in'
import SignUp from './components/sign__up'
import ForgotPass from './components/forgot__pasword'

import Course from './components/coursePage/course'

import HtmlPage from './components/coursePage/html/html'
import CssPage from './components/coursePage/css/css'
import JavascriptPage from './components/coursePage/js/Javascript'

import Lesson from './components/coursePage/html/lesson'
import Lessons from './components/coursePage/lessons'
import LessonsJS from './components/coursePage/lessonsJS'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    Boolean(localStorage.getItem('token'))
  )

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

      <Route path="/forgot__pasword" element={<ForgotPass />} />

      <Route
        path="/course"
        element={
          isLoggedIn
            ? <Course setIsLoggedIn={setIsLoggedIn} />
            : <Navigate to="/sign__in" replace />
        }
      />

      {/* HTML */}
      <Route path="/html" element={isLoggedIn ? <HtmlPage /> : <Navigate to="/sign__in" replace />} />
      <Route path="/html/lesson/:id" element={isLoggedIn ? <Lesson /> : <Navigate to="/sign__in" replace />} />

      {/* CSS */}
      <Route path="/css" element={isLoggedIn ? <CssPage /> : <Navigate to="/sign__in" replace />} />
      <Route path="/css/lesson/:id" element={isLoggedIn ? <Lessons /> : <Navigate to="/sign__in" replace />} />

      {/* JavaScript */}
      <Route path="/javascript" element={isLoggedIn ? <JavascriptPage /> : <Navigate to="/sign__in" replace />} />
      <Route path="/javascript/lesson/:id" element={isLoggedIn ? <LessonsJS /> : <Navigate to="/sign__in" replace />} />

      <Route
        path="*"
        element={
          <Navigate
            to={isLoggedIn ? "/course" : "/sign__up"}
            replace
          />
        }
      />
    </Routes>
  )
}

export default App
