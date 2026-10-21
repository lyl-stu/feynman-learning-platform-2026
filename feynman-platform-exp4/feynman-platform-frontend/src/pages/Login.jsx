// src/pages/Login.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const [form, setForm] = useState({
    email: '',
    password: ''
  })
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const submitLogin = async () => {
    const res = await fetch('http://localhost:3000/api/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(form)
    })
    const data = await res.json()
    alert(data.message)
    if (res.ok) {
      // 把token存到浏览器本地存储
      localStorage.setItem('token', data.token)
      navigate('/')
    }
  }

  return (
    <div style={{ width: '400px', margin: '100px auto' }}>
      <h2>用户登录</h2>
      <div>
        <p>邮箱</p>
        <input name="email" value={form.email} onChange={handleChange} />
      </div>
      <div>
        <p>密码</p>
        <input type="password" name="password" value={form.password} onChange={handleChange} />
      </div>
      <button onClick={submitLogin} style={{ marginTop: '10px' }}>登录</button>
      <p>还没有账号？<span onClick={() => navigate('/register')} style={{ color: 'blue', cursor: 'pointer' }}>去注册</span></p>
    </div>
  )
}
