import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function EditProfile() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', email: '' });
  const token = localStorage.getItem('token');

  // 页面加载先获取当前用户信息回填表单
  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch('http://localhost:3000/api/users/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (res.ok) {
        setForm({
          username: data.user.username,
          email: data.user.email
        });
      } else {
        alert(data.message);
        navigate('/login');
      }
    }
    fetchUser();
  }, [token, navigate]);

  const handleChange = (e) => {
    setForm({...form, [e.target.name]: e.target.value})
  }

  const submit = async () => {
    const res = await fetch('http://localhost:3000/api/users/profile', {
      method: 'PUT',
      headers: {
        'Content-Type':'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(form)
    })
    const data = await res.json();
    if(res.ok){
      alert(data.message);
      navigate('/'); // 修改成功跳回个人主页
    }else{
      alert(data.message);
    }
  }

  return (
    <div style={{padding:30}}>
      <h2>修改个人资料</h2>
      <div>
        <p>用户名</p>
        <input name="username" value={form.username} onChange={handleChange}/>
      </div>
      <div>
        <p>邮箱</p>
        <input name="email" value={form.email} onChange={handleChange}/>
      </div>
      <br/>
      <button onClick={submit}>保存修改</button>
      <button onClick={()=>navigate('/')}>返回主页</button>
    </div>
  )
}
