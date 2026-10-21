const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    // 从请求头获取token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: '无访问令牌，请登录' });
    }

    const token = authHeader.split(' ')[1];

    try {
        // 验证token，取出用户信息
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // 把用户ID挂载到req上，后续接口直接用 req.user.id
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ message: '令牌无效或已过期' });
    }
};
