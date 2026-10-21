// src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Register from './pages/Register'
import Login from './pages/Login'
import Home from './pages/Home'
import EditProfile from './pages/EditProfile'
import ChangePwd from './pages/ChangePwd'


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/edit" element={<EditProfile />} />
        <Route path="/changepwd" element={<ChangePwd />} />

      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
