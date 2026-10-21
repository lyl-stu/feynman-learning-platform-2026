import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Home() {
  const [userInfo, setUserInfo] = useState(null)
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  useEffect(() => {
    if (!token) {
      alert('请先登录')
      navigate('/login')
      return
    }
    // 请求获取当前登录用户信息接口
    const getUserInfo = async () => {
      const res = await fetch('http://localhost:3000/api/users/profile', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await res.json()
      if (res.ok) {
        setUserInfo(data.user)
      } else {
        alert(data.message)
        localStorage.removeItem('token')
        navigate('/login')
      }
    }
    getUserInfo()
  }, [token, navigate])
  const logout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }
  return (
    <div style={{width:'400px',margin:'100px auto'}}>
      <h2>个人主页</h2>
      {userInfo && (
        <div>
          <p>用户名：{userInfo.username}</p>
          <p>邮箱：{userInfo.email}</p>
        </div>
      )}
      <button onClick={()=>navigate('/edit')}>修改资料</button>
      <button onClick={()=>navigate('/changepwd')}>修改密码</button>
      <button onClick={logout} style={{marginTop:'20px'}}>退出登录</button>
    </div>
  )
}
