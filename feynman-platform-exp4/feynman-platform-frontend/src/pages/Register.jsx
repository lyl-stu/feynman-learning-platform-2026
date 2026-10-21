// src/pages/Register.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Register() {
  const [form, setForm] = useState({
    username: '',
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

  const submitRegister = async () => {
    const res = await fetch('http://localhost:3000/api/users/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(form)
    })
    const data = await res.json()
    alert(data.message)
    if (res.ok) {
      navigate('/login')
    }
  }

  return (
    <div style={{width: '400px', margin: '100px auto'}}>
      <h2>用户注册</h2>
      <div>
        <p>用户名</p>
        <input name="username" value={form.username} onChange={handleChange} />
      </div>
      <div>
        <p>邮箱</p>
        <input name="email" value={form.email} onChange={handleChange} />
      </div>
      <div>
        <p>密码</p>
        <input type="password" name="password" value={form.password} onChange={handleChange} />
      </div>
      <button onClick={submitRegister} style={{marginTop: '10px'}}>注册</button>
      <p>已有账号？<span onClick={()=>navigate('/login')} style={{color:'blue',cursor:'pointer'}}>去登录</span></p>
    </div>
  )
}
