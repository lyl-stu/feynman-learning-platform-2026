import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ChangePwd() {
  const navigate = useNavigate();
  const [form, setForm] = useState({oldPassword:'', newPassword:''});
  const token = localStorage.getItem('token');

  const handleChange = (e) => {
    setForm({...form, [e.target.name]: e.target.value})
  }

  const submit = async () => {
    const res = await fetch('http://localhost:3000/api/users/password', {
      method: 'PUT',
      headers: {
        'Content-Type':'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(form)
    })
    const data = await res.json();
    alert(data.message);
    if(res.ok){
      // 修改密码成功，清空token，跳转登录
      localStorage.removeItem('token');
      navigate('/login');
    }
  }

  return (
    <div style={{padding:30}}>
      <h2>修改密码</h2>
      <div>
        <p>原密码</p>
        <input name="oldPassword" type="password" value={form.oldPassword} onChange={handleChange}/>
      </div>
      <div>
        <p>新密码</p>
        <input name="newPassword" type="password" value={form.newPassword} onChange={handleChange}/>
      </div>
      <br/>
      <button onClick={submit}>确认修改</button>
      <button onClick={()=>navigate('/')}>返回主页</button>
    </div>
  )
}
