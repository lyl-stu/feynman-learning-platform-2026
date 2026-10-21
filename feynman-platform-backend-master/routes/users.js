const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
// 注册接口
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // 检查用户是否已存在
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: '用户已存在' });
        }

        // 创建用户实例
        user = new User({
            username,
            email,
            password
        });

        // 密码加密
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        // 保存到数据库
        await user.save();

        // 注册成功，只返回提示，不生成token
        res.json({ message: '注册成功' });

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: '服务器错误' });
    }
});


// 登录接口
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: '邮箱或密码错误' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: '邮箱或密码错误' });
        }

        const payload = { user: { id: user.id } };
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRE },
            (err, token) => {
                if (err) throw err;
                res.json({ token, message: '登录成功' });
            }
        );

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: '服务器错误' });
    }
});

// 删除用户接口（测试清理用）
// @route   DELETE /api/users/:email
// @desc    根据邮箱删除指定用户
router.delete('/:email', async (req, res) => {
    try {
        const user = await User.findOneAndDelete({ email: req.params.email });
        if (!user) {
            return res.status(404).json({ message: '用户不存在' });
        }
        res.json({ message: '用户已删除' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: '服务器错误' });
    }
});

const auth = require('../middleware/auth');

// 获取个人信息
// @route   GET /api/users/profile
// @access  Private
router.get('/profile', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json({ user });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: '服务器错误' });
    }
});

// 修改用户资料
// @route   PUT /api/users/profile
// @access  Private
router.put('/profile', auth, async (req, res) => {
    try {
        const { username, email } = req.body;
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { $set: { username, email } },
            { new: true }
        ).select('-password');
        
        res.json({ user, message: '资料更新成功' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: '服务器错误' });
    }
});

// 修改密码
// @route   PUT /api/users/password
// @access  Private
router.put('/password', auth, async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const user = await User.findById(req.user.id);

        // 校验旧密码
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: '原密码错误' });
        }

        // 加密新密码
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        res.json({ message: '密码修改成功' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: '服务器错误' });
    }
});

module.exports = router;
