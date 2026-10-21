const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;
app.use(cors());
// 解析JSON请求体
app.use(express.json());

// 挂载用户路由（所有用户相关接口统一走 /api/users 前缀）
app.use('/api/users', require('./routes/users'));
// 挂载知识点路由
app.use('/api/knowledge-points', require('./routes/knowledgePoints'));

// 连接MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB连接成功"))
    .catch(err => console.error("MongoDB连接失败：", err));

// 启动服务
app.listen(port, () => {
    console.log(`Feynman Platform running at http://localhost:${port}`);
});
